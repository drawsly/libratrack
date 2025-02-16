import 'server-only'

import { Lucia } from "lucia";
import { PrismaAdapter } from "@lucia-auth/adapter-prisma";
import { Prisma, PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

const adapter = new PrismaAdapter(prisma.sessions, prisma.users);

export const lucia = new Lucia(adapter, {
    sessionCookie: {
        attributes: {
            // set to `true` when using HTTPS
            secure: process.env.NODE_ENV === "production"
        }
    }
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

        const user = await prisma.users.create({
            data: {
                name,
                surname,
                email,
                password, // TODO: şifre argon ile hashlenecek
            },
        });
        return user;
    } catch (error) {
        throw error;
    }
}