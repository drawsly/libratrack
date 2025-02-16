import { Analytics } from "@vercel/analytics/react"

import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import { siteMetadata } from '@/lib/metadata';
import { ThemeProvider } from '@/components/providers';
import { Toaster } from '@/components/ui/sonner';

import '../styles/globals.css';

const inter = Inter({ subsets: ['latin'] });

export const metadata: Metadata = siteMetadata;

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={inter.className}>
        <ThemeProvider
          attribute="class"
          defaultTheme="system"
          enableSystem
          disableTransitionOnChange
        >
          {children}
          <Toaster />
        </ThemeProvider>
      </body>
    </html>
  );
}
