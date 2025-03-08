import * as z from 'zod';

export const BookSchema = z.object({
  book_name: z.string().nullable(),
  author_name: z.string().nullable(),
  publisher: z.string().nullable(),
  publish_year: z.number().nullable(),
  page_count: z.number().nullable(),
  book_type: z.string().nullable(),
  book_case: z.string().nullable(),
  shelf: z.number().nullable(),
  row: z.number().nullable()
});
