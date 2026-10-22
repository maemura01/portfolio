'use client';

import { useEffect, useRef } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

// Tudo aqui é fictício: nomes inventados, números gerados à mão.
const ABAS = ['Visão geral', 'Gerentes', 'Parceiros'];

const GERENTES = [
  { nome: 'Helena Prado', v: 94, pct: 94 },
  { nome: 'Rafael Nunes', v: 81, pct: 81 },
  { nome: 'Beatriz Lima', v: 80, pct: 80, sobe: 86 },
  { nome: 'Tiago Moura', v: 63, pct: 63 },
  { nome: 'Camila Duarte', v: 51, pct: 51 },
];

const PARCEIROS = [
  { nome: 'Solar Vale', v: 38, pct: 100, tom: 'ativa' },
  { nome: 'Casa Aurora', v: 31, pct: 82, tom: 'ativa' },
  { nome: 'Mercado Brisa', v: 24, pct: 63, tom: 'ativa' },
  { nome: 'Loja do Sul', v: 17, pct: 45, tom: 'ativa' },
  { nome: 'Ponto Leste', v: 9, pct: 24, tom: 'inativa' },
];

const SPARK = [34, 48, 41, 62, 55, 78, 70, 92];

export default function ParceirosMock() {
  const root = useRef(null);

  useEffect(() => {
    const el = root.current;
    if (!el) return;
    const q = (s) => el.querySelector(s);
    const qa = (s) => el.querySelectorAll(s);

    const views = [q('[data-v="0"]'), q('[data-v="1"]'), q('[data-v="2"]')];
    const indicador = q('.pg-ind');
    const vendas = q('[data-vendas]');
    const meta = q('[data-meta]');
    const spark = qa('.pg-spark i');
    const gBars = qa('[data-g] .pg-fill');
    const gRows = qa('[data-g]');
    const gVal = qa('[data-g] b');
    const pBars = qa('[data-p] .pg-fill');
    const anel = q('[data-anel]');
    const anelTxt = q('[data-anel-txt]');

    const fmtVendas = (n) => String(Math.round(n));
    const mm = gsap.matchMedia();

    mm.add('(prefers-reduced-motion: reduce)', () => {
      gsap.set(views, { autoAlpha: 0 });
      gsap.set(views[0], { autoAlpha: 1 });
      vendas.textContent = fmtVendas(312);
      gsap.set(meta, { width: '78%' });
      gsap.set(spark, { scaleY: 1 });
    });

    mm.add('(prefers-reduced-motion: no-preference)', () => {
      const c = { n: 0, a: 0, s: 80 };
      const tl = gsap.timeline({ repeat: -1, paused: true });
      const T = 3.7; // duração de cada aba

      // aba 1 — visão geral
      tl.set(views, { autoAlpha: 0, y: 8 }, 0)
        .set(views[0], { autoAlpha: 1, y: 0 }, 0)
        .set(indicador, { xPercent: 0 }, 0)
        .fromTo(c, { n: 0 }, { n: 312, duration: 1.5, ease: 'power2.out', onUpdate: () => (vendas.textContent = fmtVendas(c.n)) }, 0.15)
        .fromTo(meta, { width: '0%' }, { width: '78%', duration: 1.5, ease: 'power3.out' }, 0.15)
        .fromTo(spark, { scaleY: 0 }, { scaleY: 1, duration: 0.6, ease: 'back.out(1.6)', stagger: 0.07 }, 0.3);

      // aba 2 — gerentes
      tl.to(views[0], { autoAlpha: 0, y: -8, duration: 0.3 }, T - 0.3)
        .to(indicador, { xPercent: 100, duration: 0.45, ease: 'power3.inOut' }, T - 0.3)
        .fromTo(views[1], { autoAlpha: 0, y: 8 }, { autoAlpha: 1, y: 0, duration: 0.35 }, T)
        .fromTo(gBars, { scaleX: 0 }, { scaleX: 1, duration: 0.8, ease: 'power3.out', stagger: 0.09, transformOrigin: 'left center' }, T + 0.1)
        .set(gRows, { y: 0 }, T)
        .set(gBars[2], { width: '80%' }, T)
        .to(gBars[2], { width: '88%', duration: 0.7, ease: 'power2.inOut' }, T + 1.5)
        .to(c, { s: 86, duration: 0.7, ease: 'power2.inOut', onUpdate: () => (gVal[2].textContent = Math.round(c.s)) }, T + 1.5)
        .to(gRows[1], { y: () => gRows[1].offsetHeight + 6, duration: 0.6, ease: 'power2.inOut' }, T + 1.9)
        .to(gRows[2], { y: () => -(gRows[2].offsetHeight + 6), duration: 0.6, ease: 'power2.inOut' }, T + 1.9);

      // aba 3 — parceiros
      tl.to(views[1], { autoAlpha: 0, y: -8, duration: 0.3 }, 2 * T - 0.3)
        .to(indicador, { xPercent: 200, duration: 0.45, ease: 'power3.inOut' }, 2 * T - 0.3)
        .fromTo(views[2], { autoAlpha: 0, y: 8 }, { autoAlpha: 1, y: 0, duration: 0.35 }, 2 * T)
        .fromTo(pBars, { scaleX: 0 }, { scaleX: 1, duration: 0.8, ease: 'power3.out', stagger: 0.09, transformOrigin: 'left center' }, 2 * T + 0.1)
        .fromTo(c, { a: 0 }, { a: 64, duration: 1.2, ease: 'power2.out', onUpdate: () => {
          anel.style.strokeDasharray = `${(c.a / 100) * 100} 100`;
          anelTxt.textContent = `${Math.round(c.a)}%`;
        } }, 2 * T + 0.2);

      // volta pra aba 1
      tl.to(views[2], { autoAlpha: 0, y: -8, duration: 0.3 }, 3 * T - 0.3)
        .to(indicador, { xPercent: 0, duration: 0.45, ease: 'power3.inOut' }, 3 * T - 0.3)
        .to({}, { duration: 0.3 }, 3 * T);

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
    <div ref={root} className="tile-art pg-art" aria-label="Demonstração animada de um painel de parceiros e gerentes, com dados fictícios">
      <div className="pg-win">
        <div className="pg-top">
          <b>Parceiros &amp; Gerentes</b>
          <span>Mês · dia útil 14/22</span>
        </div>
        <div className="pg-tabs">
          {ABAS.map((a) => (
            <span key={a}>{a}</span>
          ))}
          <i className="pg-ind" />
        </div>

        <div className="pg-body">
          {/* Visão geral */}
          <section data-v="0" className="pg-view">
            <div className="pg-big">
              <small>Vendas no período</small>
              <b data-vendas>312</b>
              <em>▲ 12% vs. mesmo trecho anterior</em>
            </div>
            <div className="pg-meta">
              <div className="pg-meta-l"><span>Meta do mês</span><span>78%</span></div>
              <div className="pg-track"><i data-meta className="pg-fill-meta" /></div>
            </div>
            <div className="pg-spark" aria-hidden="true">
              {SPARK.map((h, i) => (
                <i key={i} style={{ height: `${h}%` }} />
              ))}
            </div>
          </section>

          {/* Gerentes */}
          <section data-v="1" className="pg-view">
            <p className="pg-h">Ranking de gerentes · vendas</p>
            {GERENTES.map((g, i) => (
              <div className="pg-row" data-g key={g.nome}>
                <span className="pg-rank">{i + 1}</span>
                <div className="pg-rbody">
                  <div className="pg-rl"><span>{g.nome}</span><b>{g.v}</b></div>
                  <div className="pg-track"><i className="pg-fill" style={{ width: `${g.pct}%` }} /></div>
                </div>
              </div>
            ))}
          </section>

          {/* Parceiros */}
          <section data-v="2" className="pg-view">
            <div className="pg-ringrow">
              <svg viewBox="0 0 36 36" className="pg-ring" aria-hidden="true">
                <circle cx="18" cy="18" r="15.9155" fill="none" stroke="#e8ecf5" strokeWidth="4" />
                <circle data-anel cx="18" cy="18" r="15.9155" fill="none" stroke="#1fa85a" strokeWidth="4" strokeDasharray="64 100" strokeLinecap="butt" transform="rotate(-90 18 18)" />
              </svg>
              <div className="pg-ringtxt"><b data-anel-txt>64%</b><span>lojas ativas</span></div>
            </div>
            <p className="pg-h">Top parceiros · vendas</p>
            {PARCEIROS.map((p) => (
              <div className="pg-row pg-row-s" data-p key={p.nome}>
                <div className="pg-rbody">
                  <div className="pg-rl">
                    <span><i className={`pg-dot ${p.tom}`} />{p.nome}</span>
                    <b>{p.v}</b>
                  </div>
                  <div className="pg-track"><i className="pg-fill" style={{ width: `${p.pct}%` }} /></div>
                </div>
              </div>
            ))}
          </section>
        </div>
        <div className="pg-foot">Dados fictícios</div>
      </div>
    </div>
  );
}
