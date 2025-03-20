'use client';
import { Reader } from '../../types';
import { ColumnDef } from '@tanstack/react-table';
import { CellAction } from './cell-action';
import { Mars, Venus, HelpCircle } from 'lucide-react';

export const columns: ColumnDef<Reader>[] = [
  {
    accessorKey: 'name',
    header: 'Adı',
    cell: ({ row }) => (
      <div className='max-w-[200px] truncate'>
        {row.getValue('name') || '-'}
      </div>
    )
  },
  {
    accessorKey: 'surname',
    header: 'Soyadı',
    cell: ({ row }) => <div>{row.getValue('surname') || '-'}</div>
  },
  {
    accessorKey: 'gender',
    header: 'Cinsiyet',
    cell: ({ row }) => {
      const gender = row.getValue('gender');

      return (
        <div className='flex items-center gap-2'>
          {gender === 'E' ? (
            <>
              <Mars className='h-5 w-5 text-blue-500' /> <span>Erkek</span>
            </>
          ) : gender === 'K' ? (
            <>
              <Venus className='h-5 w-5 text-pink-500' /> <span>Kadın</span>
            </>
          ) : (
            <>
              <HelpCircle className='h-5 w-5 text-gray-500' />{' '}
              <span>Bilinmiyor</span>
            </>
          )}
        </div>
      );
    }
  },
  {
    accessorKey: 'school_no',
    header: 'Okul No',
    cell: ({ row }) => <div>{row.getValue('school_no') || '-'}</div>
  },
  {
    accessorKey: 'phone',
    header: 'Telefon',
    cell: ({ row }) => <div>{row.getValue('phone') || '-'}</div>
  },
  {
    accessorKey: 'adress',
    header: 'Adres',
    cell: ({ row }) => <div>{row.getValue('adress') || '-'}</div>
  },
  {
    id: 'actions',
    cell: ({ row }) => <CellAction data={row.original} />
  }
];
