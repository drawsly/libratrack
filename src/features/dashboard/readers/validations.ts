import { z } from "zod";

export const ReaderSchema = z.object({
    name: z.string().min(1, "Adı gereklidir").max(50).nullable(),
    surname: z.string().min(1, "Soyadı gereklidir").max(50).nullable(),
    gender: z.string().max(1).nullable(),
    school_no: z.number().int().positive().nullable(),
    phone: z.string().min(1, "Telefon numarası gereklidir").max(20).nullable(),
    adress: z.string().nullable(),
});