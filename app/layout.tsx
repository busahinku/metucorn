import type { Metadata } from "next";
import { Inter, Sora } from 'next/font/google'
import "./globals.css";
import AppLayout from '@/components/AppLayout'

const inter = Inter({ 
  subsets: ['latin'],
  display: 'swap',
  variable: '--font-inter',
})

const sora = Sora({
  subsets: ['latin'],
  display: 'swap',
  variable: '--font-sora',
})

export const metadata: Metadata = {
  title: "metucorn - Your Ticket Party Platform",
  description: "Buy movie tickets and create watch parties with friends",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={`${inter.variable} ${sora.variable}`}>
      <body className="antialiased bg-[#0C0C0C] text-white font-sans">
        <AppLayout>{children}</AppLayout>
      </body>
    </html>
  );
}


