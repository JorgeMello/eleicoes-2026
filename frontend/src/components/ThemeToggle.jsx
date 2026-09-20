import { useEffect, useState } from 'react';

const CHAVE = 'eleicoes2026-tema';

function temaInicial() {
  try {
    const salvo = localStorage.getItem(CHAVE);
    if (salvo === 'claro' || salvo === 'escuro') return salvo;
    if (window.matchMedia('(prefers-color-scheme: dark)').matches) return 'escuro';
  } catch {
    /* storage indisponível: cai para claro */
  }
  return 'claro';
}

export default function ThemeToggle() {
  const [tema, setTema] = useState(temaInicial);
  const escuro = tema === 'escuro';

  useEffect(() => {
    document.documentElement.classList.toggle('dark', escuro);
    try {
      localStorage.setItem(CHAVE, tema);
    } catch {
      /* ignora */
    }
  }, [tema, escuro]);

  return (
    <button
      type="button"
      onClick={() => setTema(escuro ? 'claro' : 'escuro')}
      title={escuro ? 'Mudar para tema claro' : 'Mudar para tema escuro'}
      aria-label={escuro ? 'Mudar para tema claro' : 'Mudar para tema escuro'}
      className="rounded-lg px-2.5 py-1.5 text-lg leading-none hover:bg-white/10"
    >
      <span aria-hidden="true">{escuro ? '☀️' : '🌙'}</span>
    </button>
  );
}
