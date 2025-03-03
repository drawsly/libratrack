import { Skeleton } from '@/shared/components/ui/skeleton';

interface DataTableFilterSkeletonProps {
  filterCount?: number;
  showSearch?: boolean;
  showResetButton?: boolean;
}

export function DataTableFilterSkeleton({
  filterCount = 2,
  showSearch = true,
  showResetButton = true
}: DataTableFilterSkeletonProps) {
  return (
    <div className='flex flex-wrap items-center gap-4'>
      {/* Arama kutusu iskeleti */}
      {showSearch && <Skeleton className='h-10 w-[250px]' />}

      {/* Filtre iskeletleri */}
      {Array.from({ length: filterCount }).map((_, i) => (
        <div key={i} className='flex items-center space-x-2'>
          <Skeleton className='h-10 w-[150px]' />
        </div>
      ))}

      {/* Reset filtre butonu iskeleti */}
      {showResetButton && <Skeleton className='h-10 w-[100px]' />}
    </div>
  );
}
