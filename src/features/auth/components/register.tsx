'use client';

import { registerUser } from '@/features/auth/actions/auth';
import Link from 'next/link';
import { useActionState, useState } from 'react';
import { Button } from '@/shared/components/ui/button';
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle
} from '@/shared/components/ui/card';
import { Input } from '@/shared/components/ui/input';
import { Label } from '@/shared/components/ui/label';
import { LoaderCircle } from 'lucide-react';
import { RegisterState } from '@/features/auth/types/auth';
import { useRouter } from 'next/navigation';
import { toast } from 'sonner';

export default function RegisterPage() {
  const router = useRouter();

  const [state, formAction, isPending] = useActionState<
    RegisterState,
    FormData
  >(
    async (prevState: RegisterState | undefined, formData: FormData) => {
      const result = await registerUser(prevState, formData);

      if (result.error) {
        toast.error('Kayıt Başarısız', {
          description: result.error
        });
      } else if (result.success) {
        toast.success('Başarılı!', {
          description: 'Kayıt başarılı. Yönlendiriliyorsunuz...'
        });
        setTimeout(() => {
          router.push(result.redirect || '/dashboard');
        }, 1500);
      }

      return result;
    },
    {
      error: '',
      success: false
    }
  );

  const [name, setName] = useState('');
  const [surname, setSurname] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');

  return (
    <div className='grid h-screen w-full grow items-center px-4 sm:justify-center'>
      <Card className='w-full shadow-[0_8px_30px_rgb(0,0,0,0.12)] dark:border-slate-800 dark:shadow-[0_4px_24px_-4px_rgba(0,0,0,0.5)] sm:w-96'>
        <CardHeader>
          <CardTitle>Hesabınızı oluşturun.</CardTitle>
          <CardDescription>
            Hoşgeldiniz! Başlamak için kayıt olun.
          </CardDescription>
        </CardHeader>
        <form action={formAction}>
          <CardContent className='grid gap-y-4'>
            <div className='grid grid-cols-2 gap-4'>
              <div className='space-y-2'>
                <Label>İsim</Label>
                <Input
                  type='text'
                  name='name'
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                />
                {state?.error && state.error.includes('İsim') && (
                  <span className='text-sm text-red-500'>{state.error}</span>
                )}
              </div>
              <div className='space-y-2'>
                <Label>Soyisim</Label>
                <Input
                  type='text'
                  name='surname'
                  value={surname}
                  onChange={(e) => setSurname(e.target.value)}
                />
                {state?.error && state.error.includes('Soyisim') && (
                  <span className='text-sm text-red-500'>{state.error}</span>
                )}
              </div>
            </div>
            <div className='space-y-2'>
              <Label>Eposta adresi</Label>
              <Input
                type='email'
                name='email'
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
              {state?.error && state.error.includes('email') && (
                <span className='text-sm text-red-500'>{state.error}</span>
              )}
            </div>
            <div className='space-y-2'>
              <Label>Şifre</Label>
              <Input
                type='password'
                name='password'
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
              {state?.error && state.error.includes('Şifre') && (
                <span className='text-sm text-red-500'>{state.error}</span>
              )}
            </div>
            <div className='space-y-2'>
              <Label>Şifreni doğrula</Label>
              <Input
                type='password'
                name='confirmPassword'
                required
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
              />
              {state?.error && state.error.includes('Şifreler') && (
                <span className='text-sm text-red-500'>{state.error}</span>
              )}
            </div>
          </CardContent>
          <CardFooter>
            <div className='grid w-full gap-y-4'>
              <Button disabled={isPending}>
                {isPending ? (
                  <LoaderCircle
                    className='-ms-1 me-2 animate-spin'
                    size={20}
                    strokeWidth={2}
                    aria-hidden='true'
                  />
                ) : (
                  'Kayıt ol'
                )}
              </Button>
              <Button variant='link' size='sm' asChild>
                <Link href='/login'>Zaten bir hesabın var mı? Giriş yap</Link>
              </Button>
            </div>
          </CardFooter>
        </form>
      </Card>
    </div>
  );
}
