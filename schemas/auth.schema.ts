import { z } from 'zod';

export const authSchema = z.object({
    name: z.string().min(3,
        { message: "Nama harus memiliki minimal 3 karakter" }
    ).max(255),
    email: z.string().email({ message: "Email tidak valid" }),
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
export const signInSchema = authSchema.pick({ password: true, email: true });
export type SignInSchema = z.infer<typeof signInSchema>;
export type AuthSchema = z.infer<typeof authSchema>;
