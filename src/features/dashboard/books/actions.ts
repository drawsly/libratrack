'use server';

import db from '@/lib/db';

import { revalidatePath } from 'next/cache';
import { z } from 'zod';
import { Prisma } from '@prisma/client';
import { BookSchema } from './validations';

export type BookFormValues = z.infer<typeof BookSchema>;

export type BookFilters = {
  searchQuery?: string | null;
  book_type?: string | null;
  author_name?: string | null;
  publisher?: string | null;
  page?: number;
  pageSize?: number;
};

export async function getBooks(filters: BookFilters = {}) {
  try {
    const {
      searchQuery,
      book_type,
      author_name,
      publisher,
      page = 1,
      pageSize = 10
    } = filters;

    const skip = (page - 1) * pageSize;

    const where: Prisma.booksWhereInput = {};

    // Arama sorgusu için OR mantığı
    if (searchQuery) {
      where.OR = [
        { book_name: { contains: searchQuery, mode: 'insensitive' } },
        { author_name: { contains: searchQuery, mode: 'insensitive' } },
        { publisher: { contains: searchQuery, mode: 'insensitive' } }
      ];
    }

    if (book_type) {
      const bookTypes = book_type.split('.');

      if (bookTypes.length > 1) {
        where.OR = [
          ...(where.OR || []),
          ...bookTypes.map((type) => ({ book_type: type }))
        ];
      } else {
        where.book_type = book_type;
      }
    }

    if (author_name) {
      const authorNames = author_name.split('.');

      if (authorNames.length > 1) {
        where.OR = [
          ...(where.OR || []),
          ...authorNames.map((name) => ({ author_name: name }))
        ];
      } else {
        where.author_name = author_name;
      }
    }

    if (publisher) {
      const publishers = publisher.split('.');

      if (publisher.length > 1) {
        where.OR = [
          ...(where.OR || []),
          ...publishers.map((name) => ({ publisher: name }))
        ];
      } else {
        where.publisher = publisher;
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
    console.error('Error fetching author names:', error);
    return [];
  }
}

export async function getPublishers() {
  try {
    const types = await db.books.findMany({
      select: {
        publisher: true
      },
      distinct: ['publisher'],
      where: {
        publisher: {
          not: null
        }
      }
    });

    return types
      .filter((type) => type.publisher)
      .map((type) => ({
        label: type.publisher as string,
        value: type.publisher as string
      }))
      .sort((a, b) => a.label.localeCompare(b.label));
  } catch (error) {
    console.error('Error fetching publishers:', error);
    return [];
  }
}

export async function createBook(data: BookFormValues) {
  try {
    await db.books.create({
      data: {
        book_name: data.book_name,
        author_name: data.author_name,
        publisher: data.publisher,
        publish_year: data.publish_year,
        page_count: data.page_count,
        book_type: data.book_type,
        book_case: data.book_case,
        shelf: data.shelf,
        row: data.row
      }
    });

    revalidatePath('/dashboard/books');
    return { success: true };
  } catch (error) {
    console.error('Error creating book:', error);
    return { success: false, error: 'Kitap eklenirken bir hata oluştu' };
  }
}

export async function updateBook(id: string, data: BookFormValues) {
  try {
    await db.books.update({
      where: { id },
      data: {
        book_name: data.book_name,
        author_name: data.author_name,
        publisher: data.publisher,
        publish_year: data.publish_year,
        page_count: data.page_count,
        book_type: data.book_type,
        book_case: data.book_case,
        shelf: data.shelf,
        row: data.row
      }
    });

    revalidatePath('/dashboard/books');
    return { success: true };
  } catch (error) {
    console.error('Error updating book:', error);
    return { success: false, error: 'Kitap güncellenirken bir hata oluştu' };
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
        loans: true
      }
    });

    if (!book) {
      return { success: false, error: 'Kitap bulunamadı' };
    }

    return { success: true, book };
  } catch (error) {
    console.error('Error fetching book:', error);
    return { success: false, error: 'Kitap getirilirken bir hata oluştu' };
  }
}

export async function getBookNameById(bookId: string) {
  'use server';

  try {
    const book = await db.books.findUnique({
      where: { id: bookId },
      select: { book_name: true }
    });

    return { success: true, bookName: book?.book_name || null };
  } catch (error) {
    console.error('Error fetching book name:', error);
    return { success: false, bookName: null };
  }
}
