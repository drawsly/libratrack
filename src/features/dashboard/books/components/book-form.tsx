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
import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import { useRouter } from 'next/navigation';
import { useState } from 'react';
import { toast } from 'sonner';
import { Book, BookFormValues } from '../types';
import { BookSchema } from '../validations';
import { createBook, updateBook } from '../actions';

// Combobox bileşenleri
import { Check, ChevronsUpDown, Loader2 } from 'lucide-react';
import { cn } from '@/lib/utils';
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList
} from '@/shared/components/ui/command';
import {
  Popover,
  PopoverContent,
  PopoverTrigger
} from '@/shared/components/ui/popover';

export default function BookForm({
  initialData,
  bookTypes,
  pageTitle
}: {
  initialData: Book | null;
  bookTypes: { label: string; value: string }[];
  pageTitle: string;
}) {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [openCombobox, setOpenCombobox] = useState(false);
  const [inputValue, setInputValue] = useState('');

  const defaultValues: Partial<BookFormValues> = {
    book_name: initialData?.book_name || '',
    author_name: initialData?.author_name || '',
    publisher: initialData?.publisher || '',
    publish_year: initialData?.publish_year || undefined,
    page_count: initialData?.page_count || undefined,
    book_type: initialData?.book_type || '',
    book_case: initialData?.book_case || '',
    shelf: initialData?.shelf || undefined,
    row: initialData?.row || undefined
  };

  const form = useForm<BookFormValues>({
    resolver: zodResolver(BookSchema),
    defaultValues
  });

  async function onSubmit(values: BookFormValues) {
    try {
      setLoading(true);

      if (initialData) {
        // Mevcut kitabı güncelle
        const result = await updateBook(initialData.id, values);
        if (result.success) {
          toast.success('Kitap başarıyla güncellendi');
          router.push('/dashboard/books');
          router.refresh();
        } else {
          toast.error(result.error || 'Kitap güncellenirken bir hata oluştu');
        }
      } else {
        // Yeni kitap ekle
        const result = await createBook(values);
        if (result.success) {
          toast.success('Kitap başarıyla eklendi');
          router.push('/dashboard/books');
          router.refresh();
        } else {
          toast.error(result.error || 'Kitap eklenirken bir hata oluştu');
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
                name='book_name'
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Kitap Adı</FormLabel>
                    <FormControl>
                      <Input
                        placeholder='Kitap adı girin'
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
                name='author_name'
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Yazar Adı</FormLabel>
                    <FormControl>
                      <Input
                        placeholder='Yazar adı girin'
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
                name='publisher'
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Yayınevi</FormLabel>
                    <FormControl>
                      <Input
                        placeholder='Yayınevi girin'
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
                name='publish_year'
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Yayın Yılı</FormLabel>
                    <FormControl>
                      <Input
                        type='number'
                        placeholder='Yayın yılı girin'
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
                name='page_count'
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Sayfa Sayısı</FormLabel>
                    <FormControl>
                      <Input
                        type='number'
                        placeholder='Sayfa sayısı girin'
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

              {/* Kitap türü için yazılabilir combobox - düzeltilmiş */}
              <FormField
                control={form.control}
                name='book_type'
                render={({ field }) => (
                  <FormItem className='flex flex-col'>
                    <FormLabel>Kitap Türü</FormLabel>
                    <Popover open={openCombobox} onOpenChange={setOpenCombobox}>
                      <PopoverTrigger asChild>
                        <FormControl>
                          <Button
                            variant='outline'
                            role='combobox'
                            aria-expanded={openCombobox}
                            className='w-full justify-between'
                          >
                            {field.value
                              ? bookTypes.find(
                                  (type) => type.value === field.value
                                )?.label || field.value
                              : 'Kitap türü seçin veya yazın'}
                            <ChevronsUpDown className='ml-2 h-4 w-4 shrink-0 opacity-50' />
                          </Button>
                        </FormControl>
                      </PopoverTrigger>
                      <PopoverContent className='w-[300px] p-0'>
                        <Command>
                          <CommandInput
                            placeholder='Kitap türü arayın veya yeni tür girin'
                            value={inputValue}
                            onValueChange={setInputValue}
                          />
                          <CommandList>
                            <CommandEmpty>
                              <Button
                                variant='ghost'
                                className='w-full justify-start text-left'
                                onClick={() => {
                                  field.onChange(inputValue);
                                  setOpenCombobox(false);
                                }}
                              >
                                "{inputValue}" ekle
                              </Button>
                            </CommandEmpty>
                            <CommandGroup heading='Kitap Türleri'>
                              {bookTypes.map((type) => (
                                <CommandItem
                                  key={type.value}
                                  value={type.value}
                                  onSelect={() => {
                                    field.onChange(type.value);
                                    setOpenCombobox(false);
                                  }}
                                >
                                  <Check
                                    className={cn(
                                      'mr-2 h-4 w-4',
                                      field.value === type.value
                                        ? 'opacity-100'
                                        : 'opacity-0'
                                    )}
                                  />
                                  {type.label}
                                </CommandItem>
                              ))}
                            </CommandGroup>
                          </CommandList>
                        </Command>
                      </PopoverContent>
                    </Popover>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name='book_case'
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Kitaplık</FormLabel>
                    <FormControl>
                      <Input
                        placeholder='Kitaplık girin'
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
                name='shelf'
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Raf</FormLabel>
                    <FormControl>
                      <Input
                        type='number'
                        placeholder='Raf girin'
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
                name='row'
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Sıra</FormLabel>
                    <FormControl>
                      <Input
                        type='number'
                        placeholder='Sıra girin'
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
