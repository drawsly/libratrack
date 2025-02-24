import { Analytics } from '@vercel/analytics/react';
import { SpeedInsights } from '@vercel/speed-insights/next';

import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import { siteMetadata } from '@/shared/utils';
import { Toaster } from '@/shared/components/ui/sonner';
import NextTopLoader from 'nextjs-toploader';
import { NuqsAdapter } from 'nuqs/adapters/next/app';
import { ThemeProvider } from '@/shared/components/layout/Theme/theme-provider';

import '@/styles/globals.css';

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
          <NuqsAdapter>{children}</NuqsAdapter>
          <Toaster />
        </ThemeProvider>
        <Analytics />
        <SpeedInsights />
      </body>
    </html>
  );
}
