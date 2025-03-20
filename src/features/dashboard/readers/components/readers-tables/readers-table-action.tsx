'use client';

import { DataTableFilterBox } from '@/shared/components/ui/table/data-table-filter-box';
import { DataTableResetFilter } from '@/shared/components/ui/table/data-table-reset-filter';
import { DataTableSearch } from '@/shared/components/ui/table/data-table-search';
import { useReadersTableFilters } from './use-readers-table-filters';

interface ReadersTableActionProps {}

export default function ReadersTableAction({}: ReadersTableActionProps) {
  const {
    isAnyFilterActive,
    resetFilters,
    searchQuery,
    setPage,
    setSearchQuery
  } = useReadersTableFilters();

  return (
    <div className='flex flex-wrap items-center gap-4'>
      <DataTableSearch
        searchKey='Okuyucu'
        searchQuery={searchQuery}
        setSearchQuery={setSearchQuery}
        setPage={setPage}
      />
      <DataTableResetFilter
        isFilterActive={isAnyFilterActive}
        onReset={resetFilters}
      />
    </div>
  );
}
