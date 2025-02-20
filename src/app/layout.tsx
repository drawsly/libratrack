import { Analytics } from '@vercel/analytics/react';
import { SpeedInsights } from '@vercel/speed-insights/next';

import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import { siteMetadata } from '@/lib/metadata';
import { Toaster } from '@/components/ui/sonner';
import NextTopLoader from 'nextjs-toploader';

import '@/styles/globals.css';
import { ThemeProvider } from '@/components/layout/Theme/theme-provider';

const inter = Inter({ subsets: ['latin'] });

export const metadata: Metadata = siteMetadata;

export default async function RootLayout({
  children
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang='tr'
      className={`${inter.className} antialiased`}
      suppressHydrationWarning
    >
      <body className={`overflow-hidden`}>
        <NextTopLoader showSpinner={false} />
        <ThemeProvider attribute='class' defaultTheme='system' enableSystem>
          {children}
          <Toaster />
        </ThemeProvider>
        <Analytics />
        <SpeedInsights />
      </body>
    </html>
  );
}
