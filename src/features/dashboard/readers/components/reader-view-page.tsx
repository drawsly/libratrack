import { getReaderById } from '../actions';
import { notFound } from 'next/navigation';
import ReaderForm from './reader-form';

type ReaderViewPageProps = {
  readerId: string;
};

export default async function ReaderViewPage({
  readerId
}: ReaderViewPageProps) {
  // const bookTypes = await getBookTypes();

  let reader = null;
  let pageTitle = 'Yeni Okuyucu Ekle';

  if (readerId !== 'new') {
    const result = await getReaderById(readerId);

    if (!result.success || !result.reader) {
      notFound();
    }

    reader = result.reader;
    pageTitle = `Okuyucu Düzenle: ${reader.name}`;
  }

  return <ReaderForm initialData={reader} pageTitle={pageTitle} />;
}
