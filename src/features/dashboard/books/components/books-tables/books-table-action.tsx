'use client';

import { DataTableFilterBox } from '@/shared/components/ui/table/data-table-filter-box';
import { DataTableResetFilter } from '@/shared/components/ui/table/data-table-reset-filter';
import { DataTableSearch } from '@/shared/components/ui/table/data-table-search';
import { useBooksTableFilters } from './use-books-table-filters';

interface BooksTableActionProps {
  bookTypes: { label: string; value: string }[];
  authorName: { label: string; value: string }[];
  publisher: { label: string; value: string }[];
}

export default function BooksTableAction({
  bookTypes,
  authorName,
  publisher
}: BooksTableActionProps) {
  const {
    bookTypeFilter,
    setBookTypeFilter,
    authorNameFilter,
    setAuthorNameFilter,
    publisherFilter,
    setPublisherFilter,
    isAnyFilterActive,
    resetFilters,
    searchQuery,
    setPage,
    setSearchQuery
  } = useBooksTableFilters();

  return (
    <div className='flex flex-wrap items-center gap-4'>
      <DataTableSearch
        searchKey='Kitap'
        searchQuery={searchQuery}
        setSearchQuery={setSearchQuery}
        setPage={setPage}
      />
      <DataTableFilterBox
        filterKey='Kitap Türü'
        title='Kitap Türü'
        options={bookTypes}
        setFilterValue={setBookTypeFilter}
        filterValue={bookTypeFilter}
      />
      <DataTableFilterBox
        filterKey='Yazar'
        title='Yazar'
        options={authorName}
        setFilterValue={setAuthorNameFilter}
        filterValue={authorNameFilter}
      />
      <DataTableFilterBox
        filterKey='Yayınevi'
        title='Yayınevi'
        options={publisher}
        setFilterValue={setPublisherFilter}
        filterValue={publisherFilter}
      />
      <DataTableResetFilter
        isFilterActive={isAnyFilterActive}
        onReset={resetFilters}
      />
    </div>
  );
}
