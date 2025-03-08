import FormCardSkeleton from '@/shared/components/form-card-skeleton';
import PageContainer from '@/shared/components/layout/page-container';
import { Suspense } from 'react';
import BookViewPage from '@/features/dashboard/books/components/book-view-page';
import { Metadata, ResolvingMetadata } from 'next';
import { getBookById } from '@/features/dashboard/books/actions';

type Props = {
  params: Promise<{ bookId: string }>;
};

export async function generateMetadata(
  { params }: Props,
  parent: ResolvingMetadata
): Promise<Metadata> {
  const resolvedParams = await params;
  const { bookId } = resolvedParams;

  if (bookId === 'new') {
    return {
      title: 'Kitap Ekleme',
      description: 'Kütüphaneye yeni kitap ekleyin'
    };
  }

  try {
    const bookResult = await getBookById(bookId);

    if (bookResult.success && bookResult.book) {
      const bookName = bookResult.book.book_name || 'İsimsiz Kitap';
      return {
        title: `${bookName}`,
        description: `${bookName} kitabını düzenleyin`
      };
    }
  } catch (error) {
    console.error('Error getting book for metadata:', error);
  }

  return {
    title: 'Kitap İşlemleri',
    description: 'Kitap bilgilerini düzenleyin'
  };
}

export default async function Page({ params }: Props) {
  const resolvedParams = await params;
  const { bookId } = resolvedParams;

  return (
    <PageContainer scrollable>
      <div className='flex-1 space-y-4'>
        <Suspense fallback={<FormCardSkeleton />}>
          <BookViewPage bookId={bookId} />
        </Suspense>
      </div>
    </PageContainer>
  );
}
