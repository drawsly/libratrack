'use client';

import Link from 'next/link';
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
import { useState } from 'react';
import { loginUser } from '@/features/auth/actions/auth';
import { useActionState } from 'react';
import { useRouter } from 'next/navigation';
import { toast } from 'sonner';
import { Loader2 } from 'lucide-react';
import { LoginState } from '@/features/auth/types/auth';

export default function LoginPage() {
  const router = useRouter();

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const [state, formAction, isPending] = useActionState<LoginState, FormData>(
    async (prevState: LoginState | undefined, formData: FormData) => {
      const result = await loginUser(prevState, formData);

      if (result.error) {
        toast.error('Giriş Başarısız', {
          description: result.error
        });
      } else if (result.success) {
        toast.success('Başarılı!', {
          description: 'Giriş başarılı. Yönlendiriliyorsunuz...'
        });
        setTimeout(() => {
          router.push(result.redirect || '/dashboard');
        }, 1000);
      }

      return result;
    },
    {
      error: '',
      success: false
    }
  );

  return (
    <div className='grid h-screen w-full grow items-center px-4 sm:justify-center'>
      <Card className='w-full shadow-[0_8px_30px_rgb(0,0,0,0.12)] dark:border-slate-800 dark:shadow-[0_4px_24px_-4px_rgba(0,0,0,0.5)] sm:w-96'>
        <CardHeader>
          <CardTitle>LibraTrack&apos;e giriş yap.</CardTitle>
          <CardDescription>
            Tekrar hoşgeldiniz! Lütfen devam etmek için giriş yapın.
          </CardDescription>
        </CardHeader>
        <form action={formAction}>
          <CardContent className='grid gap-y-4'>
            <div className='space-y-2'>
              <Label>Eposta adresi</Label>
              <Input
                type='email'
                name='email'
                required
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
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
              {state?.error && state.error.includes('şifre') && (
                <span className='text-sm text-red-500'>{state.error}</span>
              )}
            </div>
          </CardContent>
          <CardFooter>
            <div className='grid w-full gap-y-4'>
              <Button disabled={isPending}>
                {isPending ? (
                  <Loader2
                    className='-ms-1 me-2 animate-spin'
                    size={20}
                    strokeWidth={2}
                    aria-hidden='true'
                  />
                ) : (
                  'Giriş yap'
                )}
              </Button>
              <Button variant='link' size='sm' asChild>
                <Link href='/register'>Hesabın yok mu? Kayıt ol</Link>
              </Button>
            </div>
          </CardFooter>
        </form>
      </Card>
    </div>
  );
}
