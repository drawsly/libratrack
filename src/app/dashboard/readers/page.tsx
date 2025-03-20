import ReadersPage from '@/features/dashboard/readers/components/readers';
import { SearchParams } from 'nuqs/server';

type pageProps = {
  searchParams: Promise<SearchParams>;
};

export const metadata = {
  title: 'Okuyucu İşlemleri',
  description:
    'Kütüphane koleksiyonunuzu görüntüleyin, filtreleyin, yeni kitaplar ekleyin ve mevcut kayıtları düzenleyin.'
};

export default function Readers(props: pageProps) {
  const searchParams = props.searchParams;

  return <ReadersPage searchParams={searchParams} />;
}
