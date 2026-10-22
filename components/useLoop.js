'use client';

import { useEffect } from 'react';
import { gsap } from 'gsap';
import { movimentoLigado } from './motion';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

/**
 * Loop de animação de um tile: roda só enquanto ele está na tela.
 * Com prefers-reduced-motion, chama `final` e fica parado no estado final.
 */
export function useLoop(ref, build, final) {
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const mm = gsap.matchMedia();

    if (!movimentoLigado()) mm.add('all', () => {
      final?.(el);
    });

    if (movimentoLigado()) mm.add('all', () => {
      const tl = gsap.timeline({ repeat: -1, paused: true });
      build(tl, el);
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
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);
}
