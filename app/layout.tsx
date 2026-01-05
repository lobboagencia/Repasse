// Fix: Added missing React import to resolve 'Cannot find namespace React' and children type resolution
import React from 'react';
import './globals.css';
import { AuthProvider } from '../context/AuthContext';
import { Plus_Jakarta_Sans } from 'next/font/google';

const jakarta = Plus_Jakarta_Sans({ 
  subsets: ['latin'],
  weight: ['300', '400', '500', '600', '700', '800'],
  variable: '--font-jakarta'
});

export const metadata = {
  title: 'RepasseJá - B2B Hub',
  description: 'Gestão de Liquidez Automotiva B2B',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="pt-br" className={jakarta.variable}>
      <body className="bg-[#F8FAFC] text-slate-900 antialiased font-sans">
        <AuthProvider>
          {children}
        </AuthProvider>
      </body>
    </html>
  );
}
