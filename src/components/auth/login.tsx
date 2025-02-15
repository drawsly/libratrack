'use client';

import Link from 'next/link';
import { Button } from '@/components/ui/button';
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useState } from 'react';

export default function LoginPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  return (
    <div className="grid w-full h-screen grow items-center px-4 sm:justify-center">
      <Card className="w-full sm:w-96">
        <CardHeader>
          <CardTitle>LibraTrack&apos;e giriş yap.</CardTitle>
          <CardDescription>
            Tekrar hoşgeldiniz! Lütfen devam etmek için giriş yapın.
          </CardDescription>
        </CardHeader>
        <form action={(formData) => console.log(formData)}>
          <CardContent className="grid gap-y-4">
            <div className="space-y-2">
              <Label>Eposta adresi</Label>
              <Input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
            </div>
            <div className="space-y-2">
              <Label>Şifre</Label>
              <Input
                type="password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
            </div>
          </CardContent>
          <CardFooter>
            <div className="grid w-full gap-y-4">
              <Button>Giriş yap</Button>
              <Button variant="link" size="sm" asChild>
                <Link href="/register">Hesabın yok mu? Kayıt ol</Link>
              </Button>
            </div>
          </CardFooter>
        </form>
      </Card>
    </div>
  );
}
