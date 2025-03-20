'use client';
import { AlertModal } from '@/shared/components/modal/alert-modal';
import { Button } from '@/shared/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuTrigger
} from '@/shared/components/ui/dropdown-menu';
import { Reader } from '../../types';
import { Edit, MoreHorizontal, Trash } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { useState } from 'react';
import { deleteReader } from '../../actions';
import { toast } from 'sonner';

interface CellActionProps {
  data: Reader;
}

export const CellAction: React.FC<CellActionProps> = ({ data }) => {
  const [loading, setLoading] = useState(false);
  const [open, setOpen] = useState(false);
  const router = useRouter();

  const onConfirm = async () => {
    try {
      setLoading(true);
      const result = await deleteReader(data.id);

      if (result.success) {
        toast.success('Okuyucu başarıyla silindi');
        router.refresh();
      } else {
        toast.error(result.error || 'Okuyucu silinemedi');
      }
    } catch (error) {
      toast.error('Bir hata oluştu');
    } finally {
      setLoading(false);
      setOpen(false);
    }
  };

  return (
    <>
      <AlertModal
        isOpen={open}
        onClose={() => setOpen(false)}
        onConfirm={onConfirm}
        loading={loading}
      />
      <DropdownMenu modal={false}>
        <DropdownMenuTrigger asChild>
          <Button variant='ghost' className='h-8 w-8 p-0'>
            <span className='sr-only'>Menüyü aç</span>
            <MoreHorizontal className='h-4 w-4' />
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align='end'>
          <DropdownMenuLabel>İşlemler</DropdownMenuLabel>

          <DropdownMenuItem
            onClick={() => router.push(`/dashboard/readers/${data.id}`)}
          >
            <Edit className='mr-2 h-4 w-4' /> Düzenle
          </DropdownMenuItem>
          <DropdownMenuItem onClick={() => setOpen(true)}>
            <Trash className='mr-2 h-4 w-4' /> Sil
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    </>
  );
};
