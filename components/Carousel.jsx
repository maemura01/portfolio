'use client';

import { useEffect, useRef } from 'react';
import { gsap } from 'gsap';
import { movimentoLigado } from './motion';
import { Draggable } from 'gsap/Draggable';
import { InertiaPlugin } from 'gsap/InertiaPlugin';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import ScaledArt from './ScaledArt';
import { PROJETOS, Arte } from './projects';

gsap.registerPlugin(Draggable, InertiaPlugin, ScrollTrigger);

const GAP = 24;

export default function Carousel({ onOpen }) {
  const viewport = useRef(null);
  const track = useRef(null);
  const barra = useRef(null);
  const api = useRef({});
  const arrastou = useRef(false);

  useEffect(() => {
    const vp = viewport.current;
    const tr = track.current;
    if (!vp || !tr) return;

    const limite = () => Math.max(0, tr.scrollWidth - vp.clientWidth);
    const passo = () => tr.firstElementChild.getBoundingClientRect().width + GAP;
    const cartoesEl = [...tr.querySelectorAll('.card')];
    const paralaxe = () => {
      const r = vp.getBoundingClientRect();
      const meio = r.left + r.width / 2;
      cartoesEl.forEach((cd) => {
        const b = cd.getBoundingClientRect();
        const d = (b.left + b.width / 2 - meio) / r.width;
        gsap.set(cd.querySelector('.card-scale'), { x: d * -34 });
        gsap.set(cd.querySelector('.card-meta'), { x: d * 14 });
      });
    };
    const progresso = () => {
      const m = limite();
      gsap.set(barra.current, { scaleX: m ? Math.min(1, Math.max(0.04, -gsap.getProperty(tr, 'x') / m)) : 1 });
      paralaxe();
    };

    const [d] = Draggable.create(tr, {
      type: 'x',
      inertia: true,
      bounds: { minX: -limite(), maxX: 0 },
      edgeResistance: 0.85,
      snap: { x: (v) => Math.max(-limite(), Math.min(0, Math.round(v / passo()) * passo())) },
      onPress() { arrastou.current = false; },
      onDragStart() { arrastou.current = true; },
      onDrag: progresso,
      onThrowUpdate: progresso,
    });

    const ir = (dir) => {
      const alvo = Math.max(-limite(), Math.min(0, Math.round(gsap.getProperty(tr, 'x') / passo()) * passo() - dir * passo()));
      gsap.to(tr, { x: alvo, duration: 0.8, ease: 'power3.out', onUpdate: () => { d.update(true); progresso(); } });
    };
    api.current = { ir };

    const aoRedimensionar = () => {
      d.applyBounds({ minX: -limite(), maxX: 0 });
      progresso();
    };
    window.addEventListener('resize', aoRedimensionar);
    progresso();

    // Entrada: cartões sobem em cascata.
    const mm = gsap.matchMedia();
    if (movimentoLigado()) mm.add('all', () => {
      gsap.from('.card', {
        y: 40,
        autoAlpha: 0,
        duration: 0.8,
        ease: 'power3.out',
        stagger: 0.09,
        scrollTrigger: { trigger: vp, start: 'top 85%', once: true },
      });
    });

    // Inclinação seguindo o mouse (só em ponteiro fino).
    const cartoes = tr.querySelectorAll('.card');
    const limpar = [];
    if (movimentoLigado() && window.matchMedia('(hover: hover)').matches) {
      cartoes.forEach((c) => {
        const alvo = c.querySelector('.card-in');
        const rx = gsap.quickTo(alvo, 'rotationX', { duration: 0.5, ease: 'power3.out' });
        const ry = gsap.quickTo(alvo, 'rotationY', { duration: 0.5, ease: 'power3.out' });
        gsap.set(alvo, { transformPerspective: 900 });
        const mover = (e) => {
          const r = c.getBoundingClientRect();
          ry(((e.clientX - r.left) / r.width - 0.5) * 8);
          rx(-((e.clientY - r.top) / r.height - 0.5) * 8);
        };
        const sair = () => { rx(0); ry(0); };
        c.addEventListener('pointermove', mover);
        c.addEventListener('pointerleave', sair);
        limpar.push(() => { c.removeEventListener('pointermove', mover); c.removeEventListener('pointerleave', sair); });
      });
    }

    return () => {
      window.removeEventListener('resize', aoRedimensionar);
      limpar.forEach((f) => f());
      mm.revert();
      d.kill();
    };
  }, []);

  const abrir = (id) => {
    if (arrastou.current) return; // foi um arrasto, não um clique
    onOpen(id);
  };

  return (
    <div className="carousel">
      <div className="car-head">
        <span className="mono">Arraste ou clique para abrir a demo</span>
        <span className="car-btns">
          <button type="button" className="car-btn" onClick={() => api.current.ir?.(-1)} aria-label="Anterior">←</button>
          <button type="button" className="car-btn" onClick={() => api.current.ir?.(1)} aria-label="Próximo">→</button>
        </span>
      </div>
      <div className="car-viewport" ref={viewport}>
        <div className="car-track" ref={track}>
          {PROJETOS.map((p, i) => (
            <button type="button" className="card" key={p.id} onClick={() => abrir(p.id)} aria-label={`Abrir demo: ${p.titulo}`}>
              <div className="card-in">
                <div className="card-art" style={{ background: p.cor }}>
                  <div className="card-scale">
                    <ScaledArt w={p.design.w} h={p.design.h} wide={p.design.w > p.design.h}>
                      <Arte id={p.id} />
                    </ScaledArt>
                  </div>
                </div>
                <div className="card-meta">
                  <span className="mono card-idx">{String(i + 1).padStart(2, '0')}</span>
                  <h3>{p.titulo}</h3>
                  <p>{p.resumo}</p>
                  <span className="mono card-go">{p.interativo ? 'Abrir demo interativa ↗' : 'Ver como funciona ↗'}</span>
                </div>
              </div>
            </button>
          ))}
        </div>
      </div>
      <div className="car-bar" aria-hidden="true"><i ref={barra} /></div>
    </div>
  );
}
