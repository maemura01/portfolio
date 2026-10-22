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

const GITHUB = 'https://github.com/maemura01';
const LINKEDIN = 'https://www.linkedin.com/in/ricardo-maemura';
const EMAIL = 'mailto:ricmaemura@gmail.com';

// Descrições genéricas: nada de nome de empresa, parceiro ou cliente.
const PROJETOS = [
  {
    id: 'aria',
    titulo: 'Aria Console',
    desc: 'Painel de uma IA de SDR que agenda reuniões. Agenda integrada ao Google Calendar com arrastar-e-soltar, métricas de conversão e permissões por usuário. Redesenhei a interface praticamente inteira.',
    tags: ['React', 'Supabase', 'Google Calendar', 'RLS'],
    href: `${GITHUB}/aria-console`,
    link: 'Ver código ↗',
    arte: <AriaMock />,
  },
  {
    id: 'parceiros',
    titulo: 'Painel de parceiros e gerentes',
    desc: 'Doze visões para a diretoria: ranking de gerentes, top de parceiros, meta do período e comparação por dia útil. Envia um resumo automático por WhatsApp em horários fixos.',
    tags: ['SQL', 'Vercel', 'Cron', 'WhatsApp'],
    nota: 'Código privado · demo com dados fictícios',
    arte: <ParceirosMock />,
  },
  {
    id: 'sql',
    titulo: 'Funil de leads em SQL',
    desc: 'Pipeline que processa mais de 30 mil leads por mês e liga as plataformas de mídia paga ao funil de vendas. CTEs e window functions para CPL, CAC e conversão por origem.',
    tags: ['PostgreSQL', 'CTEs', 'Window functions', 'Metabase'],
    nota: 'Consulta ilustrativa · dados fictícios',
    arte: <SqlMock />,
  },
  {
    id: 'scraper',
    titulo: 'Scraper de CRM',
    desc: 'Automação de interface para extrair propostas de um CRM sem API: sessão reaproveitada, paginação, gravação incremental e checkpoint para retomar de onde parou.',
    tags: ['Python', 'Playwright', 'FastAPI'],
    href: `${GITHUB}/crm-proposal-scraper`,
    link: 'Ver código ↗',
    arte: <CrmMock />,
    wide: true,
  },
  {
    id: 'credenciais',
    titulo: 'Credenciais cifradas no navegador',
    desc: 'Coleta de credenciais cifradas no aparelho do usuário (ECIES e WebCrypto), lidas só no servidor e com cada leitura auditada por nome e horário.',
    tags: ['ECIES', 'WebCrypto', 'Next.js', 'Supabase'],
    href: `${GITHUB}/secure-credential-intake`,
    link: 'Ver código ↗',
    arte: <CredMock />,
    wide: true,
  },
];

const STACK = [
  ['Dados e banco', 'PostgreSQL avançado, CTEs, window functions, JSONB, ETL, modelagem e Data Quality.'],
  ['Full stack', 'JavaScript e TypeScript, React, Next.js, Node.js, APIs serverless, OAuth e deploy na Vercel.'],
  ['Automação', 'Python (Pandas, Selenium, Playwright, FastAPI), cron, WhatsApp e Google Calendar.'],
  ['BI', 'Metabase, Power BI e Excel avançado, com Supabase (Auth, RLS e migrations) no lado do app.'],
];

export default function Portfolio() {
  const raiz = useRef(null);

  useEffect(() => {
    const mm = gsap.matchMedia();

    mm.add('(prefers-reduced-motion: no-preference)', () => {
      // Abertura: a frase sobe linha por linha, uma vez só.
      gsap.from('.hero-h .l > span', { yPercent: 110, duration: 0.9, ease: 'power3.out', stagger: 0.12, delay: 0.15 });
      gsap.from('.hero-side > *', { autoAlpha: 0, y: 14, duration: 0.7, ease: 'power2.out', stagger: 0.1, delay: 0.55 });

      // Cada projeto: a demo abre com wipe de cima pra baixo e o texto sobe.
      gsap.set('.proj-art', { clipPath: 'inset(0 0 100% 0)' });
      gsap.set('.p-text > *', { autoAlpha: 0, y: 16 });
      ScrollTrigger.batch('.proj-art', {
        start: 'top 88%',
        once: true,
        onEnter: (lote) => gsap.to(lote, { clipPath: 'inset(0 0 0% 0)', duration: 0.95, ease: 'power3.out', stagger: 0.12 }),
      });
      ScrollTrigger.batch('.p-text', {
        start: 'top 88%',
        once: true,
        onEnter: (lote) =>
          lote.forEach((el) =>
            gsap.to(el.children, { autoAlpha: 1, y: 0, duration: 0.7, ease: 'power2.out', stagger: 0.08 })
          ),
      });
    });

    return () => mm.revert();
  }, []);

  return (
    <div ref={raiz}>
      <header className="nav">
        <div className="wrap">
          <a className="brand" href="#" aria-label="Ricardo Maemura">
            <i aria-hidden="true" />
            Ricardo Maemura
          </a>
          <nav className="nav-links mono">
            <a href="#projetos">Projetos</a>
            <a href="#stack">Stack</a>
            <a href={LINKEDIN} target="_blank" rel="noopener noreferrer">LinkedIn</a>
            <a className="btn btn-amber" href={EMAIL}>Contato ↗</a>
          </nav>
        </div>
      </header>

      <main>
        <section className="wrap hero">
          <h1 className="hero-h" aria-label="Do dado ao produto, em produção.">
            <span className="l" aria-hidden="true"><span>Do dado ao produto,</span></span>
            <span className="l" aria-hidden="true"><span>em <mark>produção</mark>.</span></span>
          </h1>
          <div className="hero-side">
            <p>
              Desenvolvedor full stack com base em dados. Construo painéis, automações e integrações que
              cerca de 20 pessoas usam todos os dias.
            </p>
            <div className="hero-btns">
              <a className="btn btn-amber" href="#projetos">Ver projetos ↓</a>
              <a className="btn btn-ghost" href={GITHUB} target="_blank" rel="noopener noreferrer">GitHub ↗</a>
            </div>
            <p className="hero-meta mono">Todas as demos usam dados fictícios</p>
          </div>
        </section>

        <div className="ruler" aria-hidden="true">
          <span className="rl">jan 2025</span>
          <i style={{ left: '18%' }} />
          <i style={{ left: '41%' }} />
          <i style={{ left: '67%' }} />
          <i style={{ left: '88%' }} />
          <span className="rr">hoje</span>
        </div>

        <section className="wrap" id="projetos">
          <div className="sec-h mono"><span>Projetos selecionados</span><span>{String(PROJETOS.length).padStart(2, '0')}</span></div>
          {PROJETOS.map((p, i) => (
            <article className={`proj${p.wide ? ' wide' : ''}`} key={p.id}>
              <div className="p-text">
                <span className="p-idx mono">{String(i + 1).padStart(2, '0')}</span>
                <h3 className="p-title">{p.titulo}</h3>
                <p className="p-desc">{p.desc}</p>
                <div className="tags">
                  {p.tags.map((t) => (
                    <span className="pill" key={t}>{t}</span>
                  ))}
                </div>
                {p.href ? (
                  <a className="p-link mono" href={p.href} target="_blank" rel="noopener noreferrer">{p.link}</a>
                ) : (
                  <p className="p-note mono">{p.nota}</p>
                )}
              </div>
              <div className="proj-art">{p.arte}</div>
            </article>
          ))}
        </section>

        <section className="wrap stack" id="stack">
          <h2>Do banco de dados à interface.</h2>
          <div className="stack-list">
            {STACK.map(([titulo, texto]) => (
              <div className="li" key={titulo}>
                <b>{titulo}</b>
                <p>{texto}</p>
              </div>
            ))}
          </div>
        </section>
      </main>

      <footer className="wrap footer mono">
        <span>©Ricardo Maemura 2026</span>
        <span className="links">
          <a href={GITHUB} target="_blank" rel="noopener noreferrer">GitHub</a>
          <a href={LINKEDIN} target="_blank" rel="noopener noreferrer">LinkedIn</a>
          <a href={EMAIL}>ricmaemura@gmail.com</a>
        </span>
      </footer>
    </div>
  );
}
