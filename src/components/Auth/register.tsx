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

export default function RegisterPage() {
  return (
    <div className="grid w-full h-screen grow items-center px-4 sm:justify-center">
      <Card className="w-full sm:w-96">
        <CardHeader>
          <CardTitle>Hesabınızı oluşturun.</CardTitle>
          <CardDescription>
            Hoşgeldiniz! Başlamak için kayıt olun.
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
            <Button>Kayıt ol</Button>
            <Button variant="link" size="sm" asChild>
              <Link href="/login">Zaten bir hesabın var mı? Giriş yap</Link>
            </Button>
          </div>
        </CardFooter>
      </Card>
    </div>
  );
}
