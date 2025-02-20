import type { NextAuthConfig } from "next-auth"
import { PrismaAdapter } from '@auth/prisma-adapter'
import Credentials from "next-auth/providers/credentials"
import { verifyPassword } from "./lib/password"
import db from "./lib/db/db"
import { loginSchema } from "./lib/zod"

export default {
    providers: [
        Credentials({
            id: "credentials",
            name: "Credentials",
            credentials: {
                email: {},
                password: {}
            },
            async authorize(credentials) {
                const validatedCredentials = loginSchema.parse(credentials);

                const user = await db.user.findFirst({
                    where: {
                        email: validatedCredentials.email.toLowerCase().trim(),
                    },
                });

                if (!user) {
                    return null
                }

                const isPasswordValid = await verifyPassword(
                    credentials.password as string,
                    user.password
                );

                if (!isPasswordValid) {
                    return null
                }

                return user;
            }
        })
    ],
    adapter: PrismaAdapter(db),
    session: {
        strategy: "jwt",
        maxAge: 30 * 24 * 60 * 60, // 30 days
    },
    pages: {
        signIn: "/login"
    },
    callbacks: {
        async jwt({ token, account }) {
            if (account?.provider === "credentials") {
                token.credentials = true;
            }
            return token;
        }
    },
    debug: process.env.NODE_ENV === "development"
} satisfies NextAuthConfig