'use server'

import { createUser } from "@/lib/auth";
import { RegisterState } from "@/types/auth";
import { z } from "zod";
import { PrismaClient, Prisma } from "@prisma/client";

const prisma = new PrismaClient();

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

export async function registerUser(prevState: RegisterState | undefined, formData: FormData) {
    const data = Object.fromEntries(formData);

    const parsed = registerSchema.safeParse(data);
    if (!parsed.success) {
        return { error: parsed.error.errors[0].message };
    }

    const name = data.name as string;
    const surname = data.surname as string;
    const email = data.email as string;
    const password = data.password as string;

    try {
        const user = await createUser(name, surname, email, password);
        return { success: true };
    } catch (error) {
        if (error instanceof Prisma.PrismaClientKnownRequestError) {
            // P2002 kodu unique constraint ihlali anlamına gelir
            if (error.code === 'P2002') {
                const target = error.meta?.target;
                if (Array.isArray(target) && target.includes('email')) {
                    return { error: "Bu email adresi zaten kullanılıyor." };
                }
            }
        }
        return { error: "Kullanıcı kaydedilirken bir hata oluştu." };
    }
}