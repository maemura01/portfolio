/**
 * Preferência de movimento do visitante.
 * O portfólio existe para mostrar movimento, então as animações começam LIGADAS
 * mesmo que o sistema peça menos movimento. Quem prefere pode reduzir no próprio
 * site (aviso e botão do rodapé) e a escolha fica salva.
 */
const CHAVE = 'movimento';

export function sistemaPedeMenos() {
  if (typeof window === 'undefined') return false;
  return window.matchMedia('(prefers-reduced-motion: reduce)').matches;
}

export function escolhaSalva() {
  try {
    const v = window.localStorage.getItem(CHAVE);
    return v === 'on' || v === 'off' ? v : null;
  } catch {
    return null;
  }
}

export function movimentoLigado() {
  if (typeof window === 'undefined') return false;
  return escolhaSalva() !== 'off';
}

export function salvarEscolha(ligado) {
  try {
    window.localStorage.setItem(CHAVE, ligado ? 'on' : 'off');
  } catch {
    /* sem armazenamento: a escolha vale só até recarregar */
  }
}

export function definirMovimento(ligado) {
  salvarEscolha(ligado);
  window.location.reload();
}
