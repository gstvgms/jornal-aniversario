import type { Metadata } from 'next';
import './globals.css';
import { Toaster } from 'react-hot-toast';

export const metadata: Metadata = {
  title: 'Jornal Histórico — Descubra o dia em que você nasceu',
  description:
    'Receba um jornal personalizado estilo vintage com notícias geradas por IA sobre o dia do seu nascimento.',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="pt-BR">
      <body className="bg-[#f5f0e8] font-serif antialiased">
        {children}
        <Toaster position="top-center" />
      </body>
    </html>
  );
}
