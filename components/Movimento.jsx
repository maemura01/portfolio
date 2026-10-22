'use client';

import { useEffect, useState } from 'react';
import { definirMovimento, escolhaSalva, movimentoLigado, salvarEscolha, sistemaPedeMenos } from './motion';

/** Botão do rodapé: liga ou desliga as animações. */
export function MovimentoBotao() {
  const [ligado, setLigado] = useState(true);
  useEffect(() => setLigado(movimentoLigado()), []);
  return (
    <button type="button" className="mov-btn mono" onClick={() => definirMovimento(!ligado)} aria-pressed={ligado}>
      Animações: {ligado ? 'ligadas' : 'desligadas'}
    </button>
  );
}

/** Aviso para quem tem o sistema pedindo menos movimento: a página anima, com saída fácil. */
export function MovimentoAviso() {
  const [visivel, setVisivel] = useState(false);
  useEffect(() => setVisivel(sistemaPedeMenos() && !escolhaSalva()), []);
  if (!visivel) return null;

  const manter = () => {
    salvarEscolha(true);
    setVisivel(false);
  };

  return (
    <div className="mov-aviso" role="status">
      <p>Esta página usa animações. O seu sistema pede menos movimento, então se preferir é só reduzir.</p>
      <div className="mov-acoes">
        <button type="button" className="btn btn-ghost" onClick={() => definirMovimento(false)}>Reduzir animações</button>
        <button type="button" className="btn btn-amber" onClick={manter}>Manter</button>
      </div>
    </div>
  );
}
