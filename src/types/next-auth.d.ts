import NextAuth, { DefaultSession } from "next-auth";

declare module "next-auth" {
    interface Session {
        user: {
            id: string;
            surname: string;
        } & DefaultSession["user"]
    }

    interface User {
        id: string;
        email: string;
        name: string;
        surname: string;
        image?: string;
    }
}

declare module "next-auth/jwt" {
    interface JWT {
        id: string;
        email: string;
        name: string;
        surname: string;
        image?: string;
    }
}