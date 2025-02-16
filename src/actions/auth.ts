'use server'

import { z } from "zod";
import { LoginState, RegisterState } from "@/types/auth";
import { PrismaClient } from "@prisma/client";
import { createAuthSession } from "@/lib/auth";
import * as bcrypt from "bcryptjs";

const prisma = new PrismaClient();

const loginSchema = z.object({
    email: z.string().email("Geçerli bir email adresi giriniz"),
    password: z.string().min(1, "Şifre gereklidir"),
});

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

export async function registerUser(prevState: RegisterState | undefined, formData: FormData): Promise<RegisterState> {
    const data = Object.fromEntries(formData);
    const parsed = registerSchema.safeParse(data);

    if (!parsed.success) {
        return { error: parsed.error.errors[0].message };
    }

    try {
        const existingUser = await prisma.users.findUnique({
            where: { email: parsed.data.email }
        });

        if (existingUser) {
            return { error: "Bu email adresi zaten kullanılıyor." };
        }

        const hashedPassword = await bcrypt.hash(parsed.data.password, 10);

        const user = await prisma.users.create({
            data: {
                name: parsed.data.name,
                surname: parsed.data.surname,
                email: parsed.data.email,
                password: hashedPassword,
            },
        });

        await createAuthSession(user.id);


        return { success: true };
    } catch (error) {
        console.error("Register error:", error);
        return { error: "Kullanıcı kaydedilirken bir hata oluştu." };
    }
}

export async function loginUser(prevState: any, formData: FormData): Promise<LoginState> {
    try {
        const data = Object.fromEntries(formData);
        const parsed = loginSchema.safeParse(data);

        if (!parsed.success) {
            return { error: parsed.error.errors[0].message };
        }

        const user = await prisma.users.findUnique({
            where: { email: parsed.data.email }
        });

        if (!user) {
            return { error: "Email veya şifre hatalı" };
        }

        const validPassword = await bcrypt.compare(
            parsed.data.password,
            user.password
        );

        if (!validPassword) {
            return { error: "Email veya şifre hatalı" };
        }

        await createAuthSession(user.id);

        return { success: true };

    } catch (error) {
        console.error("Login error:", error);
        return { error: "Giriş yapılırken bir hata oluştu" };
    }
}