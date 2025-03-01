'use server';

import db from '@/lib/db';
import { revalidatePath } from 'next/cache';
import { z } from 'zod';
import { Prisma } from '@prisma/client';

const BookSchema = z.object({
  book_name: z.string().nullable(),
  author_name: z.string().nullable(),
  publisher: z.string().nullable(),
  publish_year: z.number().nullable(),
  page_count: z.number().nullable(),
  book_type: z.string().nullable(),
  book_case: z.string().nullable(),
  shelf: z.number().nullable(),
  row: z.number().nullable(),
  entrusted: z.boolean().default(false).nullable()
});

export type BookFormValues = z.infer<typeof BookSchema>;

export type BookFilters = {
  searchQuery?: string | null;
  book_type?: string | null;
  author_name?: string | null;
  page?: number;
  pageSize?: number;
};

export async function getBooks(filters: BookFilters = {}) {
  try {
    const { searchQuery, book_type, author_name, page = 1, pageSize = 10 } = filters;

    const skip = (page - 1) * pageSize;

    const where: Prisma.booksWhereInput = {};

    // Arama sorgusu için OR mantığı
    if (searchQuery) {
      where.OR = [
        { book_name: { contains: searchQuery, mode: 'insensitive' } },
        { author_name: { contains: searchQuery, mode: 'insensitive' } }
      ];
    }

    // book_type için çoklu değer desteği
    if (book_type) {
      // Nokta (.) ile ayrılmış değerleri bir diziye dönüştür
      const bookTypes = book_type.split('.');

      if (bookTypes.length > 1) {
        // Eğer birden çok kitap türü varsa, OR koşulu oluştur
        where.OR = [
          ...(where.OR || []), // Mevcut OR koşullarını koru
          ...bookTypes.map(type => ({ book_type: type }))
        ];
      } else {
        // Tek bir kitap türü varsa normal kontrol yap
        where.book_type = book_type;
      }
    }

    // author_name için çoklu değer desteği
    if (author_name) {
      // Nokta (.) ile ayrılmış değerleri bir diziye dönüştür
      const authorNames = author_name.split('.');

      if (authorNames.length > 1) {
        // Eğer birden çok yazar adı varsa, OR koşulu oluştur
        where.OR = [
          ...(where.OR || []), // Mevcut OR koşullarını koru
          ...authorNames.map(name => ({ author_name: name }))
        ];
      } else {
        // Tek bir yazar adı varsa normal kontrol yap
        where.author_name = author_name;
      }
    }

    const totalCount = await db.books.count({ where });

    const books = await db.books.findMany({
      where,
      skip,
      take: pageSize,
      orderBy: { book_name: 'asc' },
      include: {
        loans: {
          where: {}
        }
      }
    });

    return {
      books,
      totalCount,
      pageCount: Math.ceil(totalCount / pageSize)
    };
  } catch (error) {
    console.error('Error getting books:', error);
    throw new Error('Failed to get books');
  }
}

export async function getBookTypes() {
  try {
    const types = await db.books.findMany({
      select: {
        book_type: true
      },
      distinct: ['book_type'],
      where: {
        book_type: {
          not: null
        }
      }
    });

    return types
      .filter((type) => type.book_type)
      .map((type) => ({
        label: type.book_type as string,
        value: type.book_type as string
      }))
      .sort((a, b) => a.label.localeCompare(b.label));
  } catch (error) {
    console.error('Error fetching book types:', error);
    return [];
  }
}

export async function getAuthorNames() {
  try {
    const types = await db.books.findMany({
      select: {
        author_name: true
      },
      distinct: ['author_name'],
      where: {
        author_name: {
          not: null
        }
      }
    });

    return types
      .filter((type) => type.author_name)
      .map((type) => ({
        label: type.author_name as string,
        value: type.author_name as string
      }))
      .sort((a, b) => a.label.localeCompare(b.label));
  } catch (error) {
    console.error('Error fetching book types:', error);
    return [];
  }
}

export async function createBook(data: BookFormValues) {
  try {
    const validatedData = BookSchema.parse(data);

    const book = await db.books.create({
      data: validatedData
    });

    revalidatePath('/dashboard/books');
    return { success: true, book };
  } catch (error) {
    console.error('Error creating book:', error);
    return { success: false, error: 'Failed to create book' };
  }
}

export async function updateBook(id: string, data: BookFormValues) {
  try {
    const validatedData = BookSchema.parse(data);

    const book = await db.books.update({
      where: { id },
      data: validatedData
    });

    revalidatePath('/dashboard/books');
    revalidatePath(`/dashboard/books/${id}`);
    return { success: true, book };
  } catch (error) {
    console.error(`Error updating book ${id}:`, error);
    return { success: false, error: 'Failed to update book' };
  }
}

export async function deleteBook(id: string) {
  try {
    const activeLoans = await db.loans.findFirst({
      where: {
        book_id: id
      }
    });

    if (activeLoans) {
      return {
        success: false,
        error:
          'Bu kitap ödünç verilmiş durumda. Silmeden önce geri alınmalıdır.'
      };
    }

    await db.loans.deleteMany({
      where: { book_id: id }
    });

    await db.books.delete({
      where: { id }
    });

    revalidatePath('/dashboard/books');
    return { success: true };
  } catch (error) {
    console.error(`Error deleting book ${id}:`, error);
    return { success: false, error: 'Failed to delete book' };
  }
}

export async function getBookById(id: string) {
  try {
    const book = await db.books.findUnique({
      where: { id },
      include: {
        loans: {
          include: {
            users: true
          },
          orderBy: {
            loan_date: 'desc'
          }
        }
      }
    });

    if (!book) {
      return { success: false, error: 'Book not found' };
    }

    return { success: true, book };
  } catch (error) {
    console.error(`Error getting book ${id}:`, error);
    return { success: false, error: 'Failed to get book details' };
  }
}
