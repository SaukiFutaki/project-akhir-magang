import { z } from 'zod';

export const authSchema = z.object({
    username: z.string().min(3).max(255).optional(),
    email: z.string().email().optional(),
    password: z
        .string()
        .min(8, { message: "Password harus memiliki minimal 8 karakter" })
        .max(255, { message: "Password terlalu panjang" })
        .refine(
            (password) =>
                /[A-Z]/.test(password) && // Huruf besar
                /[a-z]/.test(password) && // Huruf kecil
                /\d/.test(password) &&   // Angka
                /[\W_]/.test(password),  // Tanda baca atau karakter spesial
            { message: "Password harus mengandung huruf besar, huruf kecil, angka, dan tanda baca" }
        ),
});

export type AuthSchema = z.infer<typeof authSchema>;
