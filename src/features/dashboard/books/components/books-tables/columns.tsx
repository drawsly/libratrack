'use client';
import { Book } from '../../types';
import { ColumnDef } from '@tanstack/react-table';
import { CellAction } from './cell-action';

export const columns: ColumnDef<Book>[] = [
  {
    accessorKey: 'book_name',
    header: 'Kitap Adı',
    cell: ({ row }) => (
      <div className='max-w-[200px] truncate'>
        {row.getValue('book_name') || '-'}
      </div>
    )
  },
  {
    accessorKey: 'author_name',
    header: 'Yazar',
    cell: ({ row }) => <div>{row.getValue('author_name') || '-'}</div>
  },
  {
    accessorKey: 'publisher',
    header: 'Yayınevi',
    cell: ({ row }) => <div>{row.getValue('publisher') || '-'}</div>
  },
  {
    accessorKey: 'publish_year',
    header: 'Yayın Yılı',
    cell: ({ row }) => <div>{row.getValue('publish_year') || '-'}</div>
  },
  {
    accessorKey: 'book_type',
    header: 'Tür',
    cell: ({ row }) => <div>{row.getValue('book_type') || '-'}</div>
  },
  {
    accessorKey: 'page_count',
    header: 'Sayfa sayısı',
    cell: ({ row }) => <div>{row.getValue('page_count') || '-'}</div>
  },
  {
    accessorKey: 'book_case',
    header: 'Kitap dolabı',
    cell: ({ row }) => <div>{row.getValue('book_case') || '-'}</div>
  },
  {
    accessorKey: 'shelf',
    header: 'Raf',
    cell: ({ row }) => <div>{row.getValue('shelf') || '-'}</div>
  },
  {
    accessorKey: 'row',
    header: 'Sıra',
    cell: ({ row }) => <div>{row.getValue('row') || '-'}</div>
  },
  {
    accessorKey: 'entrusted',
    header: 'Emanet durumu',
    cell: ({ row }) => (
      <div>{row.getValue('entrusted') ? 'Emanet' : 'Emanet Değil'}</div>
    )
  },
  {
    id: 'actions',
    cell: ({ row }) => <CellAction data={row.original} />
  }
];
