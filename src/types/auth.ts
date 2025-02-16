export type RegisterState = {
    error?: string;
    success?: boolean;
    user?: {
        name: string | null;
        surname: string | null;
        email: string;
        password: string;
        id: number;
        image: string | null;
    };
};

export type LoginState = {
    error?: string;
    success?: boolean;
};