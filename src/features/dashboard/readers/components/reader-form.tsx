'use client';

import { Button } from '@/shared/components/ui/button';
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle
} from '@/shared/components/ui/card';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage
} from '@/shared/components/ui/form';
import { Input } from '@/shared/components/ui/input';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue
} from '@/shared/components/ui/select';
import { Textarea } from '@/shared/components/ui/textarea';
import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import { useRouter } from 'next/navigation';
import { useState } from 'react';
import { toast } from 'sonner';
import { Reader, ReaderFormValues } from '../types';
import { ReaderSchema } from '../validations';
import { createReader, updateReader } from '../actions';
import { Loader2, Mars, Venus } from 'lucide-react';
import { IMaskInput } from 'react-imask';

export default function ReaderForm({
  initialData,
  pageTitle
}: {
  initialData: Reader | null;
  pageTitle: string;
}) {
  const router = useRouter();
  const [loading, setLoading] = useState(false);

  const defaultValues: Partial<ReaderFormValues> = {
    name: initialData?.name || '',
    surname: initialData?.surname || '',
    gender: initialData?.gender || '',
    school_no: initialData?.school_no || undefined,
    phone: initialData?.phone || '',
    adress: initialData?.adress || ''
  };

  const form = useForm<ReaderFormValues>({
    resolver: zodResolver(ReaderSchema),
    defaultValues
  });

  async function onSubmit(values: ReaderFormValues) {
    try {
      setLoading(true);

      if (initialData) {
        const result = await updateReader(initialData.id, values);
        if (result.success) {
          toast.success('Okuyucu başarıyla güncellendi');
          router.push('/dashboard/readers');
          router.refresh();
        } else {
          toast.error(result.error || 'Okuyucu güncellenirken bir hata oluştu');
        }
      } else {
        const result = await createReader(values);
        if (result.success) {
          toast.success('Okuyucu başarıyla eklendi');
          router.push('/dashboard/readers');
          router.refresh();
        } else {
          toast.error(result.error || 'Okuyucu eklenirken bir hata oluştu');
        }
      }
    } catch (error) {
      toast.error('Bir hata oluştu');
    } finally {
      setLoading(false);
    }
  }

  return (
    <Card className='mx-auto w-full'>
      <CardHeader>
        <CardTitle className='text-left text-2xl font-bold'>
          {pageTitle}
        </CardTitle>
      </CardHeader>
      <CardContent className='w-full'>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className='space-y-8'>
            <div className='grid grid-cols-1 gap-6 md:grid-cols-2'>
              <FormField
                control={form.control}
                name='name'
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Adı</FormLabel>
                    <FormControl>
                      <Input
                        placeholder='Adı girin'
                        {...field}
                        value={field.value || ''}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name='surname'
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Soyadı</FormLabel>
                    <FormControl>
                      <Input
                        placeholder='Soyadı girin'
                        {...field}
                        value={field.value || ''}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name='gender'
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Cinsiyet</FormLabel>
                    <Select
                      onValueChange={field.onChange}
                      defaultValue={field.value || ''}
                    >
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder='Cinsiyet seçin'>
                            {field.value === 'E' && (
                              <div className='flex items-center gap-2'>
                                <Mars className='h-4 w-4 text-blue-500' />
                                <span>Erkek</span>
                              </div>
                            )}
                            {field.value === 'K' && (
                              <div className='flex items-center gap-2'>
                                <Venus className='h-4 w-4 text-pink-500' />
                                <span>Kadın</span>
                              </div>
                            )}
                          </SelectValue>
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        <SelectItem value='E'>
                          <div className='flex items-center gap-2'>
                            <Mars className='h-4 w-4 text-blue-500' />
                            <span>Erkek</span>
                          </div>
                        </SelectItem>
                        <SelectItem value='K'>
                          <div className='flex items-center gap-2'>
                            <Venus className='h-4 w-4 text-pink-500' />
                            <span>Kadın</span>
                          </div>
                        </SelectItem>
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name='school_no'
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Okul Numarası</FormLabel>
                    <FormControl>
                      <Input
                        type='number'
                        placeholder='Okul numarası girin'
                        {...field}
                        value={field.value ?? ''}
                        onChange={(e) =>
                          field.onChange(
                            e.target.value ? Number(e.target.value) : undefined
                          )
                        }
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name='phone'
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Telefon</FormLabel>
                    <FormControl>
                      <div className='relative w-full'>
                        <IMaskInput
                          className='flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50'
                          mask='(500) 000 00 00'
                          unmask={false}
                          value={field.value || ''}
                          onAccept={(value) => field.onChange(value)}
                          placeholder='(5xx) xxx xx xx'
                          definitions={{
                            '0': /[0-9]/,
                            '5': /[0-9]/
                          }}
                        />
                      </div>
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name='adress'
                render={({ field }) => (
                  <FormItem className='md:col-span-2'>
                    <FormLabel>Adres</FormLabel>
                    <FormControl>
                      <Textarea
                        placeholder='Adres girin'
                        {...field}
                        value={field.value || ''}
                        rows={3}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
            <Button type='submit' disabled={loading}>
              {loading ? <Loader2 className='animate-spin' /> : 'Kaydet'}
            </Button>
          </form>
        </Form>
      </CardContent>
    </Card>
  );
}
