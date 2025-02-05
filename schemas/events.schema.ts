import z from "zod";

export const eventSchema = z.object({
  title: z.string().min(1, { message: "Title is required" }),
  description: z.string().optional(),
  documentationUrl: z.string().optional(),
  documentationFile: z.instanceof(File).optional(),
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