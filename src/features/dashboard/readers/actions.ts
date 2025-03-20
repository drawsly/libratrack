'use server';

import db from '@/lib/db';
import { revalidatePath } from 'next/cache';
import { z } from 'zod';
import { Prisma } from '@prisma/client';
import { ReaderSchema } from './validations';

export type ReaderFormValues = z.infer<typeof ReaderSchema>;

export type ReaderFilters = {
    searchQuery?: string | null;
    gender?: string | null;
    school_no?: number | null;
    page?: number;
    pageSize?: number;
};

export async function getReaders(filters: ReaderFilters = {}) {
    try {
        const {
            searchQuery,
            gender,
            school_no,
            page = 1,
            pageSize = 10
        } = filters;

        const skip = (page - 1) * pageSize;

        const where: Prisma.readersWhereInput = {};

        // Search query using OR logic
        if (searchQuery) {
            where.OR = [
                { name: { contains: searchQuery, mode: 'insensitive' } },
                { surname: { contains: searchQuery, mode: 'insensitive' } },
                { phone: { contains: searchQuery, mode: 'insensitive' } },
                { adress: { contains: searchQuery, mode: 'insensitive' } }
            ];
        }

        if (gender) {
            where.gender = gender;
        }

        if (school_no) {
            where.school_no = school_no;
        }

        const totalCount = await db.readers.count({ where });

        const readers = await db.readers.findMany({
            where,
            skip,
            take: pageSize,
            orderBy: { name: 'asc' },

        });

        return {
            readers,
            totalCount,
            pageCount: Math.ceil(totalCount / pageSize)
        };
    } catch (error) {
        console.error('Error getting readers:', error);
        throw new Error('Failed to get readers');
    }
}

export async function getGenderTypes() {
    try {
        const genders = await db.readers.findMany({
            select: {
                gender: true
            },
            distinct: ['gender'],
            where: {
                gender: {
                    not: null
                }
            }
        });

        const genderMap: Record<string, string> = {
            'E': 'Erkek',
            'K': 'Kadın',
        };

        return genders
            .filter((item) => item.gender)
            .map((item) => ({
                label: genderMap[item.gender as string] || item.gender as string,
                value: item.gender as string
            }))
            .sort((a, b) => a.label.localeCompare(b.label));
    } catch (error) {
        console.error('Error fetching gender types:', error);
        return [];
    }
}

export async function createReader(data: ReaderFormValues) {
    try {
        await db.readers.create({
            data: {
                name: data.name,
                surname: data.surname,
                gender: data.gender,
                school_no: data.school_no,
                phone: data.phone,
                adress: data.adress
            }
        });

        revalidatePath('/dashboard/readers');
        return { success: true };
    } catch (error) {
        console.error('Error creating reader:', error);
        return { success: false, error: 'Okuyucu eklenirken bir hata oluştu' };
    }
}

export async function updateReader(id: string, data: ReaderFormValues) {
    try {
        await db.readers.update({
            where: { id },
            data: {
                name: data.name,
                surname: data.surname,
                gender: data.gender,
                school_no: data.school_no,
                phone: data.phone,
                adress: data.adress
            }
        });

        revalidatePath('/dashboard/readers');
        return { success: true };
    } catch (error) {
        console.error('Error updating reader:', error);
        return { success: false, error: 'Okuyucu güncellenirken bir hata oluştu' };
    }
}

export async function deleteReader(id: string) {
    try {
        const activeLoans = await db.loans.findFirst({
            where: {
                reader_id: id
            }
        });

        if (activeLoans) {
            return {
                success: false,
                error:
                    'Bu okuyucunun ödünç aldığı kitaplar var. Silmeden önce kitaplar geri alınmalıdır.'
            };
        }

        await db.loans.deleteMany({
            where: { reader_id: id }
        });

        await db.readers.delete({
            where: { id }
        });

        revalidatePath('/dashboard/readers');
        return { success: true };
    } catch (error) {
        console.error(`Error deleting reader ${id}:`, error);
        return { success: false, error: 'Failed to delete reader' };
    }
}

export async function getReaderById(id: string) {
    try {
        const reader = await db.readers.findUnique({
            where: { id },
        });

        if (!reader) {
            return { success: false, error: 'Okuyucu bulunamadı' };
        }

        return { success: true, reader };
    } catch (error) {
        console.error('Error fetching reader:', error);
        return { success: false, error: 'Okuyucu getirilirken bir hata oluştu' };
    }
}

export async function getReaderNameById(readerId: string) {
    'use server';

    try {
        const reader = await db.readers.findUnique({
            where: { id: readerId },
            select: { name: true, surname: true }
        });

        return {
            success: true,
            readerName: reader ? `${reader.name} ${reader.surname}`.trim() : null
        };
    } catch (error) {
        console.error('Error fetching reader name:', error);
        return { success: false, readerName: null };
    }
}