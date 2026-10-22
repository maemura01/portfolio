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
    <html lang="pt-BR" className={`${sans.variable} ${mono.variable}`} suppressHydrationWarning>
      <body>
        <script dangerouslySetInnerHTML={{ __html: "(function(){try{var o=localStorage.getItem('movimento');var r=matchMedia('(prefers-reduced-motion: reduce)').matches;var on=o!=='off';var d=document.documentElement;d.dataset.motion=on?'on':'off';d.dataset.sistema=r?'reduzido':'normal';var m=function(){d.style.setProperty('--cw',d.clientWidth+'px')};m();if(window.ResizeObserver){new ResizeObserver(m).observe(d)}else{addEventListener('resize',m)}}catch(e){}})();" }} />
        {children}
      </body>
    </html>
  );
}
