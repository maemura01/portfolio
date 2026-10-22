'use client';

import { useRef } from 'react';
import { gsap } from 'gsap';
import { useLoop } from './useLoop';

// Senha e leituras fictícias. A cifra é só ilustração, não é um valor real.
const SENHA = 'Mudar@2026';
const CIFRA = '04a7f3e9 1c5bd208 77e2a91f';
const HEX = '0123456789abcdef';
const MASC = '•'.repeat(SENHA.length);

const AUDITORIA = [
  { quem: 'ana.souza', hora: '14:02:11' },
  { quem: 'bruno.alves', hora: '14:09:47' },
];

export default function CredMock() {
  const root = useRef(null);

  useLoop(
    root,
    (tl, el) => {
      const q = (s) => el.querySelector(s);
      const palco = q('.cd-stage');
      const campo = q('[data-campo]');
      const etapa = q('[data-etapa]');
      const dado = q('[data-banco]');
      const cadeado = q('.cd-lock');
      const aud = el.querySelectorAll('.cd-aud');
      const pacote = q('.cd-packet');
      const c = { t: 0, s: 0 };

      tl.set(palco, { autoAlpha: 1 }, 0)
        .set([dado, cadeado], { autoAlpha: 0 }, 0)
        .set(aud, { autoAlpha: 0, y: 6 }, 0)
        .set(pacote, { autoAlpha: 0, left: '30%' }, 0)
        .set(campo, { textContent: '' }, 0)
        .set(etapa, { textContent: 'digitando…' }, 0)
        // 1) o cliente digita a senha no navegador
        .to(c, { t: 1, duration: 1.5, ease: 'none', onUpdate: () => (campo.textContent = SENHA.slice(0, Math.round(c.t * SENHA.length))) }, 0.3)
        // 2) ela é cifrada ali mesmo, antes de sair do aparelho
        .set(etapa, { textContent: 'cifrando no aparelho (ECIES)…' }, 2.0)
        .to(c, {
          s: 1,
          duration: 1.0,
          ease: 'none',
          onUpdate: () => {
            const fixos = Math.floor(c.s * CIFRA.length);
            let out = '';
            for (let i = 0; i < CIFRA.length; i++) {
              if (CIFRA[i] === ' ') out += ' ';
              else out += i < fixos ? CIFRA[i] : HEX[Math.floor(Math.random() * 16)];
            }
            campo.textContent = out;
          },
        }, 2.0)
        .set(etapa, { textContent: 'só o texto cifrado sai do navegador' }, 3.1)
        // 3) o pacote cifrado viaja até o banco
        .to(pacote, { autoAlpha: 1, duration: 0.15 }, 3.1)
        .to(pacote, { left: '62%', duration: 0.8, ease: 'power2.inOut' }, 3.15)
        .to(pacote, { autoAlpha: 0, duration: 0.15 }, 3.95)
        // 4) o banco guarda apenas a cifra
        .to([dado, cadeado], { autoAlpha: 1, duration: 0.3 }, 3.95)
        // 5) cada leitura fica registrada com nome e horário
        .to(aud, { autoAlpha: 1, y: 0, duration: 0.35, stagger: 0.5 }, 4.6)
        .to(palco, { autoAlpha: 0, duration: 0.4 }, 7.4)
        .to({}, { duration: 0.3 });
    },
    (el) => {
      el.querySelector('[data-campo]').textContent = CIFRA;
      el.querySelector('[data-etapa]').textContent = 'só o texto cifrado sai do navegador';
    }
  );

  return (
    <div ref={root} className="tile-art cd-art" aria-label="Demonstração animada de uma senha sendo cifrada no navegador e guardada só como texto cifrado, com dados fictícios">
      <div className="cd-stage">
        <div className="cd-pane">
          <small>1 · Navegador do cliente</small>
          <div className="cd-field"><code data-campo>{MASC}</code><i className="cd-caret" /></div>
          <p className="cd-step" data-etapa>só o texto cifrado sai do navegador</p>
        </div>

        <i className="cd-packet" aria-hidden="true" />

        <div className="cd-pane">
          <small>2 · Banco de dados</small>
          <div className="cd-db">
            <p><span>usuario</span> cliente_0482</p>
            <p data-banco><span>senha</span> {CIFRA}</p>
          </div>
          <p className="cd-lock">🔒 nenhuma senha em texto puro</p>
        </div>

        <div className="cd-pane">
          <small>3 · Auditoria de leitura</small>
          {AUDITORIA.map((a) => (
            <p className="cd-aud" key={a.quem}><b>{a.quem}</b> abriu · {a.hora}</p>
          ))}
          <p className="cd-note">Dados fictícios</p>
        </div>
      </div>
    </div>
  );
}
