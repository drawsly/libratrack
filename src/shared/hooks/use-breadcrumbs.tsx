'use client';

import { usePathname } from 'next/navigation';
import { useEffect, useMemo, useState } from 'react';
import { getBookNameById } from '@/features/dashboard/books/actions';
import { getReaderNameById } from '@/features/dashboard/readers/actions';

type BreadcrumbItem = {
  title: string;
  link: string;
};

// Segment adlarını Türkçeleştirmek için mapping
const segmentMappings: Record<string, string> = {
  dashboard: 'Kontrol Paneli',
  overview: 'Genel Bakış',
  books: 'Kitaplar',
  readers: 'Okuyucular',
  loans: 'Emanetler',
  users: 'Kullanıcılar',
  new: 'Yeni Oluştur'
};

export function useBreadcrumbs() {
  const pathname = usePathname();
  const [dynamicBookTitle, setDynamicBookTitle] = useState<string | null>(null);
  const [dynamicReaderName, setDynamicReaderName] = useState<string | null>(
    null
  );

  // URL segmentlerini al
  const segments = useMemo(
    () => pathname.split('/').filter(Boolean),
    [pathname]
  );

  // Kitap detay sayfasında mıyız?
  const isBookDetailPage = useMemo(() => {
    return (
      segments.length >= 2 &&
      segments[0] === 'dashboard' &&
      segments[1] === 'books' &&
      segments[2] &&
      segments[2] !== 'new'
    );
  }, [segments]);

  // Okuyucu detay sayfasında mıyız?
  const isReaderDetailPage = useMemo(() => {
    return (
      segments.length >= 2 &&
      segments[0] === 'dashboard' &&
      segments[1] === 'readers' &&
      segments[2] &&
      segments[2] !== 'new'
    );
  }, [segments]);

  const bookId = isBookDetailPage ? segments[2] : null;
  const readerId = isReaderDetailPage ? segments[2] : null;

  useEffect(() => {
    let isMounted = true;

    if (isBookDetailPage && bookId) {
      getBookNameById(bookId).then((result) => {
        if (isMounted && result.success) {
          setDynamicBookTitle(result.bookName);
        }
      });
    } else {
      setDynamicBookTitle(null);
    }

    if (isReaderDetailPage && readerId) {
      getReaderNameById(readerId).then((result) => {
        if (isMounted && result.success) {
          setDynamicReaderName(result.readerName);
        }
      });
    } else {
      setDynamicReaderName(null);
    }

    return () => {
      isMounted = false;
    };
  }, [isBookDetailPage, bookId, isReaderDetailPage, readerId]);

  // Breadcrumbs oluştur
  const breadcrumbs = useMemo(() => {
    return segments.map((segment, index) => {
      const path = `/${segments.slice(0, index + 1).join('/')}`;

      // Kitap detay sayfası için özel başlık
      if (
        index === 2 &&
        segments[1] === 'books' &&
        segment !== 'new' &&
        dynamicBookTitle
      ) {
        return {
          title: dynamicBookTitle,
          link: path
        };
      }

      // Okuyucu detay sayfası için özel başlık
      if (
        index === 2 &&
        segments[1] === 'readers' &&
        segment !== 'new' &&
        dynamicReaderName
      ) {
        return {
          title: dynamicReaderName,
          link: path
        };
      }

      // Segmentler için özel başlık kullan
      const title =
        segmentMappings[segment] ||
        segment.charAt(0).toUpperCase() + segment.slice(1);

      return {
        title,
        link: path
      };
    });
  }, [segments, dynamicBookTitle, dynamicReaderName]);

  return breadcrumbs;
}
