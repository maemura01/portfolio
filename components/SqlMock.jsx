'use client';

import { useRef } from 'react';
import { gsap } from 'gsap';
import { useLoop } from './useLoop';

// Consulta ilustrativa: tabelas e números inventados.
const SQL = [
  'WITH funil AS (',
  '  SELECT origem,',
  '         COUNT(*) AS leads,',
  '         COUNT(*) FILTER (WHERE etapa >= 3) AS reunioes',
  '  FROM leads',
  "  WHERE criado_em >= date_trunc('month', now())",
  '  GROUP BY origem',
  ')',
  'SELECT origem, leads,',
  '       ROUND(100.0 * reunioes / leads, 1) AS taxa,',
  '       RANK() OVER (ORDER BY reunioes DESC) AS pos',
  'FROM funil;',
];

const KW = /\b(WITH|AS|SELECT|COUNT|FILTER|WHERE|FROM|GROUP BY|ROUND|RANK|OVER|ORDER BY|DESC)\b/g;
const realca = (linha) => linha.replace(/</g, '&lt;').replace(KW, '<em>$1</em>');

const RESULTADO = [
  { origem: 'Meta', leads: '14.210', taxa: '31,4%', pos: 1 },
  { origem: 'Google', leads: '9.870', taxa: '28,9%', pos: 2 },
  { origem: 'TikTok', leads: '6.020', taxa: '19,3%', pos: 3 },
];

const FUNIL = [
  { rotulo: 'Leads', alvo: 30100, w: 100 },
  { rotulo: 'Qualificados', alvo: 14050, w: 47 },
  { rotulo: 'Reuniões', alvo: 8420, w: 28 },
  { rotulo: 'Vendas', alvo: 2310, w: 8 },
];

const fmt = (n) => Math.round(n).toLocaleString('pt-BR');

export default function SqlMock() {
  const root = useRef(null);

  useLoop(
    root,
    (tl, el) => {
      const q = (s) => el.querySelectorAll(s);
      const palco = el.querySelector('.sq-stage');
      const linhas = q('.sq-line');
      const rows = q('.sq-row');
      const barras = q('.sq-bar i');
      const vals = q('.sq-fv');
      const c = { p: 0 };

      tl.set(palco, { autoAlpha: 1 }, 0)
        .fromTo(linhas, { clipPath: 'inset(0 100% 0 0)' }, { clipPath: 'inset(0 0% 0 0)', duration: 0.4, ease: 'steps(16)', stagger: 0.28 }, 0.2)
        .fromTo(rows, { autoAlpha: 0, y: 8 }, { autoAlpha: 1, y: 0, duration: 0.35, stagger: 0.14 }, 3.9)
        .fromTo(barras, { scaleX: 0 }, { scaleX: 1, duration: 0.8, ease: 'power3.out', stagger: 0.12, transformOrigin: 'left center' }, 4.4)
        .fromTo(c, { p: 0 }, { p: 1, duration: 1.2, ease: 'power2.out', onUpdate: () => vals.forEach((v, i) => (v.textContent = fmt(FUNIL[i].alvo * c.p))) }, 4.4)
        .to(palco, { autoAlpha: 0, duration: 0.4 }, 8.2)
        .to({}, { duration: 0.3 });
    },
    (el) => {
      el.querySelectorAll('.sq-line').forEach((l) => (l.style.clipPath = 'none'));
    }
  );

  return (
    <div ref={root} className="tile-art sq-art" aria-label="Demonstração animada de uma consulta SQL e do funil de leads, com dados fictícios">
      <div className="sq-stage">
        <pre className="sq-code" aria-hidden="true">
          {SQL.map((l, i) => (
            <span className="sq-line" key={i} dangerouslySetInnerHTML={{ __html: realca(l) || '&nbsp;' }} />
          ))}
        </pre>

        <div className="sq-res">
          {RESULTADO.map((r) => (
            <div className="sq-row" key={r.origem}>
              <span>{r.origem}</span>
              <span>{r.leads}</span>
              <span>{r.taxa}</span>
              <span>#{r.pos}</span>
            </div>
          ))}
        </div>

        <div className="sq-funil">
          {FUNIL.map((f) => (
            <div className="sq-f" key={f.rotulo}>
              <div className="sq-fl"><span>{f.rotulo}</span><b className="sq-fv">{fmt(f.alvo)}</b></div>
              <div className="sq-bar"><i style={{ width: `${f.w}%` }} /></div>
            </div>
          ))}
        </div>
        <p className="sq-note">Dados fictícios</p>
      </div>
    </div>
  );
}
