'use client';

import Link from 'next/link';
import { useState } from 'react';
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
  const [name, setName] = useState('');
  const [surname, setSurname] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');

  return (
    <div className="grid w-full h-screen items-center px-4 sm:justify-center">
      <Card className="w-full sm:w-96">
        <CardHeader>
          <CardTitle>Hesabınızı oluşturun.</CardTitle>
          <CardDescription>
            Hoşgeldiniz! Başlamak için kayıt olun.
          </CardDescription>
        </CardHeader>
        <form action={(formData) => console.log(formData)}>
          <CardContent className="grid gap-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label>İsim</Label>
                <Input
                  type="text"
                  name="name"
                  required
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                />
              </div>
              <div className="space-y-2">
                <Label>Soyisim</Label>
                <Input
                  type="text"
                  name="surname"
                  required
                  value={surname}
                  onChange={(e) => setSurname(e.target.value)}
                />
              </div>
            </div>
            <div className="space-y-2">
              <Label>Eposta adresi</Label>
              <Input
                type="email"
                name="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
            </div>
            <div className="space-y-2">
              <Label>Şifre</Label>
              <Input
                type="password"
                name="password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
            </div>
            <div className="space-y-2">
              <Label>Şifreni doğrula</Label>
              <Input
                type="password"
                name="confirmPassword"
                required
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
              />
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
        </form>
      </Card>
    </div>
  );
}
