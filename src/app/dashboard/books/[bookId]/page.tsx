import FormCardSkeleton from '@/shared/components/form-card-skeleton';
import PageContainer from '@/shared/components/layout/page-container';
import { Suspense } from 'react';
import BookViewPage from '@/features/dashboard/books/components/book-view-page';
import { Metadata, ResolvingMetadata } from 'next';
import { getBookById } from '@/features/dashboard/books/actions';

export async function generateMetadata(
  { params }: { params: { bookId: string } | Promise<{ bookId: string }> },
  parent: ResolvingMetadata
): Promise<Metadata> {
  const resolvedParams = 'then' in params ? await params : params;
  const bookId = resolvedParams.bookId;

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

type PageProps = { params: { bookId: string } | Promise<{ bookId: string }> };

export default async function Page(props: PageProps) {
  const params = 'then' in props.params ? await props.params : props.params;
  const { bookId } = params;

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
