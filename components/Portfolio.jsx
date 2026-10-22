'use client';

import { useEffect, useRef, useState } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

import Carousel from './Carousel';
import Story from './Story';
import Modal from './Modal';

gsap.registerPlugin(ScrollTrigger);

const GITHUB = 'https://github.com/maemura01';
const LINKEDIN = 'https://www.linkedin.com/in/ricardo-maemura';
const EMAIL = 'mailto:ricmaemura@gmail.com';

// Caminho da foto em /public (ex.: '/foto.jpg'). Sem foto, o espaço não aparece.
const FOTO = '/foto.jpg';

const STATS = [
  { to: 30, pre: '+', suf: ' mil', rotulo: 'registros por mês processados em pipelines' },
  { to: 70, pre: '+', suf: ' mil', rotulo: 'registros extraídos e estruturados em Python' },
  { to: 20, pre: '~', suf: '', rotulo: 'pessoas usam os meus painéis todos os dias' },
];

const FATOS = [
  ['Base', 'Ribeirão Preto, SP'],
  ['Formação', 'Ciência da Computação, UNIP (2028)'],
  ['Certificação', 'DP-900 Azure Data Fundamentals'],
  ['Idiomas', 'Inglês fluente, japonês básico'],
];

const MARQUEE = ['SQL', 'PostgreSQL', 'Next.js', 'React', 'Supabase', 'Python', 'Playwright', 'FastAPI', 'Metabase', 'Power BI', 'Automação', 'Vercel'];

const STACK = [
  ['Dados e banco', 'PostgreSQL avançado, CTEs, window functions, JSONB, ETL, modelagem e Data Quality.'],
  ['Full stack', 'JavaScript e TypeScript, React, Next.js, Node.js, APIs serverless, OAuth e deploy na Vercel.'],
  ['Automação', 'Python (Pandas, Selenium, Playwright, FastAPI), cron, WhatsApp e Google Calendar.'],
  ['BI', 'Metabase, Power BI e Excel avançado, com Supabase (Auth, RLS e migrations) no lado do app.'],
];

export default function Portfolio() {
  const raiz = useRef(null);
  const [aberto, setAberto] = useState(null);

  useEffect(() => {
    const mm = gsap.matchMedia();

    mm.add('(prefers-reduced-motion: no-preference)', () => {
      // Abertura: a frase sobe linha por linha, uma vez só.
      gsap.from('.hero-h .l > span', { yPercent: 110, duration: 0.9, ease: 'power3.out', stagger: 0.12, delay: 0.15 });
      gsap.from('.hero-side > *', { autoAlpha: 0, y: 14, duration: 0.7, ease: 'power2.out', stagger: 0.1, delay: 0.55 });

      // O marca-texto âmbar se desenha da esquerda pra direita.
      gsap.fromTo('.hero-h mark', { '--mk': 0 }, { '--mk': 1, duration: 0.9, ease: 'power3.out', delay: 1.0 });

      // Régua: as marcações se revelam e os marcadores âmbar crescem.
      gsap.fromTo('.ruler', { clipPath: 'inset(0 100% 0 0)' }, { clipPath: 'inset(0 0% 0 0)', duration: 1.4, ease: 'power3.inOut', delay: 0.3 });
      gsap.from('.ruler i', { scaleY: 0, transformOrigin: 'bottom', duration: 0.5, ease: 'back.out(2)', stagger: 0.14, delay: 1.1 });

      // Barra de progresso de leitura no menu.
      gsap.to('.progress', {
        scaleX: 1,
        ease: 'none',
        scrollTrigger: { start: 0, end: 'max', scrub: 0.2 },
      });

      // Faixa de tecnologias passando sem parar.
      gsap.to('.marquee-track', { xPercent: -50, duration: 32, ease: 'none', repeat: -1 });

      // Números que contam do zero ao entrar na tela.
      gsap.utils.toArray('[data-count]').forEach((el) => {
        const { to, pre = '', suf = '' } = el.dataset;
        const alvo = Number(to);
        const o = { v: 0 };
        el.textContent = `${pre}0${suf}`;
        ScrollTrigger.create({
          trigger: el,
          start: 'top 90%',
          once: true,
          onEnter: () =>
            gsap.to(o, { v: alvo, duration: 1.6, ease: 'power2.out', onUpdate: () => (el.textContent = `${pre}${Math.round(o.v)}${suf}`) }),
        });
      });

      // Sobre mim e stack: blocos sobem em cascata.
      gsap.set('.reveal > *', { autoAlpha: 0, y: 18 });
      ScrollTrigger.batch('.reveal', {
        start: 'top 88%',
        once: true,
        onEnter: (lote) =>
          lote.forEach((el) => gsap.to(el.children, { autoAlpha: 1, y: 0, duration: 0.7, ease: 'power2.out', stagger: 0.09 })),
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
            <a href="#como">Como funciona</a>
            <a href="#sobre">Sobre</a>
            <a href="#stack">Stack</a>
            <a href={LINKEDIN} target="_blank" rel="noopener noreferrer">LinkedIn</a>
            <a className="btn btn-amber" href={EMAIL}>Contato ↗</a>
          </nav>
        </div>
        <i className="progress" aria-hidden="true" />
      </header>

      <main>
        <section className="wrap hero">
          <div className="hero-main">
            <p className="eyebrow mono"><i aria-hidden="true" />Analista de Dados Pleno · Full Stack</p>
          <h1 className="hero-h" aria-label="Do dado ao produto, em produção.">
            <span className="l" aria-hidden="true"><span>Do dado ao produto,</span></span>
            <span className="l" aria-hidden="true"><span>em <mark>produção</mark>.</span></span>
          </h1>
          </div>
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
          <div className="sec-h mono"><span>Projetos selecionados</span><span>05</span></div>
          <Carousel onOpen={setAberto} />
        </section>

        <Story />

        <div className="marquee" aria-hidden="true">
          <div className="marquee-track">
            {[...MARQUEE, ...MARQUEE].map((t, i) => (
              <span className="mono" key={i}>{t}<em>✦</em></span>
            ))}
          </div>
        </div>

        <section className="wrap sobre" id="sobre">
          <div className="reveal sobre-h">
            <span className="mono">Sobre mim</span>
            <h2>Comecei pelos dados e fui atrás do que vem depois da análise.</h2>
            {FOTO && (
              <figure className="foto">
                <img src={FOTO} alt="Ricardo Maemura" width="640" height="800" loading="lazy" />
              </figure>
            )}
          </div>
          <div className="reveal sobre-text">
            <p>
              Sou o Ricardo, de Ribeirão Preto (SP). Comecei com SQL, ETL e dashboards e percebi que o que mais me
              interessava era o que acontece depois da análise. Passei a construir a solução inteira: o banco, as
              regras de acesso, a interface e a automação que roda sozinha.
            </p>
            <p>
              Hoje sou analista de dados pleno e desenvolvo, junto com isso, painéis e integrações que o time comercial
              e a diretoria usam todos os dias. Gosto de transformar análise técnica em algo que se entende de
              relance, e de entregar de ponta a ponta, sem depender de microgerenciamento.
            </p>
            <p>
              Agora aprofundo Engenharia de Dados (orquestração, Data Warehouse e nuvem) sem largar o lado de produto.
            </p>
            <div className="stats">
              {STATS.map((s) => (
                <div className="stat" key={s.rotulo}>
                  <b data-count data-to={s.to} data-pre={s.pre} data-suf={s.suf}>{`${s.pre}${s.to}${s.suf}`}</b>
                  <span className="mono">{s.rotulo}</span>
                </div>
              ))}
            </div>
            <div className="fatos">
              {FATOS.map(([k, v]) => (
                <div className="li" key={k}>
                  <b>{k}</b>
                  <p>{v}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        <section className="wrap stack reveal" id="stack">
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
      {aberto && <Modal id={aberto} onClose={() => setAberto(null)} />}
    </div>
  );
}
