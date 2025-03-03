import { searchParamsCache } from '@/lib/searchparams';
import { DataTable } from '@/shared/components/ui/table/data-table';
import { columns } from './books-tables/columns';
import { getBooks } from '../actions';

type BooksListingPageProps = {};

export default async function BooksListingPage({}: BooksListingPageProps) {
  const page = Number(searchParamsCache.get('page')) || 1;
  const searchQuery = searchParamsCache.get('q');
  const bookType = searchParamsCache.get('book_type');
  const authorName = searchParamsCache.get('author_name');
  const publisher = searchParamsCache.get('publisher');
  const pageSize = Number(searchParamsCache.get('limit')) || 10;

  const filters = {
    page,
    pageSize,
    ...(searchQuery && { searchQuery }),
    ...(bookType && { book_type: bookType }),
    ...(authorName && { author_name: authorName }),
    ...(publisher && { publisher: publisher })
  };

  const { books, totalCount, pageCount } = await getBooks(filters);

  return <DataTable columns={columns} data={books} totalItems={totalCount} />;
}
