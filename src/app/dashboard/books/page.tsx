import BooksPage from '@/features/dashboard/books/components/books';
import { SearchParams } from 'nuqs/server';

type pageProps = {
  searchParams: Promise<SearchParams>;
};

export default function Books(props: pageProps) {
  const searchParams = props.searchParams;

  return <BooksPage searchParams={searchParams} />;
}
