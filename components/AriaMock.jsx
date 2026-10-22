'use client';

import { useEffect, useRef } from 'react';
import { gsap } from 'gsap';
import { movimentoLigado } from './motion';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

const DIAS = ['Seg', 'Ter', 'Qua', 'Qui', 'Sex'];
const HORAS = ['09:00', '10:00', '14:00', '15:00'];

// Dados fictícios: nomes inventados, nada de cliente real.
const CHIPS = [
  { r: 0, c: 0, cor: 'blue', nome: 'Ana L.', sub: 'Individual' },
  { r: 0, c: 2, cor: 'coral', nome: 'Coletiva', sub: '5 parceiros' },
  { r: 1, c: 1, cor: 'green', nome: 'Carlos M.', sub: 'Individual', arrastar: true },
  { r: 1, c: 3, cor: 'navy', nome: 'Bruno S.', sub: 'Individual' },
  { r: 2, c: 0, cor: 'coral', nome: 'Coletiva', sub: '4 parceiros' },
  { r: 2, c: 2, cor: 'blue', nome: 'Marina T.', sub: 'Individual' },
  { r: 3, c: 4, cor: 'green', nome: 'Paulo R.', sub: 'Individual' },
  { r: 3, c: 1, cor: 'blue', nome: 'Lívia C.', sub: 'Individual' },
];

const KPIS = [
  { rotulo: 'Reuniões', alvo: 128, fmt: (v) => String(Math.round(v)) },
  { rotulo: 'Agendamento', alvo: 34, fmt: (v) => `${Math.round(v)}%` },
  { rotulo: 'Score médio', alvo: 8.2, fmt: (v) => v.toFixed(1).replace('.', ',') },
];

const DESTINO = { r: 2, c: 3 };

export default function AriaMock() {
  const root = useRef(null);

  useEffect(() => {
    const el = root.current;
    if (!el) return;

    const kpiEls = el.querySelectorAll('[data-kpi]');
    const chips = el.querySelectorAll('.aria-chip');
    const arrastado = el.querySelector('.aria-chip[data-arrastar]');
    const cursor = el.querySelector('.aria-cursor');
    const destino = el.querySelector(`.c[data-r="${DESTINO.r}"][data-c="${DESTINO.c}"]`);

    const pintaKpis = (progresso) => {
      kpiEls.forEach((k, i) => {
        k.textContent = KPIS[i].fmt(KPIS[i].alvo * progresso);
      });
    };

    const mm = gsap.matchMedia();

    // Sem animação: mostra o estado final, parado.
    if (!movimentoLigado()) mm.add('all', () => {
      pintaKpis(1);
      gsap.set(chips, { scale: 1, opacity: 1 });
      if (arrastado && destino) {
        const a = arrastado.getBoundingClientRect();
        const b = destino.getBoundingClientRect();
        gsap.set(arrastado, { x: b.left - a.left, y: b.top - a.top });
      }
    });

    if (movimentoLigado()) mm.add('all', () => {
      const contador = { p: 0 };
      const tl = gsap.timeline({ repeat: -1, paused: true });

      tl.fromTo(contador, { p: 0 }, { p: 1, duration: 1.6, ease: 'power2.out', onUpdate: () => pintaKpis(contador.p) }, 0.1)
        .fromTo(
          chips,
          { scale: 0, opacity: 0, x: 0, y: 0 },
          { scale: 1, opacity: 1, duration: 0.45, ease: 'back.out(1.7)', stagger: 0.13 },
          0.25
        )
        .add(() => arrastado?.classList.add('drag'), '+=0.6')
        .to(cursor, { opacity: 1, duration: 0.2 })
        .to(arrastado, {
          x: () => destino.getBoundingClientRect().left - arrastado.getBoundingClientRect().left + gsap.getProperty(arrastado, 'x'),
          y: () => destino.getBoundingClientRect().top - arrastado.getBoundingClientRect().top + gsap.getProperty(arrastado, 'y'),
          duration: 1.05,
          ease: 'power2.inOut',
        })
        .to(cursor, { opacity: 0, duration: 0.2 })
        .add(() => arrastado?.classList.remove('drag'))
        .to(chips, { opacity: 0, scale: 0.8, duration: 0.35, stagger: 0.05, ease: 'power1.in' }, '+=1.8');

      // Só roda quando o tile está na tela.
      const st = ScrollTrigger.create({
        trigger: el,
        start: 'top 95%',
        end: 'bottom 5%',
        onToggle: (self) => (self.isActive ? tl.play() : tl.pause()),
      });

      return () => {
        st.kill();
        tl.kill();
      };
    });

    return () => mm.revert();
  }, []);

  return (
    <div ref={root} className="tile-art aria-art" aria-label="Demonstração animada do Aria Console, com dados fictícios">
      <div className="aria-win">
        <div className="aria-top">
          <div className="aria-avatar">A</div>
          <div className="aria-name">
            Aria
            <small><i className="dot" /> IA ativa</small>
          </div>
        </div>
        <div className="aria-kpis">
          {KPIS.map((k) => (
            <div className="aria-kpi" key={k.rotulo}>
              <b data-kpi>{k.fmt(k.alvo)}</b>
              <span>{k.rotulo}</span>
            </div>
          ))}
        </div>
        <div className="aria-cal">
          <div className="h" />
          {DIAS.map((d) => (
            <div className="h" key={d}>{d}</div>
          ))}
          {HORAS.map((h, r) => (
            <FragmentLinha key={h} hora={h} r={r} />
          ))}
        </div>
      </div>
    </div>
  );
}

function FragmentLinha({ hora, r }) {
  return (
    <>
      <div className="t">{hora}</div>
      {DIAS.map((_, c) => {
        const chip = CHIPS.find((x) => x.r === r && x.c === c);
        return (
          <div className="c" data-r={r} data-c={c} key={c}>
            {chip && (
              <div className={`aria-chip chip-${chip.cor}`} {...(chip.arrastar ? { 'data-arrastar': '' } : {})}>
                {chip.nome}
                <i>{chip.sub}</i>
                {chip.arrastar && (
                  <svg className="aria-cursor" viewBox="0 0 24 24" aria-hidden="true">
                    <path d="M4 3l16 8-7 2-3 7z" fill="#fff" stroke="#000" strokeWidth="1.5" strokeLinejoin="round" />
                  </svg>
                )}
              </div>
            )}
          </div>
        );
      })}
    </>
  );
}
