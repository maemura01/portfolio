'use client';

import { useEffect, useRef, useState } from 'react';
import { gsap } from 'gsap';
import { movimentoLigado } from './motion';

const ITENS = [
  { id: 'wa', rotulo: 'WhatsApp', valor: '+55 (16) 99194-1178', href: 'https://wa.me/5516991941178', externo: true, dica: 'Resposta mais rápida' },
  { id: 'mail', rotulo: 'E-mail', valor: 'ricmaemura@gmail.com', href: 'mailto:ricmaemura@gmail.com', copiar: 'ricmaemura@gmail.com' },
  { id: 'tel', rotulo: 'Ligar', valor: '+55 (16) 99194-1178', href: 'tel:+5516991941178', copiar: '+55 16 99194-1178' },
  { id: 'in', rotulo: 'LinkedIn', valor: 'in/ricardo-maemura', href: 'https://www.linkedin.com/in/ricardo-maemura', externo: true },
  { id: 'gh', rotulo: 'GitHub', valor: 'maemura01', href: 'https://github.com/maemura01', externo: true },
];

export default function Contato({ onClose }) {
  const painel = useRef(null);
  const [copiado, setCopiado] = useState(null);

  useEffect(() => {
    const reduzido = !movimentoLigado();
    if (!reduzido) {
      gsap.fromTo(painel.current, { autoAlpha: 0, y: -12, clipPath: 'inset(0 0 100% 0)' }, { autoAlpha: 1, y: 0, clipPath: 'inset(0 0 0% 0)', duration: 0.45, ease: 'power3.out' });
      gsap.from('.ct-item', { autoAlpha: 0, x: 14, duration: 0.45, ease: 'power2.out', stagger: 0.06, delay: 0.12 });
    }
    painel.current.querySelector('a')?.focus();
    const tecla = (e) => { if (e.key === 'Escape') onClose(); };
    window.addEventListener('keydown', tecla);
    return () => window.removeEventListener('keydown', tecla);
  }, [onClose]);

  const copiar = async (item) => {
    try {
      await navigator.clipboard.writeText(item.copiar);
      setCopiado(item.id);
      setTimeout(() => setCopiado(null), 1700);
    } catch {
      /* sem permissão de área de transferência: o link continua funcionando */
    }
  };

  return (
    <>
      <div className="ct-fundo" onClick={onClose} aria-hidden="true" />
      <div className="contato" role="dialog" aria-label="Opções de contato" ref={painel}>
        <div className="ct-head">
          <span className="mono">Vamos conversar</span>
          <button type="button" className="ct-x" onClick={onClose} aria-label="Fechar">✕</button>
        </div>
        <ul className="ct-lista">
          {ITENS.map((i) => (
            <li className="ct-item" key={i.id}>
              <a
                className="ct-link"
                href={i.href}
                {...(i.externo ? { target: '_blank', rel: 'noopener noreferrer' } : {})}
                onClick={i.externo ? undefined : onClose}
              >
                <span className="mono ct-rot">{i.rotulo}</span>
                <span className="ct-val">{i.valor}</span>
                {i.dica && <span className="mono ct-dica">{i.dica}</span>}
                <span className="ct-seta" aria-hidden="true">↗</span>
              </a>
              {i.copiar && (
                <button type="button" className="ct-copiar mono" onClick={() => copiar(i)}>
                  {copiado === i.id ? 'Copiado ✓' : 'Copiar'}
                </button>
              )}
            </li>
          ))}
        </ul>
      </div>
    </>
  );
}
