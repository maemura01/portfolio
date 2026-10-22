'use client';

import { useEffect, useRef } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import AriaMock from './AriaMock';

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
  { id: 'funil', titulo: 'Funil de leads + SQL', stack: 'PostgreSQL · CTEs · Metabase', cor: '#1b3fd8', texto: '#fff' },
  { id: 'cadencia', titulo: 'Cadência de WhatsApp', stack: 'Workflow · Regras por etapa', cor: '#f4e72b', texto: '#000' },
  { id: 'resumo', titulo: 'Resumo da direção', stack: 'Cron · Cartão em imagem', cor: '#ff4fa3', texto: '#000' },
  { id: 'scraper', titulo: 'Scraper de CRM', stack: 'Playwright · Python', cor: '#1fa85a', texto: '#fff' },
  { id: 'credenciais', titulo: 'Credenciais seguras', stack: 'ECIES · WebCrypto · Next.js', cor: '#000', texto: '#fff', href: 'https://github.com/maemura01/secure-credential-intake' },
];

function IconGithub() {
  return (
    <svg viewBox="0 0 24 24" aria-hidden="true">
      <path fill="currentColor" d="M12 .5a11.5 11.5 0 0 0-3.64 22.41c.58.1.79-.25.79-.56v-2c-3.2.7-3.88-1.37-3.88-1.37-.52-1.33-1.28-1.69-1.28-1.69-1.04-.71.08-.7.08-.7 1.16.08 1.77 1.19 1.77 1.19 1.03 1.76 2.7 1.25 3.36.96.1-.75.4-1.25.73-1.54-2.55-.29-5.24-1.28-5.24-5.69 0-1.26.45-2.28 1.19-3.08-.12-.29-.52-1.46.11-3.05 0 0 .97-.31 3.17 1.18a10.9 10.9 0 0 1 5.77 0c2.2-1.49 3.17-1.18 3.17-1.18.63 1.59.23 2.76.11 3.05.74.8 1.19 1.82 1.19 3.08 0 4.42-2.69 5.39-5.25 5.68.41.36.78 1.06.78 2.14v3.17c0 .31.21.67.8.56A11.5 11.5 0 0 0 12 .5Z" />
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
          <a href="mailto:ricmaemura@gmail.com" aria-label="E-mail"><IconMail /></a>
        </span>
      </header>

      <p className="intro">
        Desenvolvedor full stack com base em dados. SQL, Next.js, Supabase e automação, em produção para
        cerca de 20 pessoas. Todas as demos abaixo usam dados fictícios.
      </p>

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
            <a className="tile" key={p.id} href={p.href} target="_blank" rel="noopener noreferrer">{conteudo}</a>
          ) : (
            <div className="tile" key={p.id}>{conteudo}</div>
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
