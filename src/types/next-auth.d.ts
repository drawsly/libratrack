import { DefaultSession, DefaultUser } from "next-auth"
import { JWT, DefaultJWT } from "next-auth/jwt"

declare module "next-auth" {
    interface Session {
        user: {
            id: string
            email: string
            name: string
            surname: string
            image: string
        } & DefaultSession["user"]
    }

    interface User extends DefaultUser {
        id: string
        email: string
        name?: string | null
        surname?: string | null
        image?: string | null
    }
}