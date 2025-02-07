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
  title: z.string().min(1, { message: "Title is required" }),
  description: z.string().optional(),
  documentationUrl: z.string().optional(),
  documentationFiles: z.array(z.any()).optional(),
  location: z.string().optional(),
  date : z.date(),
    time: z.string(),
});

// Upload multiple files and return array of URLs
async function uploadFiles(files: File[], bucket: string = 'file-docs') {
  try {
    const uploadPromises = files.map(async (file) => {
      const fileExt = file.name.split('.').pop();
      const fileName = `${uuidv4()}.${fileExt}`;
      // Add images/ prefix to create folder structure
      const filePath = `images/${fileName}`;

      const { data, error } = await supabase.storage
        .from(bucket)
        .upload(filePath, file, {
          cacheControl: '3600',
          upsert: false
        });

      if (error) throw error;

      // Get public URL for the file in the images folder
      const { data: { publicUrl } } = supabase.storage
        .from(bucket)
        .getPublicUrl(filePath);

      return {
        url: publicUrl,
        path: filePath,
        id: data?.id || uuidv4(),
        fullPath: `${bucket}/${filePath}`
      };
    });

    // Wait for all uploads to complete
    const fileData = await Promise.all(uploadPromises);
    return fileData;
  } catch (error) {
    console.error('Error uploading files:', error);
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
    documentationFiles,
    documentationUrl,
    date,
    time,
    location,
  } = values;

  const validatedFields = eventSchema.safeParse({
    title,
    description,
    documentationFiles,
    documentationUrl,
    date,
    time,
    location,
  });

  if (!validatedFields.success) {
    return {
      errors: validatedFields.error.flatten().fieldErrors,
    };
  }

  try {
    // Handle multiple file uploads if files exist
    let fileData: { url: string; path: string; id: string; fullPath: string; }[] = [];
    if (documentationFiles && documentationFiles.length > 0) {
      fileData = await uploadFiles(documentationFiles);
    }

    // Create event with array of file data
    const event = await prisma.event.create({
      data: {
        title: validatedFields.data.title,
        description: validatedFields.data.description,
        documentationUrl: validatedFields.data.documentationUrl,
        documentationFiles: fileData, // Store complete file data
        date: validatedFields.data.date,
        time: validatedFields.data.time,
        userId: session.user.id,
        location: validatedFields.data.location,
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
      select:{
        id: true,
        title: true,
        description: true,
        date: true,
        time: true,
        location: true,             // tambahkan ini
        documentationUrl: true,
        documentationFiles: true,   // tambahkan ini
        userId: true,
        createdAt: true,
        updatedAt: true,
      },
      orderBy: {
        date: "asc",
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
