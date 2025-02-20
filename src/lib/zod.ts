import { z } from "zod";

const loginSchema = z.object({
    email: z.string().email("Geçerli bir email adresi giriniz"),
    password: z.string().min(1, "Şifre gereklidir"),
})

const registerSchema = z.object({
    name: z.string().min(2, "İsim en az 2 karakter olmalı"),
    surname: z.string().min(2, "Soyisim en az 2 karakter olmalı"),
    email: z.string().email("Geçerli bir email adresi giriniz"),
    password: z.string().min(6, "Şifre en az 6 karakter olmalı"),
    confirmPassword: z.string()
}).refine((data) => data.password === data.confirmPassword, {
    message: "Şifreler uyuşmuyor.",
    path: ["confirmPassword"]
})

type LoginSchema = z.infer<typeof loginSchema>;
type RegisterSchema = z.infer<typeof registerSchema>;

export { loginSchema, registerSchema, type LoginSchema, type RegisterSchema };