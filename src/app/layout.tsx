import type { Metadata } from 'next';
import { Geist, Geist_Mono } from 'next/font/google';
import { ToastProvider } from '@/components/ui/Toast';
import LayoutClient from './LayoutClient';
import './globals.css';

const geist = Geist({
  variable: '--font-geist-sans',
  subsets: ['latin'],
});

const geistMono = Geist_Mono({
  variable: '--font-geist-mono',
  subsets: ['latin'],
});

export const metadata: Metadata = {
  title: 'Plasticprecious - eCommerce',
  description: 'Your premium eCommerce platform',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        {/* Skip the homepage intro on repeat loads in the same visit, before anything paints */}
        <script
          dangerouslySetInnerHTML={{
            __html: "try{if(sessionStorage.getItem('pp_intro_seen')==='1')document.documentElement.classList.add('intro-seen')}catch(e){}",
          }}
        />
      </head>
      <body className={`${geist.variable} ${geistMono.variable}`}>
        <ToastProvider>
          <LayoutClient>
            {children}
          </LayoutClient>
        </ToastProvider>
      </body>
    </html>
  );
}
