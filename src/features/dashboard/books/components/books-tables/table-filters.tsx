import { getAuthorNames, getBookTypes, getPublishers } from '../../actions';
import BooksTableAction from './books-table-action';

export default async function TableFilters() {
  const [bookTypes, authorNames, publisher] = await Promise.all([
    getBookTypes(),
    getAuthorNames(),
    getPublishers()
  ]);

  return (
    <BooksTableAction
      bookTypes={bookTypes}
      authorName={authorNames}
      publisher={publisher}
    />
  );
}
