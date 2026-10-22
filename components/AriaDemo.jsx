'use client';

import { useCallback, useEffect, useRef, useState } from 'react';
import { flushSync } from 'react-dom';
import { gsap } from 'gsap';
import { Draggable } from 'gsap/Draggable';

gsap.registerPlugin(Draggable);

// Tudo fictício. Regra do produto: individuais pela manhã, coletivas à tarde.
const DIAS = ['Seg', 'Ter', 'Qua', 'Qui', 'Sex'];
const HORAS = ['09:00', '10:00', '11:00', '14:00', '15:00', '16:00'];
const MANHA = 3; // linhas 0..2 = manhã
const NOMES = ['Helena P.', 'Rafael N.', 'Beatriz L.', 'Tiago M.', 'Camila D.', 'Lucas F.', 'Marcela R.', 'Otávio S.'];
const EMPRESAS = ['Mercado Aurora', 'Studio Brisa', 'Clínica Horizonte', 'Oficina do Vale', 'Café Lumen', 'Escola Norte', 'Loja Atlântica', 'Padaria Estrela', 'Ótica Prisma'];
const ORIGENS = ['Meta', 'Google', 'TikTok'];
const DICA = 'Arraste uma reunião para outro horário ou clique nela para abrir o card do cliente.';

const INICIAL = [
  { id: 'a1', r: 0, c: 0, tipo: 'ind', nome: 'Ana L.', sub: 'Individual' },
  { id: 'a2', r: 0, c: 3, tipo: 'ind', nome: 'Bruno S.', sub: 'Individual' },
  { id: 'a3', r: 1, c: 1, tipo: 'ind', nome: 'Carlos M.', sub: 'Individual' },
  { id: 'a4', r: 1, c: 4, tipo: 'ind', nome: 'Paulo R.', sub: 'Individual' },
  { id: 'a5', r: 2, c: 2, tipo: 'ind', nome: 'Marina T.', sub: 'Individual' },
  { id: 'c1', r: 3, c: 0, tipo: 'col', nome: 'Coletiva', sub: '5 parceiros' },
  { id: 'c2', r: 3, c: 3, tipo: 'col', nome: 'Coletiva', sub: '5 parceiros' },
  { id: 'c3', r: 4, c: 2, tipo: 'col', nome: 'Coletiva', sub: '4 parceiros' },
  { id: 'c4', r: 5, c: 1, tipo: 'col', nome: 'Coletiva', sub: '3 parceiros' },
];

const COR = ['#1e80ec', '#2fa84f', '#16294a'];

const hash = (txt) => [...txt].reduce((a, ch) => (a * 31 + ch.charCodeAt(0)) >>> 0, 7);
const semAcento = (t) => t.normalize('NFD').replace(/[̀-ͯ]/g, '').toLowerCase().replace(/[^a-z]+/g, '.').replace(/^\.|\.$/g, '');

// Dados do cliente gerados a partir do id: sempre os mesmos, sempre inventados.
function dadosDoCliente(c) {
  const h = hash(c.id + c.nome);
  const coletiva = c.tipo === 'col';
  return {
    empresa: coletiva ? 'Reunião com parceiros' : EMPRESAS[h % EMPRESAS.length],
    telefone: coletiva ? '—' : `(11) 99999-${String(1000 + (h % 9000))}`,
    email: coletiva ? 'contato@exemplo.com.br' : `${semAcento(c.nome)}@exemplo.com.br`,
    origem: ORIGENS[h % ORIGENS.length],
    score: (7.4 + (h % 20) / 10).toFixed(1).replace('.', ','),
    link: `meet.exemplo.com/${h.toString(36).slice(0, 3)}-${(h * 7).toString(36).slice(0, 4)}-${(h * 13).toString(36).slice(0, 3)}`,
  };
}

export default function AriaDemo() {
  const [chips, setChips] = useState(INICIAL);
  const [bloqueios, setBloqueios] = useState(0);
  const [aviso, setAviso] = useState({ txt: DICA, tom: 'dica' });
  const [sel, setSel] = useState(null);
  const [status, setStatus] = useState({}); // id -> 'ok' | 'no'
  const [notas, setNotas] = useState({}); // id -> texto
  const grade = useRef(null);
  const gaveta = useRef(null);
  const ref = useRef(chips);
  const novo = useRef(null);
  const timer = useRef(null);
  ref.current = chips;

  const avisar = useCallback((txt, tom = 'ok') => {
    setAviso({ txt, tom });
    clearTimeout(timer.current);
    timer.current = setTimeout(() => setAviso({ txt: DICA, tom: 'dica' }), 3600);
  }, []);

  // Arrastar e soltar com validação da regra; clique abre o card.
  useEffect(() => {
    const g = grade.current;
    if (!g) return;
    const els = g.querySelectorAll('.ad-chip');
    const instancias = Draggable.create(els, {
      type: 'x,y',
      bounds: g,
      zIndexBoost: true,
      onPress() { gsap.to(this.target, { scale: 1.05, duration: 0.15 }); },
      onRelease() { gsap.to(this.target, { scale: 1, duration: 0.2 }); },
      onClick() { setSel(this.target.dataset.id); },
      onDragEnd() {
        const el = this.target;
        const id = el.dataset.id;
        const cx = g.getBoundingClientRect();
        const cw = cx.width / 5;
        const ch = cx.height / 6;
        const r = el.getBoundingClientRect();
        const col = Math.min(4, Math.max(0, Math.floor((r.left + r.width / 2 - cx.left) / cw)));
        const lin = Math.min(5, Math.max(0, Math.floor((r.top + r.height / 2 - cx.top) / ch)));
        const atual = ref.current.find((x) => x.id === id);
        const voltar = (msg) => {
          if (msg) { setBloqueios((n) => n + 1); avisar(msg, 'erro'); }
          gsap.to(el, { x: 0, y: 0, duration: 0.4, ease: 'back.out(2)', onUpdate: () => this.update() });
        };

        if (col === atual.c && lin === atual.r) return voltar();
        if (ref.current.some((x) => x.id !== id && x.r === lin && x.c === col)) return voltar('Esse horário já está ocupado.');
        if (atual.tipo === 'ind' && lin >= MANHA) return voltar('Reuniões individuais só acontecem de manhã.');
        if (atual.tipo === 'col' && lin < MANHA) return voltar('Reuniões coletivas só acontecem à tarde.');

        // encaixa na célula e persiste a nova posição
        const alvoX = cx.left + col * cw + (cw - r.width) / 2;
        const alvoY = cx.top + lin * ch + (ch - r.height) / 2;
        gsap.to(el, {
          x: `+=${alvoX - r.left}`,
          y: `+=${alvoY - r.top}`,
          duration: 0.18,
          ease: 'power2.out',
          onComplete: () => {
            flushSync(() => setChips((cs) => cs.map((x) => (x.id === id ? { ...x, r: lin, c: col } : x))));
            gsap.set(el, { x: 0, y: 0 });
            this.update();
            avisar(`${atual.nome} movida para ${DIAS[col]}, ${HORAS[lin]}.`, 'ok');
          },
        });
      },
    });
    return () => instancias.forEach((i) => i.kill());
  }, [chips.length, avisar]);

  // Entrada do cartão recém-agendado.
  useEffect(() => {
    if (!novo.current) return;
    const el = grade.current?.querySelector(`[data-id="${novo.current}"]`);
    novo.current = null;
    if (el) gsap.fromTo(el, { scale: 0, autoAlpha: 0 }, { scale: 1, autoAlpha: 1, duration: 0.5, ease: 'back.out(2)' });
  }, [chips]);

  // Card do cliente: entra deslizando; Esc fecha o card antes de fechar a demo.
  useEffect(() => {
    if (!sel || !gaveta.current) return;
    if (!window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
      gsap.fromTo(gaveta.current, { xPercent: 12, autoAlpha: 0 }, { xPercent: 0, autoAlpha: 1, duration: 0.35, ease: 'power3.out' });
    }
    const tecla = (e) => {
      if (e.key === 'Escape') { e.stopImmediatePropagation(); setSel(null); }
    };
    window.addEventListener('keydown', tecla, true);
    return () => window.removeEventListener('keydown', tecla, true);
  }, [sel]);

  const agendar = () => {
    const tipo = chips.filter((c) => c.tipo === 'ind').length <= chips.filter((c) => c.tipo === 'col').length ? 'ind' : 'col';
    const linhas = tipo === 'ind' ? [0, 1, 2] : [3, 4, 5];
    let alvo = null;
    for (const r of linhas) {
      for (let c = 0; c < 5 && !alvo; c++) if (!chips.some((x) => x.r === r && x.c === c)) alvo = { r, c };
      if (alvo) break;
    }
    if (!alvo) return avisar(`A agenda ${tipo === 'ind' ? 'da manhã' : 'da tarde'} está cheia.`, 'erro');
    const id = `n${Date.now()}`;
    const nome = tipo === 'ind' ? NOMES[Math.floor(Math.random() * NOMES.length)] : 'Coletiva';
    novo.current = id;
    setChips((cs) => [...cs, { id, ...alvo, tipo, nome, sub: tipo === 'ind' ? 'Individual' : '5 parceiros' }]);
    const score = (7.2 + Math.random() * 2.3).toFixed(1).replace('.', ',');
    avisar(`Aria agendou ${nome} · ${DIAS[alvo.c]}, ${HORAS[alvo.r]} · score ${score}. Clique para abrir o card.`, 'ia');
  };

  const reiniciar = () => {
    flushSync(() => { setChips(INICIAL); setBloqueios(0); setStatus({}); setNotas({}); setSel(null); });
    avisar('Agenda reiniciada.', 'dica');
  };

  const ind = chips.filter((c) => c.tipo === 'ind').length;
  const col = chips.length - ind;
  const compareceram = Object.entries(status).filter(([id, v]) => v === 'ok' && chips.some((c) => c.id === id)).length;
  const aberto = chips.find((c) => c.id === sel);
  const info = aberto ? dadosDoCliente(aberto) : null;

  return (
    <div className="ad">
      <div className="ad-top">
        <div className="ad-avatar">A</div>
        <div className="ad-who"><b>Aria</b><span><i className="dot" /> IA ativa</span></div>
        <div className="ad-actions">
          <button type="button" className="btn btn-amber" onClick={agendar}>Aria agenda uma reunião</button>
          <button type="button" className="btn btn-ghost" onClick={reiniciar}>Reiniciar</button>
        </div>
      </div>

      <div className="ad-kpis">
        <div><b>{chips.length}</b><span>Reuniões</span></div>
        <div><b>{ind}</b><span>Individuais</span></div>
        <div><b>{col}</b><span>Coletivas</span></div>
        <div><b>{compareceram}</b><span>Compareceram</span></div>
        <div><b>{bloqueios}</b><span>Conflitos evitados</span></div>
      </div>

      <div className="ad-cal">
        <div className="ad-hours">
          <div className="ad-h0" />
          {HORAS.map((h) => <div key={h}>{h}</div>)}
        </div>
        <div className="ad-body">
          <div className="ad-days">{DIAS.map((d) => <div key={d}>{d}</div>)}</div>
          <div className="ad-grid" ref={grade}>
            <div className="ad-zone am"><span>Manhã · individuais</span></div>
            <div className="ad-zone pm"><span>Tarde · coletivas</span></div>
            {chips.map((c) => (
              <div
                key={c.id}
                data-id={c.id}
                className={`ad-chip ${c.tipo}${sel === c.id ? ' sel' : ''}`}
                style={{ left: `${c.c * 20}%`, top: `${(c.r * 100) / 6}%`, background: c.tipo === 'col' ? '#ff4d6d' : COR[c.id.charCodeAt(1) % 3] }}
              >
                <b>{c.nome}</b>
                <i>{c.sub}</i>
                {status[c.id] && <span className={`ad-st ${status[c.id]}`}>{status[c.id] === 'ok' ? '✓' : '✕'}</span>}
              </div>
            ))}
          </div>
        </div>
      </div>

      <p className={`ad-aviso ${aviso.tom}`} role="status" aria-live="polite">{aviso.txt}</p>

      {aberto && (
        <aside className="ad-card" ref={gaveta} aria-label={`Card da reunião: ${aberto.nome}`}>
          <div className="adc-head">
            <div>
              <span className="mono">{aberto.tipo === 'ind' ? 'Reunião individual' : 'Reunião coletiva'}</span>
              <h4>{aberto.tipo === 'ind' ? aberto.nome : `Coletiva · ${aberto.sub}`}</h4>
              <p>{DIAS[aberto.c]}, {HORAS[aberto.r]}</p>
            </div>
            <button type="button" className="adc-x" onClick={() => setSel(null)} aria-label="Fechar card">✕</button>
          </div>

          <dl className="adc-dados">
            <div><dt>{aberto.tipo === 'ind' ? 'Empresa' : 'Tipo'}</dt><dd>{info.empresa}</dd></div>
            <div><dt>Telefone</dt><dd>{info.telefone}</dd></div>
            <div><dt>E-mail</dt><dd>{info.email}</dd></div>
            <div><dt>Origem do lead</dt><dd>{info.origem}</dd></div>
            <div><dt>Score da IA</dt><dd>{info.score}</dd></div>
          </dl>

          <div className="adc-bloco">
            <span className="mono">Link da reunião (gerado pela IA)</span>
            <div className="adc-link">
              <code>{info.link}</code>
              <button type="button" className="btn btn-amber" onClick={() => avisar('Em produção, aqui abriria a videochamada gerada pela IA.', 'ia')}>Entrar ↗</button>
            </div>
          </div>

          <div className="adc-bloco">
            <span className="mono">Comparecimento</span>
            <div className="adc-seg" role="group" aria-label="Comparecimento">
              {[['ag', 'Aguardando'], ['ok', 'Compareceu'], ['no', 'Não compareceu']].map(([v, rot]) => (
                <button
                  type="button"
                  key={v}
                  className={(status[aberto.id] || 'ag') === v ? `on ${v}` : ''}
                  onClick={() => setStatus((s) => {
                    const n = { ...s };
                    if (v === 'ag') delete n[aberto.id]; else n[aberto.id] = v;
                    return n;
                  })}
                >
                  {rot}
                </button>
              ))}
            </div>
          </div>

          <div className="adc-bloco">
            <label className="mono" htmlFor="adc-nota">Anotações</label>
            <textarea
              id="adc-nota"
              rows={4}
              placeholder="Ex.: pediu proposta com 3 opções de plano; retorno na sexta."
              value={notas[aberto.id] || ''}
              onChange={(e) => setNotas((n) => ({ ...n, [aberto.id]: e.target.value }))}
            />
          </div>
        </aside>
      )}
    </div>
  );
}
