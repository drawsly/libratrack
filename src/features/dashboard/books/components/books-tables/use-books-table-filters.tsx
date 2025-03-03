'use client';

import { searchParams } from '@/lib/searchparams';
import { useQueryState } from 'nuqs';
import { useCallback, useMemo } from 'react';

export function useBooksTableFilters() {
  const [searchQuery, setSearchQuery] = useQueryState(
    'q',
    searchParams.q
      .withOptions({ shallow: false, throttleMs: 1000 })
      .withDefault('')
  );

  const [bookTypeFilter, setBookTypeFilter] = useQueryState(
    'book_type',
    searchParams.book_type.withOptions({ shallow: false }).withDefault('')
  );

  const [authorNameFilter, setAuthorNameFilter] = useQueryState(
    'author_name',
    searchParams.author_name.withOptions({ shallow: false }).withDefault('')
  );

  const [publisherFilter, setPublisherFilter] = useQueryState(
    'publisher',
    searchParams.publisher.withOptions({ shallow: false }).withDefault('')
  );

  const [page, setPage] = useQueryState(
    'page',
    searchParams.page.withDefault(1)
  );

  const resetFilters = useCallback(() => {
    setSearchQuery(null);
    setBookTypeFilter(null);
    setAuthorNameFilter(null);
    setPublisherFilter(null);
    setPage(1);
  }, [
    setSearchQuery,
    setBookTypeFilter,
    setAuthorNameFilter,
    setPublisherFilter,
    setPage
  ]);

  const isAnyFilterActive = useMemo(() => {
    return (
      !!searchQuery ||
      !!bookTypeFilter ||
      !!authorNameFilter ||
      !!publisherFilter
    );
  }, [searchQuery, bookTypeFilter, authorNameFilter, publisherFilter]);

  return {
    searchQuery,
    setSearchQuery,
    page,
    setPage,
    resetFilters,
    isAnyFilterActive,
    bookTypeFilter,
    setBookTypeFilter,
    authorNameFilter,
    setAuthorNameFilter,
    publisherFilter,
    setPublisherFilter
  };
}
