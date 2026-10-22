'use client';

import { useRef } from 'react';
import { gsap } from 'gsap';
import { useLoop } from './useLoop';

// Tudo fictício: ids, nomes e status inventados.
const LOG = [
  '$ python main.py all',
  'login ok · sessão reaproveitada',
  "lista 'Todas as propostas' · 100 por página",
  'página 1/120',
  'abrindo proposta #48213 …',
  'contato ok · upsert 48213',
  'abrindo proposta #48214 …',
  'contato ok · upsert 48214',
  'abrindo proposta #48215 …',
  'contato ok · upsert 48215',
  'checkpoint salvo ✓',
];

const LINHAS = [
  { id: '48213', nome: 'Marina Albuquerque', st: 'Aprovada', tom: 'ok' },
  { id: '48214', nome: 'Rogério Tavares', st: 'Em análise', tom: 'wait' },
  { id: '48215', nome: 'Patrícia Moreira', st: 'Aprovada', tom: 'ok' },
  { id: '48216', nome: 'Elias Vasconcelos', st: 'Recusada', tom: 'no' },
  { id: '48217', nome: 'Joana Furtado', st: 'Em análise', tom: 'wait' },
  { id: '48218', nome: 'Caio Brandão', st: 'Aprovada', tom: 'ok' },
];

export default function CrmMock() {
  const root = useRef(null);

  useLoop(
    root,
    (tl, el) => {
      const q = (s) => el.querySelectorAll(s);
      const palco = el.querySelector('.cr-stage');
      const logs = q('.cr-log');
      const rows = q('.cr-row');
      const prog = el.querySelector('.cr-prog i');
      const cont = el.querySelector('[data-cont]');
      const c = { n: 0 };

      tl.set(palco, { autoAlpha: 1 }, 0)
        .fromTo(logs, { autoAlpha: 0, y: 6 }, { autoAlpha: 1, y: 0, duration: 0.25, stagger: 0.42 }, 0.2)
        .fromTo(rows, { autoAlpha: 0, x: 14 }, { autoAlpha: 1, x: 0, duration: 0.35, stagger: 0.62 }, 1.9)
        .fromTo(prog, { width: '0%' }, { width: '100%', duration: 5.2, ease: 'none' }, 0.2)
        .fromTo(c, { n: 0 }, { n: 12480, duration: 5.2, ease: 'power1.inOut', onUpdate: () => (cont.textContent = Math.round(c.n).toLocaleString('pt-BR')) }, 0.2)
        .to(palco, { autoAlpha: 0, duration: 0.4 }, 7.6)
        .to({}, { duration: 0.3 });
    },
    (el) => {
      el.querySelector('[data-cont]').textContent = '12.480';
      el.querySelector('.cr-prog i').style.width = '100%';
    }
  );

  return (
    <div ref={root} className="tile-art cr-art" aria-label="Demonstração animada de um scraper de CRM coletando propostas, com dados fictícios">
      <div className="cr-stage">
        <div className="cr-term">
          <div className="cr-bar"><i /><i /><i /><span>scraper</span></div>
          <div className="cr-logs">
            {LOG.map((l, i) => (
              <p className={`cr-log${l.startsWith('checkpoint') ? ' ok' : ''}`} key={i}>{l}</p>
            ))}
          </div>
        </div>
        <div className="cr-panel">
          <div className="cr-head">
            <div><small>Propostas coletadas</small><b data-cont>12.480</b></div>
            <div className="cr-prog" aria-hidden="true"><i /></div>
          </div>
          <div className="cr-table">
            {LINHAS.map((r) => (
              <div className="cr-row" key={r.id}>
                <span className="cr-id">#{r.id}</span>
                <span className="cr-nome">{r.nome}</span>
                <span className={`cr-pill ${r.tom}`}>{r.st}</span>
              </div>
            ))}
          </div>
          <p className="cr-note">Dados fictícios</p>
        </div>
      </div>
    </div>
  );
}
