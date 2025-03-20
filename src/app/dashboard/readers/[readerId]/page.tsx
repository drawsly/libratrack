import FormCardSkeleton from '@/shared/components/form-card-skeleton';
import PageContainer from '@/shared/components/layout/page-container';
import { Suspense } from 'react';
import ReaderViewPage from '@/features/dashboard/readers/components/reader-view-page';
import { Metadata, ResolvingMetadata } from 'next';
import { getReaderById } from '@/features/dashboard/readers/actions';

type Props = {
  params: Promise<{ readerId: string }>;
};

export async function generateMetadata(
  { params }: Props,
  parent: ResolvingMetadata
): Promise<Metadata> {
  const resolvedParams = await params;
  const { readerId } = resolvedParams;

  if (readerId === 'new') {
    return {
      title: 'Okuyucu Ekleme',
      description: 'Kütüphaneye yeni okur ekleyin'
    };
  }

  try {
    const readerResult = await getReaderById(readerId);

    if (readerResult.success && readerResult.reader) {
      const readerName = readerResult.reader.name || 'İsimsiz Okur';
      return {
        title: `${readerName}`,
        description: `${readerName} okuyucusunu düzenleyin`
      };
    }
  } catch (error) {
    console.error('Error getting reader for metadata:', error);
  }

  return {
    title: 'Okuyucu İşlemleri',
    description: 'Okuyucu bilgilerini düzenleyin'
  };
}

export default async function Page({ params }: Props) {
  const resolvedParams = await params;
  const { readerId } = resolvedParams;

  return (
    <PageContainer scrollable>
      <div className='flex-1 space-y-4'>
        <Suspense fallback={<FormCardSkeleton />}>
          <ReaderViewPage readerId={readerId} />
        </Suspense>
      </div>
    </PageContainer>
  );
}
