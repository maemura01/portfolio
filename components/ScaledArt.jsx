'use client';

import { useEffect, useRef, useState } from 'react';

/**
 * Renderiza uma demo no tamanho em que foi desenhada (w × h) e a escala para
 * caber na largura do contêiner. Assim o cartão mostra a demo inteira, nítida.
 */
export default function ScaledArt({ w, h, wide = false, children }) {
  const box = useRef(null);
  const [escala, setEscala] = useState(0.8);

  useEffect(() => {
    const el = box.current;
    if (!el) return;
    const ro = new ResizeObserver(() => setEscala(el.clientWidth / w));
    ro.observe(el);
    setEscala(el.clientWidth / w);
    return () => ro.disconnect();
  }, [w]);

  return (
    <div ref={box} className="scaled" style={{ height: h * escala }}>
      <div
        className={`scaled-in${wide ? ' wide' : ''}`}
        style={{ width: w, height: h, transform: `scale(${escala})` }}
      >
        {children}
      </div>
    </div>
  );
}
