import type { Metadata } from 'next';
import { Noto_Sans_KR } from 'next/font/google';
import './globals.css';
import { Toaster } from '@/components/ui/toaster';
import { cn } from '@/lib/utils';
import { SpeedInsights } from '@vercel/speed-insights/next';

const notoSansKr = Noto_Sans_KR({
  subsets: ['latin'],
  weight: ['400', '700'],
  variable: '--font-sans',
});

export const metadata: Metadata = {
  title: '친환경 소비를 고려하는 똑똑한 소비자',
  description: 'A game about making sustainable choices.',
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head />
      <body className={cn('font-sans antialiased', notoSansKr.variable)}>
        {children}
        <Toaster />
        <SpeedInsights />
      </body>
    </html>
  );
}
