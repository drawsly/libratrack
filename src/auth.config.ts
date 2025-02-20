import type { NextAuthConfig } from "next-auth"
import Credentials from "next-auth/providers/credentials"
import { verifyPassword } from "./lib/password"
import db from "./lib/db/db"
import { loginSchema } from "./lib/zod"

export const authConfig = {
    providers: [
        Credentials({
            async authorize(credentials) {
                try {
                    const validatedCredentials = loginSchema.parse(credentials);

                    const user = await db.user.findFirst({
                        where: {
                            email: validatedCredentials.email.toLowerCase().trim(),
                        },
                    });

                    if (!user) {
                        return null;
                    }

                    const isPasswordValid = await verifyPassword(
                        credentials?.password as string,
                        user.password
                    );

                    if (!isPasswordValid) {
                        return null;
                    }

                    return {
                        id: user.id,
                        email: user.email,
                        name: user.name || "",
                        surname: user.surname || "",
                        image: user.image || ""
                    };
                } catch {
                    return null;
                }
            }
        })
    ],
    callbacks: {
        async jwt({ token, user }) {
            if (user) {
                token.id = user.id;
                token.email = user.email;
                token.name = user.name;
                token.surname = user.surname;
                token.image = user.image;
            }
            return token;
        },
        async session({ token, session }) {
            if (token) {
                session.user.id = token.id as string;
                session.user.email = token.email as string;
                session.user.name = token.name as string;
                session.user.surname = token.surname as string;
                session.user.image = token.image as string;
            }
            return session;
        }
    },
    pages: {
        signIn: "/login",
    },
} satisfies NextAuthConfig;