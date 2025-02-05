"use server";

import { auth } from "@/auth";
import { headers } from "next/headers";
import { redirect } from "next/navigation";
import prisma from "./prisma";
import { z } from "zod";
import { FormEditEventValues, FormEventValues } from "@/schemas/events.schema";
import { supabase } from "./supabase";
import { v4 as uuidv4 } from 'uuid';

export async function signOut() {
  await auth.api.signOut({
    headers: await headers(),
  });
  redirect("/");
}

const eventSchema = z.object({
  title: z.string().min(1, "Title is required"),
  description: z.string().optional(),
  date: z.date(),
  time: z.string(),
  documentationUrl: z.string().url().optional(),
  documentationFile: z.instanceof(File).optional(),
});

async function uploadFile(file: File, bucket: string = 'file-docs') {
  try {
    const fileExt = file.name.split('.').pop();
    const fileName = `${uuidv4()}.${fileExt}`;
    const filePath = `${fileName}`;

    const { data, error } = await supabase.storage
      .from(bucket)
      .upload(filePath, file);



    if (error) throw error;

    // Get public URL
    const { data: { publicUrl } } = supabase.storage
      .from(bucket)
      .getPublicUrl(filePath);

    return publicUrl;
  } catch (error) {
    console.error('Error uploading file:', error);
    throw error;
  }
}


export async function createEvent(values: FormEventValues) {
  const session = await auth.api.getSession({
    headers: await headers(),
  });
  if (!session?.user) {
    return { error: "Unauthorized" };
  }

  const {
    title,
    description,
    documentationFile,
    documentationUrl,
    date,
    time,
  } = values;

   console.log(title, description, documentationFile, documentationUrl, date);

  const validatedFields = eventSchema.safeParse({
    title,
    description,
    documentationFile,
    documentationUrl,
    date,
    time,
  });

  if (!validatedFields.success) {
    return {
      errors: validatedFields.error.flatten().fieldErrors,
    };
  }

  try {
    // Handle file upload if exists
    let fileUrl: string | undefined;
    if (documentationFile) {
      fileUrl = await uploadFile(documentationFile);
    }

    // Create event with file URL if uploaded
    const event = await prisma.event.create({
      data: {
        title: validatedFields.data.title,
        description: validatedFields.data.description,
        documentationUrl: validatedFields.data.documentationUrl,
        documentationFile: fileUrl,
        date: validatedFields.data.date,
        time: validatedFields.data.time,
        userId: session.user.id,
      },
    });

    return { success: true, event };
  } catch (error) {
    console.error('Error in createEvent:', error);
    return { error: "Failed to create event" };
  }
}

export async function getEvents() {
  try {
    const events = await prisma.event.findMany({
      orderBy: {
        createdAt: "desc",
      },
    });
    return { success: true, events };
  } catch {
    return { error: "Failed to fetch events" };
  }
}

export async function updateEvent(id: string, values: FormEditEventValues) {
  console.log(values, id);
  const session = await auth.api.getSession({
    headers: await headers(),
  });
  if (!session?.user) {
    return { error: "Unauthorized" };
  }
  const { title, description, documentationUrl } = values;

  const validatedFields = eventSchema.safeParse({
    title,
    description,
    documentationUrl,
  });

  if (!validatedFields.success) {
    return {
      errors: validatedFields.error.flatten().fieldErrors,
    };
  }

  try {
    const event = await prisma.event.update({
      where: {
        id,
      },
      data: {
        title: validatedFields.data.title,
        description: validatedFields.data.description,
        documentationUrl: validatedFields.data.documentationUrl,
      },
    });

    return { success: true, event };
  } catch {
    return { error: "Failed to update event" };
  }
}

export async function deleteEvent(id: string) {
  const session = await auth.api.getSession({
    headers: await headers(),
  });
  if (!session?.user) {
    return { error: "Unauthorized" };
  }

  try {
    await prisma.event.delete({
      where: {
        id,
        userId: session.user.id,
      },
    });

    return { success: true };
  } catch {
    return { error: "Failed to delete event" };
  }
}
