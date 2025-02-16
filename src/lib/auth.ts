import 'server-only'

import { Lucia } from "lucia";
import { PrismaAdapter } from "@lucia-auth/adapter-prisma";
import { Prisma, PrismaClient } from "@prisma/client";
import * as bcrypt from 'bcryptjs';
import { cookies } from 'next/headers';

const prisma = new PrismaClient();

const adapter = new PrismaAdapter(prisma.sessions, prisma.users);

export const lucia = new Lucia(adapter, {
    sessionCookie: {
        attributes: {
            secure: process.env.NODE_ENV === "production",
            sameSite: "lax",
        }
    },
});

// IMPORTANT!
declare module "lucia" {
    interface Register {
        Lucia: typeof lucia;
    }
}

export async function createUser(name: string, surname: string, email: string, password: string) {
    try {
        const existingUser = await prisma.users.findUnique({
            where: {
                email: email
            }
        });

        if (existingUser) {
            throw new Prisma.PrismaClientKnownRequestError('', {
                code: 'P2002',
                clientVersion: '',
                meta: { target: ['email'] }
            });
        }

        const hashedPassword = await bcrypt.hash(password, 10);

        const user = await prisma.users.create({
            data: {
                name,
                surname,
                email,
                password: hashedPassword,
            },
        });
        return user;
    } catch (error) {
        throw error;
    }
}

export async function verifyPassword(password: string, hashedPassword: string) {
    return await bcrypt.compare(password, hashedPassword);
}

export async function createAuthSession(userId: string) {
    const session = await lucia.createSession(userId, {});

    const sessionCookie = lucia.createSessionCookie(session.id);

    (await cookies()).set(
        sessionCookie.name,
        sessionCookie.value,
        sessionCookie.attributes
    );
}