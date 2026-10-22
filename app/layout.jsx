import { Instrument_Sans, JetBrains_Mono } from 'next/font/google';
import './globals.css';

// Substitutas livres das fontes da referência (Parabole e Decima Mono).
const sans = Instrument_Sans({
  subsets: ['latin'],
  weight: ['400', '500', '600'],
  variable: '--font-sans-src',
  display: 'swap',
});

const mono = JetBrains_Mono({
  subsets: ['latin'],
  weight: ['400', '500'],
  variable: '--font-mono-src',
  display: 'swap',
});

export const viewport = { themeColor: "#121211", colorScheme: "dark" };

export const metadata = {
  icons: { icon: "/favicon.svg" },
  title: 'Ricardo Maemura — Analista de Dados Pleno · Full Stack',
  description:
    'Analista de Dados Pleno e Full Stack: SQL, Next.js, Supabase e automação. Portfólio com demos interativas.',
};

export default function RootLayout({ children }) {
  return (
    <html lang="pt-BR" className={`${sans.variable} ${mono.variable}`}>
      <body>{children}</body>
    </html>
  );
}
