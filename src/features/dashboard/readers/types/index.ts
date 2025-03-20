export interface Reader {
    id: string;
    name: string | null;
    surname: string | null;
    gender: string | null;
    school_no: number | null;
    phone: string | null;
    adress: string | null;
}

export type ReaderFormValues = {
    name: string | null;
    surname: string | null;
    gender: string | null;
    school_no: number | null;
    phone: string | null;
    adress: string | null;
};