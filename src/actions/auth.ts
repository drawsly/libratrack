'use server'

import { z } from "zod";

const registerSchema = z.object({
    name: z.string().min(2, "İsim en az 2 karakter olmalı"),
    surname: z.string().min(2, "Soyisim en az 2 karakter olmalı"),
    email: z.string().email("Geçerli bir email adresi giriniz"),
    password: z.string().min(6, "Şifre en az 6 karakter olmalı"),
    confirmPassword: z.string()
}).refine((data) => data.password === data.confirmPassword, {
    message: "Şifreler uyuşmuyor.",
    path: ["confirmPassword"]
});

export async function registerUser(prevState: any, formData: FormData) {
    await new Promise((resolve) => setTimeout(resolve, 2000));
    const data = Object.fromEntries(formData);

    const parsed = registerSchema.safeParse(data);
    if (!parsed.success) {
        return { error: parsed.error.errors[0].message };
    }

}
