import { Loan } from '../loans/types';

export type Book = {
  id: string;
  book_name: string | null;
  author_name: string | null;
  publisher: string | null;
  publish_year: number | null;
  page_count: number | null;
  book_type: string | null;
  book_case: string | null;
  shelf: number | null;
  row: number | null;
  entrusted: boolean | null;
  loans: Loan[];
};
