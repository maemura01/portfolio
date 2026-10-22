'use client';

import { useEffect, useRef } from 'react';
import { gsap } from 'gsap';
import { movimentoLigado } from './motion';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { SplitText } from 'gsap/SplitText';
import Lenis from 'lenis';

gsap.registerPlugin(ScrollTrigger, SplitText);

/**
 * Camada de movimento da página inteira: rolagem suave, revelação de textos,
 * parallax, faixa reativa à rolagem, brilho de fundo e botões magnéticos.
 * Tudo só roda com movimento permitido; sem isso a página fica estática.
 */
export default function MotionLayer() {
  const brilho = useRef(null);

  useEffect(() => {
    const mm = gsap.matchMedia();

    if (movimentoLigado()) mm.add('all', () => {
      const limpar = [];

      // ---------- Rolagem suave, sincronizada com o ScrollTrigger ----------
      const lenis = new Lenis({ lerp: 0.1, wheelMultiplier: 0.95 });
      lenis.on('scroll', ScrollTrigger.update);
      const passo = (t) => lenis.raf(t * 1000);
      gsap.ticker.add(passo);
      gsap.ticker.lagSmoothing(0);
      limpar.push(() => { gsap.ticker.remove(passo); lenis.destroy(); });

      // âncoras do menu deslizam em vez de pular
      const aoClicar = (e) => {
        const a = e.target.closest?.('a[href^="#"]');
        if (!a) return;
        const id = a.getAttribute('href');
        if (id === '#') { e.preventDefault(); lenis.scrollTo(0, { duration: 1.4 }); return; }
        const alvo = document.querySelector(id);
        if (alvo) { e.preventDefault(); lenis.scrollTo(alvo, { duration: 1.4 }); }
      };
      document.addEventListener('click', aoClicar);
      limpar.push(() => document.removeEventListener('click', aoClicar));

      // ---------- Faixa de tecnologias: reage à velocidade da rolagem ----------
      const faixa = gsap.to('.marquee-track', { xPercent: -50, duration: 34, ease: 'none', repeat: -1 });
      // Pipeline da stack: gira sem parar, acelera com a rolagem e pausa com o mouse em cima.
      const giro = gsap.to('.pipe-track', { xPercent: -50, duration: 48, ease: 'none', repeat: -1 });
      let pausa = false;
      let pf = 1;
      const vista = document.querySelector('.pipe-view');
      const parar = () => { pausa = true; };
      const seguir = () => { pausa = false; };
      vista?.addEventListener('pointerenter', parar);
      vista?.addEventListener('pointerleave', seguir);
      limpar.push(() => { vista?.removeEventListener('pointerenter', parar); vista?.removeEventListener('pointerleave', seguir); });

      let yAnt = window.scrollY;
      let dir = 1;
      let ts = 1;
      const veloc = (_t, delta) => {
        const y = window.scrollY;
        const v = (y - yAnt) / ((delta || 16) / 1000);
        yAnt = y;
        if (Math.abs(v) > 8) dir = v > 0 ? 1 : -1;
        const alvo = dir * (1 + Math.min(Math.abs(v) / 280, 7));
        ts += (alvo - ts) * 0.08;
        faixa.timeScale(ts);
        pf += ((pausa ? 0 : 1) - pf) * 0.1;
        giro.timeScale(ts * 0.7 * pf);
        gsap.set('.marquee-track', { skewX: gsap.utils.clamp(-7, 7, -v / 260) });
      };
      gsap.ticker.add(veloc);
      limpar.push(() => gsap.ticker.remove(veloc));

      // ---------- Revelação de títulos linha a linha e texto que acende ----------
      const dividir = () => {
        gsap.utils.toArray('.pipe-h h2, .sobre-h h2').forEach((el) => {
          SplitText.create(el, {
            type: 'lines',
            mask: 'lines',
            autoSplit: true,
            onSplit: (self) =>
              gsap.from(self.lines, {
                yPercent: 110,
                duration: 0.95,
                ease: 'power3.out',
                stagger: 0.1,
                scrollTrigger: { trigger: el, start: 'top 88%', once: true },
              }),
          });
        });
        // o texto do Sobre mim vai acendendo palavra por palavra enquanto se lê
        gsap.utils.toArray('.sobre-text > p').forEach((p) => {
          SplitText.create(p, {
            type: 'words',
            autoSplit: true,
            onSplit: (self) =>
              gsap.fromTo(
                self.words,
                { opacity: 0.2 },
                {
                  opacity: 1,
                  ease: 'none',
                  stagger: 0.06,
                  scrollTrigger: { trigger: p, start: 'top 82%', end: 'bottom 58%', scrub: true },
                }
              ),
          });
        });
      };
      document.fonts.ready.then(dividir);

      // ---------- Parallax ----------
      gsap.to('.hero-h', { yPercent: -14, ease: 'none', scrollTrigger: { trigger: '.hero', start: 'top top', end: 'bottom top', scrub: true } });
      gsap.to('.hero-side', { y: -40, ease: 'none', scrollTrigger: { trigger: '.hero', start: 'top top', end: 'bottom top', scrub: true } });
      gsap.fromTo('.foto', { clipPath: 'inset(100% 0 0 0)' }, { clipPath: 'inset(0% 0 0 0)', duration: 1.1, ease: 'power3.inOut', scrollTrigger: { trigger: '.foto', start: 'top 88%', once: true } });
      gsap.fromTo('.foto img', { yPercent: -7, scale: 1.14 }, { yPercent: 7, scale: 1.14, ease: 'none', scrollTrigger: { trigger: '.foto', start: 'top bottom', end: 'bottom top', scrub: true } });

      // ---------- Só com mouse: brilho de fundo e botões magnéticos ----------
      if (window.matchMedia('(hover: hover) and (pointer: fine)').matches) {
        const b = brilho.current;
        gsap.set(b, { xPercent: -50, yPercent: -50, autoAlpha: 0 });
        const bx = gsap.quickTo(b, 'x', { duration: 1.4, ease: 'power3.out' });
        const by = gsap.quickTo(b, 'y', { duration: 1.4, ease: 'power3.out' });

        let visivel = false;
        const mover = (e) => {
          if (!visivel) { visivel = true; gsap.to(b, { autoAlpha: 1, duration: 0.4 }); }
          bx(e.clientX); by(e.clientY);
        };
        const saiu = () => { visivel = false; gsap.to(b, { autoAlpha: 0, duration: 0.3 }); };
        window.addEventListener('pointermove', mover);
        document.documentElement.addEventListener('pointerleave', saiu);
        limpar.push(() => {
          window.removeEventListener('pointermove', mover);
          document.documentElement.removeEventListener('pointerleave', saiu);
        });

        // botões que "puxam" o cursor
        gsap.utils.toArray('.nav .btn, .hero-btns .btn, .car-btn').forEach((el) => {
          const qx = gsap.quickTo(el, 'x', { duration: 0.4, ease: 'power3.out' });
          const qy = gsap.quickTo(el, 'y', { duration: 0.4, ease: 'power3.out' });
          const mv = (e) => {
            const r = el.getBoundingClientRect();
            qx((e.clientX - (r.left + r.width / 2)) * 0.28);
            qy((e.clientY - (r.top + r.height / 2)) * 0.38);
          };
          const sai = () => { qx(0); qy(0); };
          el.addEventListener('pointermove', mv);
          el.addEventListener('pointerleave', sai);
          limpar.push(() => { el.removeEventListener('pointermove', mv); el.removeEventListener('pointerleave', sai); });
        });
      }

      // os gatilhos foram criados em ordem diferente da do layout: recalcula
      const t = setTimeout(() => ScrollTrigger.refresh(), 600);
      limpar.push(() => clearTimeout(t));

      return () => limpar.forEach((f) => f());
    });

    return () => mm.revert();
  }, []);

  return (
    <>
      <div className="glow" ref={brilho} aria-hidden="true" />
    </>
  );
}
