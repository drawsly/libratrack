'use server';

import { LoginState, RegisterState } from '@/features/auth/types/auth';
import { signIn } from '@/auth';
import { loginSchema, registerSchema } from '@/lib/zod';
import { hashPassword } from '@/lib/password';
import { AuthError } from 'next-auth';
import db from '@/lib/db';

export async function registerUser(
  prevState: RegisterState | undefined,
  formData: FormData
): Promise<RegisterState> {
  try {
    const data = Object.fromEntries(formData);
    const parsed = registerSchema.safeParse(data);

    if (!parsed.success) {
      return { error: parsed.error.errors[0].message };
    }

    const existingUser = await db.user.findUnique({
      where: {
        email: parsed.data.email.toLowerCase().trim()
      }
    });

    if (existingUser) {
      return { error: 'Bu email adresi zaten kullanımda' };
    }

    const hashedPassword = await hashPassword(parsed.data.password);

    await db.user.create({
      data: {
        email: parsed.data.email.toLowerCase().trim(),
        password: hashedPassword,
        name: parsed.data.name.trim(),
        surname: parsed.data.surname.trim(),
        image: null
      }
    });

    const signInResult = await signIn('credentials', {
      email: parsed.data.email,
      password: parsed.data.password,
      redirect: false
    });

    if (signInResult?.error) {
      return { error: 'Kayıt başarılı ancak giriş yapılamadı.' };
    }

    return { success: true, redirect: '/dashboard' };
  } catch (error) {
    console.error('Registration error:', error);
    if (error instanceof Error) {
      return { error: error.message };
    }
    return { error: 'Kullanıcı kaydedilirken bir hata oluştu.' };
  }
}

export async function loginUser(
  prevState: LoginState | undefined,
  formData: FormData
): Promise<LoginState> {
  try {
    const validatedFields = loginSchema.safeParse({
      email: formData.get('email'),
      password: formData.get('password')
    });

    if (!validatedFields.success) {
      return {
        error: validatedFields.error.errors[0].message,
        success: false
      };
    }

    await signIn('credentials', {
      email: validatedFields.data.email.toLowerCase().trim(),
      password: validatedFields.data.password,
      redirect: false
    });

    return {
      success: true,
      redirect: '/dashboard'
    };
  } catch (error) {
    if (error instanceof AuthError) {
      switch (error.type) {
        case 'CredentialsSignin':
          return { error: 'Eposta veya şifre yanlış' };
        default:
          return { error: 'Beklenmeyen hata ile karşılaşıldı.' };
      }
    }

    throw error;
  }
}
