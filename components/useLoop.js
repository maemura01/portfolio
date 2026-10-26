'use client';

import { useEffect } from 'react';
import { gsap } from 'gsap';
import { movimentoLigado } from './motion';

/**
 * Toca a timeline só enquanto o elemento está visível e pausa fora da tela.
 * Usa IntersectionObserver (e não ScrollTrigger) porque dentro do modal quem rola
 * é o próprio modal, não a janela: no celular a demo fica abaixo do texto e o
 * ScrollTrigger nunca percebia que ela entrou na tela.
 */
export function tocarNaTela(el, tl) {
  const io = new IntersectionObserver(([e]) => (e.isIntersecting ? tl.play() : tl.pause()));
  io.observe(el);
  return () => io.disconnect();
}

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
      const parar = tocarNaTela(el, tl);
      return () => {
        parar();
        tl.kill();
      };
    });

    return () => mm.revert();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);
}
