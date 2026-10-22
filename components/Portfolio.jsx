'use client';

import { useEffect, useRef } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import AriaMock from './AriaMock';
import ParceirosMock from './ParceirosMock';
import SqlMock from './SqlMock';
import CrmMock from './CrmMock';
import CredMock from './CredMock';

gsap.registerPlugin(ScrollTrigger);

const NOME = 'Ricardo Maemura';

const PROJETOS = [
  {
    id: 'aria',
    titulo: 'Aria Console',
    stack: 'React · Supabase · Google Calendar',
    href: 'https://github.com/maemura01/aria-console',
    arte: <AriaMock />,
  },
  { id: 'parceiros', titulo: 'Painel de parceiros e gerentes', stack: 'SQL · Vercel · Cron · WhatsApp', arte: <ParceirosMock /> },
  { id: 'sql', titulo: 'Funil de leads + SQL', stack: 'PostgreSQL · CTEs · Window functions', arte: <SqlMock /> },
  {
    id: 'scraper',
    titulo: 'Scraper de CRM',
    stack: 'Python · Playwright · FastAPI',
    href: 'https://github.com/maemura01/crm-proposal-scraper',
    arte: <CrmMock />,
    wide: true,
  },
  {
    id: 'credenciais',
    titulo: 'Credenciais cifradas no navegador',
    stack: 'ECIES · WebCrypto · Next.js · Supabase',
    href: 'https://github.com/maemura01/secure-credential-intake',
    arte: <CredMock />,
    wide: true,
  },
];

function IconGithub() {
  return (
    <svg viewBox="0 0 24 24" aria-hidden="true">
      <path fill="currentColor" d="M12 .5a11.5 11.5 0 0 0-3.64 22.41c.58.1.79-.25.79-.56v-2c-3.2.7-3.88-1.37-3.88-1.37-.52-1.33-1.28-1.69-1.28-1.69-1.04-.71.08-.7.08-.7 1.16.08 1.77 1.19 1.77 1.19 1.03 1.76 2.7 1.25 3.36.96.1-.75.4-1.25.73-1.54-2.55-.29-5.24-1.28-5.24-5.69 0-1.26.45-2.28 1.19-3.08-.12-.29-.52-1.46.11-3.05 0 0 .97-.31 3.17 1.18a10.9 10.9 0 0 1 5.77 0c2.2-1.49 3.17-1.18 3.17-1.18.63 1.59.23 2.76.11 3.05.74.8 1.19 1.82 1.19 3.08 0 4.42-2.69 5.39-5.25 5.68.41.36.78 1.06.78 2.14v3.17c0 .31.21.67.8.56A11.5 11.5 0 0 0 12 .5Z" />
    </svg>
  );
}

function IconLinkedin() {
  return (
    <svg viewBox="0 0 24 24" aria-hidden="true">
      <path fill="currentColor" d="M4.98 3.5a2.5 2.5 0 1 1-.02 5 2.5 2.5 0 0 1 .02-5ZM3 9.75h4v11.5H3V9.75Zm6.5 0h3.8v1.6h.06c.53-1 1.84-2.05 3.8-2.05 4.07 0 4.84 2.68 4.84 6.16v5.8h-4v-5.14c0-1.23-.02-2.8-1.7-2.8-1.7 0-1.96 1.33-1.96 2.7v5.24h-4V9.75Z" />
    </svg>
  );
}

function IconMail() {
  return (
    <svg viewBox="0 0 24 24" aria-hidden="true">
      <path fill="none" stroke="currentColor" strokeWidth="2" d="M3 5h18v14H3zM3 6l9 7 9-7" />
    </svg>
  );
}

export default function Portfolio() {
  const raiz = useRef(null);

  useEffect(() => {
    const mm = gsap.matchMedia();

    mm.add('(prefers-reduced-motion: no-preference)', () => {
      // Abertura: o nome entra letra por letra, uma vez só.
      gsap.from('.nav .name span', { yPercent: 110, duration: 0.7, ease: 'power3.out', stagger: 0.035, delay: 0.1 });

      gsap.from('.hero-h .l > span', { yPercent: 110, duration: 0.9, ease: 'power3.out', stagger: 0.12, delay: 0.25 });

      // Tiles: wipe de cima pra baixo ao entrar na tela, em cascata.
      gsap.set('.tile', { clipPath: 'inset(0 0 100% 0)' });
      ScrollTrigger.batch('.tile', {
        start: 'top 92%',
        once: true,
        onEnter: (lote) =>
          gsap.to(lote, { clipPath: 'inset(0 0 0% 0)', duration: 0.95, ease: 'power3.out', stagger: 0.12 }),
      });
    });

    return () => mm.revert();
  }, []);

  return (
    <div ref={raiz}>
      <header className="nav">
        <a className="name" href="#" aria-label={NOME}>
          {NOME.split('').map((ch, i) => (
            <span key={i} aria-hidden="true">{ch}</span>
          ))}
        </a>
        <a className="contact" href="mailto:ricmaemura@gmail.com">Contact</a>
        <span className="icons">
          <a href="https://github.com/maemura01" aria-label="GitHub"><IconGithub /></a>
          <a href="https://www.linkedin.com/in/ricardo-maemura" aria-label="LinkedIn" target="_blank" rel="noopener noreferrer"><IconLinkedin /></a>
          <a href="mailto:ricmaemura@gmail.com" aria-label="E-mail"><IconMail /></a>
        </span>
      </header>

      <section className="hero">
        <h1 className="hero-h" aria-label="Do dado ao produto, em produção.">
          <span className="l" aria-hidden="true"><span>Do dado ao produto,</span></span>
          <span className="l" aria-hidden="true"><span>em produção.</span></span>
        </h1>
        <div className="hero-row">
          <p className="intro">
            Desenvolvedor full stack com base em dados. Construo painéis, automações e integrações que cerca de
            20 pessoas usam todos os dias. Todas as demos abaixo usam dados fictícios.
          </p>
          <p className="hero-stack">SQL · PostgreSQL · Next.js · React · Supabase · Python · Automação</p>
        </div>
      </section>

      <main className="grid">
        {PROJETOS.map((p) => {
          const conteudo = (
            <>
              {p.arte ?? (
                <div className="tile-art ph" style={{ background: p.cor, color: p.texto, aspectRatio: '4 / 5' }}>
                  <div>
                    <h3>{p.titulo}</h3>
                    <p>Em construção</p>
                  </div>
                </div>
              )}
              <div className="tile-cap">
                <b>{p.titulo}</b>
                <span>{p.stack}</span>
              </div>
            </>
          );
          return p.href ? (
            <a className={`tile${p.wide ? ' wide' : ''}`} key={p.id} href={p.href} target="_blank" rel="noopener noreferrer">{conteudo}</a>
          ) : (
            <div className={`tile${p.wide ? ' wide' : ''}`} key={p.id}>{conteudo}</div>
          );
        })}
      </main>

      <footer className="footer">
        <span>©Ricardo Maemura 2026</span>
        <span>Obrigado por passar por aqui</span>
      </footer>
    </div>
  );
}
