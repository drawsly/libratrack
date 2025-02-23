import PageContainer from '@/shared/components/layout/page-container';
import { buttonVariants } from '@/shared/components/ui/button';
import { Heading } from '@/shared/components/ui/heading';
import { Separator } from '@/shared/components/ui/separator';
import { cn } from '@/shared/utils';
import { Plus } from 'lucide-react';
import Link from 'next/link';
import { Suspense } from 'react';

export default function Books() {
  return (
    <PageContainer scrollable={false}>
      <div className='flex flex-1 flex-col space-y-4'>
        <div className='flex items-start justify-between'>
          <Heading
            title='Kitaplar'
            description='Kitapları görüntüleyin, düzenleyin ve ekleyin.'
          />
          <Link
            href='/dashboard/product/new'
            className={cn(buttonVariants(), 'text-xs md:text-sm')}
          >
            <Plus className='mr-2 h-4 w-4' /> Kitap Ekle
          </Link>
        </div>
        <Separator />
        {/* <ProductTableAction /> */}
        <Suspense
        // key={key}
        // fallback={<DataTableSkeleton columnCount={5} rowCount={10} />}
        >
          {/* <ProductListingPage /> */}
        </Suspense>
      </div>
    </PageContainer>
  );
}
