import { Inter } from 'next/font/google';
import './globals.css';

const inter = Inter({
  subsets: ['latin'],
  weight: ['400', '500', '700'],
  variable: '--font-inter',
  display: 'swap',
});

export const metadata = {
  title: 'Ricardo Maemura — Desenvolvedor Full Stack',
  description:
    'Desenvolvedor full stack com base em dados: SQL, Next.js, Supabase e automação. Portfólio com demos ao vivo.',
};

export default function RootLayout({ children }) {
  return (
    <html lang="pt-BR" className={inter.variable}>
      <body>{children}</body>
    </html>
  );
}
