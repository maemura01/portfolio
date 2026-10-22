'use client';

import { useEffect, useRef } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { PROJETOS } from './projects';

gsap.registerPlugin(ScrollTrigger);

const n2 = (n) => String(n).padStart(2, '0');

export default function Story() {
  const raiz = useRef(null);

  useEffect(() => {
    const el = raiz.current;
    if (!el) return;
    const mm = gsap.matchMedia();

    // Desktop com movimento: a seção fica fixa e os capítulos trocam conforme a rolagem.
    mm.add('(min-width: 900px) and (prefers-reduced-motion: no-preference)', () => {
      const caps = gsap.utils.toArray('.chap', el);
      const idx = el.querySelector('[data-idx]');
      const pontos = gsap.utils.toArray('.dot-i', el);
      const total = caps.length;

      gsap.set(caps, { autoAlpha: 0 });
      gsap.set(caps[0], { autoAlpha: 1 });

      const tl = gsap.timeline({
        defaults: { ease: 'none' },
        scrollTrigger: {
          trigger: el,
          start: 'top top',
          end: () => `+=${total * window.innerHeight * 0.9}`,
          pin: true,
          scrub: 0.6,
          anticipatePin: 1,
          onUpdate: (self) => {
            const i = Math.min(total - 1, Math.floor(self.progress * total));
            idx.textContent = `${n2(i + 1)} / ${n2(total)}`;
            pontos.forEach((d, k) => d.classList.toggle('on', k === i));
          },
        },
      });

      caps.forEach((c, i) => {
        const t = i; // cada capítulo ocupa 1 unidade da linha do tempo
        const textos = c.querySelectorAll('.chap-text > *');
        const camadas = c.querySelectorAll('.layer');
        const chips = c.querySelectorAll('.chip');
        const linha = c.querySelector('.spine i');

        // 1º capítulo: já está na tela, acende uma vez quando a seção chega.
        if (i === 0) {
          const gatilho = { trigger: el, start: 'top 75%', once: true };
          gsap.from(c.querySelectorAll('.layer, .chip'), { autoAlpha: 0, y: 12, duration: 0.5, stagger: 0.03, scrollTrigger: gatilho });
          gsap.fromTo(linha, { scaleY: 0 }, { scaleY: 1, duration: 0.9, transformOrigin: 'top', scrollTrigger: gatilho });
          return;
        }

        // demais capítulos: o anterior sai, este entra e se acende em sequência
        tl.to(caps[i - 1], { autoAlpha: 0, y: -24, duration: 0.18 }, t - 0.18);
        tl.fromTo(c, { autoAlpha: 0, y: 24 }, { autoAlpha: 1, y: 0, duration: 0.18 }, t - 0.02);
        tl.fromTo(textos, { autoAlpha: 0, y: 18 }, { autoAlpha: 1, y: 0, duration: 0.15, stagger: 0.04 }, t + 0.02);
        tl.fromTo(linha, { scaleY: 0 }, { scaleY: 1, duration: 0.45, transformOrigin: 'top' }, t + 0.05);
        tl.fromTo(camadas, { autoAlpha: 0, x: 16 }, { autoAlpha: 1, x: 0, duration: 0.12, stagger: 0.09 }, t + 0.08);
        tl.fromTo(chips, { scale: 0.7, autoAlpha: 0 }, { scale: 1, autoAlpha: 1, duration: 0.1, stagger: 0.02, ease: 'back.out(2)' }, t + 0.12);
      });
      // segura o último capítulo um pouco antes de soltar o pin
      tl.to({}, { duration: 0.4 });
    });

    return () => mm.revert();
  }, []);

  return (
    <section className="story" id="como" ref={raiz}>
      <div className="story-pin">
        <div className="wrap story-top">
          <span className="mono">Como cada projeto resolve um problema</span>
          <span className="mono" data-idx>{`01 / ${n2(PROJETOS.length)}`}</span>
        </div>

        <div className="wrap story-stage">
          {PROJETOS.map((p, i) => (
            <article className="chap" key={p.id}>
              <div className="chap-text">
                <span className="mono chap-n">{n2(i + 1)} · {p.titulo}</span>
                <h3>{p.resumo}</h3>
                <span className="mono">Problema</span>
                <p>{p.problema}</p>
                <span className="mono">O que resolve</span>
                <p className="res">{p.resolve}</p>
              </div>
              <div className="chap-diagram" aria-label={`Stack de ${p.titulo}`}>
                <div className="spine"><i /></div>
                {p.camadas.map(([nome, itens]) => (
                  <div className="layer" key={nome}>
                    <span className="mono">{nome}</span>
                    <div className="chips">
                      {itens.map((t) => <i className="chip" key={t}>{t}</i>)}
                    </div>
                  </div>
                ))}
              </div>
            </article>
          ))}
        </div>

        <div className="wrap story-dots" aria-hidden="true">
          {PROJETOS.map((p, i) => <i className={`dot-i${i === 0 ? ' on' : ''}`} key={p.id} />)}
        </div>
      </div>
    </section>
  );
}
