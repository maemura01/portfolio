'use client';

import { useEffect, useRef } from 'react';
import { gsap } from 'gsap';
import AriaDemo from './AriaDemo';
import ScaledArt from './ScaledArt';
import { PROJETOS, Arte } from './projects';

export default function Modal({ id, onClose }) {
  const raiz = useRef(null);
  const fechar = useRef(null);
  const p = PROJETOS.find((x) => x.id === id);

  useEffect(() => {
    const anterior = document.activeElement;
    const reduzido = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    document.body.style.overflow = 'hidden';
    fechar.current?.focus();

    if (!reduzido) {
      gsap.fromTo(raiz.current, { clipPath: 'inset(8% 8% 8% 8% round 2px)', autoAlpha: 0 }, { clipPath: 'inset(0% 0% 0% 0% round 0px)', autoAlpha: 1, duration: 0.5, ease: 'power3.out' });
      gsap.from('.md-side > *, .md-stage', { y: 18, autoAlpha: 0, duration: 0.6, ease: 'power2.out', stagger: 0.08, delay: 0.2 });
    }

    const tecla = (e) => { if (e.key === 'Escape') onClose(); };
    window.addEventListener('keydown', tecla);
    return () => {
      document.body.style.overflow = '';
      window.removeEventListener('keydown', tecla);
      anterior?.focus?.();
    };
  }, [onClose]);

  if (!p) return null;

  return (
    <div className="modal" data-lenis-prevent role="dialog" aria-modal="true" aria-label={p.titulo} ref={raiz}>
      <div className="md-bar">
        <span className="mono">{p.interativo ? 'Demo interativa · dados fictícios' : 'Como funciona · dados fictícios'}</span>
        <button type="button" className="btn btn-ghost" onClick={onClose} ref={fechar}>Fechar ✕</button>
      </div>

      <div className="md-body">
        <aside className="md-side">
          <h2>{p.titulo}</h2>
          <span className="mono">Problema</span>
          <p>{p.problema}</p>
          <span className="mono">Como foi feito</span>
          <ul className="md-camadas">
            {p.camadas.map(([nome, itens, nota]) => (
              <li key={nome}>
                <b className="mono">{nome}</b>
                <p>{nota}</p>
                <div className="tags">{itens.map((t) => <span className="pill" key={t}>{t}</span>)}</div>
              </li>
            ))}
          </ul>
          <span className="mono">O que resolve</span>
          <p>{p.resolve}</p>
          {p.href && <a className="p-link mono" href={p.href} target="_blank" rel="noopener noreferrer">Ver código ↗</a>}
        </aside>

        <div className="md-stage">
          {p.interativo ? (
            <AriaDemo />
          ) : (
            <div className="md-art" style={{ background: p.cor }}>
              <ScaledArt w={p.design.w} h={p.design.h} wide={p.design.w > p.design.h}>
                <Arte id={p.id} />
              </ScaledArt>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
