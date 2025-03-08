import BooksPage from '@/features/dashboard/books/components/books';
import { SearchParams } from 'nuqs/server';

type pageProps = {
  searchParams: Promise<SearchParams>;
};

export const metadata = {
  title: 'Kitap İşlemleri',
  description:
    'Kütüphane koleksiyonunuzu görüntüleyin, filtreleyin, yeni kitaplar ekleyin ve mevcut kayıtları düzenleyin.'
};

export default function Books(props: pageProps) {
  const searchParams = props.searchParams;

  return <BooksPage searchParams={searchParams} />;
}
