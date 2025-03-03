import PageContainer from '@/shared/components/layout/page-container';
import { buttonVariants } from '@/shared/components/ui/button';
import { Heading } from '@/shared/components/ui/heading';
import { Separator } from '@/shared/components/ui/separator';
import { cn } from '@/lib/utils';
import { Plus } from 'lucide-react';
import Link from 'next/link';
import { Suspense } from 'react';
import { DataTableSkeleton } from '@/shared/components/ui/table/data-table-skeleton';
import { searchParamsCache, serialize } from '@/lib/searchparams';
import { SearchParams } from 'nuqs/server';
import BooksListingPage from './books-listing';
import TableFilters from './books-tables/table-filters';
import { DataTableFilterSkeleton } from '@/shared/components/ui/table/data-table-filter-skeleton';

type pageProps = {
  searchParams: Promise<SearchParams>;
};

export default async function BooksPage(props: pageProps) {
  const searchParams = await props.searchParams;
  searchParamsCache.parse(searchParams);

  const key = serialize({ ...searchParams });

  return (
    <PageContainer scrollable={false}>
      <div className='flex flex-1 flex-col space-y-4'>
        <div className='flex items-start justify-between'>
          <Heading
            title='Kitaplar'
            description='Kitapları görüntüleyin, düzenleyin ve ekleyin.'
          />
          <Link
            href='/dashboard/books/new'
            className={cn(buttonVariants(), 'text-xs md:text-sm')}
            role='button'
          >
            <Plus className='mr-2 h-4 w-4' /> Kitap Ekle
          </Link>
        </div>
        <Separator />
        <Suspense fallback={<DataTableFilterSkeleton />}>
          <TableFilters />
        </Suspense>
        <Suspense
          key={key}
          fallback={<DataTableSkeleton columnCount={5} rowCount={10} />}
        >
          <BooksListingPage />
        </Suspense>
      </div>
    </PageContainer>
  );
}
