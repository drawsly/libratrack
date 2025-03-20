import { searchParamsCache } from '@/lib/searchparams';
import { DataTable } from '@/shared/components/ui/table/data-table';
import { columns } from './readers-tables/columns';
import { getReaders } from '../actions';

type ReadersListingPageProps = {};

export default async function ReadersListingPage({}: ReadersListingPageProps) {
  const page = Number(searchParamsCache.get('page')) || 1;
  const searchQuery = searchParamsCache.get('q');
  const pageSize = Number(searchParamsCache.get('limit')) || 10;

  const filters = {
    page,
    pageSize,
    ...(searchQuery && { searchQuery })
  };

  const { readers, totalCount, pageCount } = await getReaders(filters);

  return <DataTable columns={columns} data={readers} totalItems={totalCount} />;
}
