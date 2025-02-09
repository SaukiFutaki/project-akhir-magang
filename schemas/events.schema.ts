import { MAX_FILE_SIZE, MAX_FILES } from "@/lib/constant";
import z from "zod";




export const eventSchema = z.object({
  title: z.string().min(1, { message: "Title is required" }),
  description: z.string().optional(),
  documentationUrl: z.string().optional(),
  documentationFiles: z
    .array(
      z.custom<File>((file) => file instanceof File, "Please upload valid files")
    )
    .refine((files) => files.length <= MAX_FILES, {
      message: `You can only upload up to ${MAX_FILES} files`,
    })
    .refine(
      (files) => files.every((file) => file.size <= MAX_FILE_SIZE),
      `Each file must be less than 10MB`
    )
    .refine(
      (files) => files.every((file) => file.type.startsWith('image/')),
      "Only image files are allowed"
    )
    .optional(),
  location: z.string().optional(),
  date : z.date(),
    time: z.string(),
});


export type FormEventValues = z.infer<typeof eventSchema>;

export const editEventSchema = z.object({
    title: z.string().min(1, { message: "Title is required" }),
    description: z.string().optional(),
    documentationUrl: z.string().url({ message: "Invalid URL" }).optional(),
})

export type FormEditEventValues = z.infer<typeof editEventSchema>;