import { getBookById, getBookTypes } from '../actions';
import { notFound } from 'next/navigation';
import BookForm from './book-form';

type BookViewPageProps = {
  bookId: string;
};

export default async function BookViewPage({ bookId }: BookViewPageProps) {
  const bookTypes = await getBookTypes();

  let book = null;
  let pageTitle = 'Yeni Kitap Ekle';

  if (bookId !== 'new') {
    const result = await getBookById(bookId);

    if (!result.success || !result.book) {
      notFound();
    }

    book = result.book;
    pageTitle = `Kitabı Düzenle: ${book.book_name}`;
  }

  return (
    <BookForm initialData={book} bookTypes={bookTypes} pageTitle={pageTitle} />
  );
}
