'use client';
import { useEffect, useState } from 'react';
import { Button } from '@/shared/components/ui/button';
import { Modal } from '@/shared/components/ui/modal';

interface AlertModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
  loading: boolean;
}

export const AlertModal: React.FC<AlertModalProps> = ({
  isOpen,
  onClose,
  onConfirm,
  loading
}) => {
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    setIsMounted(true);
  }, []);

  if (!isMounted) {
    return null;
  }

  return (
    <Modal
      title='Emin misiniz?'
      description='Bu işlem geri alınamaz!'
      isOpen={isOpen}
      onClose={onClose}
    >
      <div className='flex w-full items-center justify-end space-x-2 pt-6'>
        <Button disabled={loading} variant='outline' onClick={onClose}>
          Vazgeç
        </Button>
        <Button disabled={loading} variant='destructive' onClick={onConfirm}>
          Devam et
        </Button>
      </div>
    </Modal>
  );
};
