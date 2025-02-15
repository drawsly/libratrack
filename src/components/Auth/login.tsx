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

export default function LoginPage() {
  return (
    <div className="grid w-full h-screen grow items-center px-4 sm:justify-center">
      <Card className="w-full sm:w-96">
        <CardHeader>
          <CardTitle>LibraTrack'e giriş yap.</CardTitle>
          <CardDescription>
            Tekrar hoşgeldiniz! Lütfen devam etmek için giriş yapın.
          </CardDescription>
        </CardHeader>
        <CardContent className="grid gap-y-4">
          <div className="space-y-2">
            <Label>Eposta adresi</Label>
            <Input type="email" required />
          </div>

          <div className="space-y-2">
            <Label>Şifre</Label>
            <Input type="password" required />
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
      </Card>
    </div>
  );
}