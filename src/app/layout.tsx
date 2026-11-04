import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import './globals.css';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import { Toaster } from 'sonner';

const inter = Inter({ subsets: ['latin'] });

const storeName = process.env.NEXT_PUBLIC_STORE_NAME || 'Drivant Store';

export const metadata: Metadata = {
  title: `${storeName} — Premium Digital Products & Services`,
  description: 'Tu tienda digital de confianza para cuentas, herramientas de inteligencia artificial y licencias.',
  icons: {
    icon: '/logo-perfil.png',
    shortcut: '/logo-perfil.png',
    apple: '/logo-perfil.png',
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="es">
      <head>
        <link rel="icon" href="/logo-perfil.png" sizes="any" />
      </head>
      <body className={inter.className}>
        <Navbar />
        <main className="min-h-screen">{children}</main>
        <Footer />
        <Toaster position="top-right" richColors />
      </body>
    </html>
  );
}
