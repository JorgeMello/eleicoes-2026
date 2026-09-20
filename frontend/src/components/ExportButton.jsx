import { useState, useRef, useEffect } from 'react';
import { exportToCsv, exportToJson } from '../lib/exportData.js';

export default function ExportButton({ filename, columns, data, label = 'Exportar dados', compact = false }) {
  const [open, setOpen] = useState(false);
  const ref = useRef(null);

  useEffect(() => {
    function handleClickOutside(e) {
      if (ref.current && !ref.current.contains(e.target)) {
        setOpen(false);
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleCsv = () => {
    exportToCsv(filename, columns, data);
    setOpen(false);
  };

  const handleJson = () => {
    exportToJson(filename, data);
    setOpen(false);
  };

  const disabled = !data || data.length === 0;

  return (
    <div className="relative inline-block text-left" ref={ref}>
      <button
        type="button"
        disabled={disabled}
        onClick={() => setOpen((prev) => !prev)}
        className={`inline-flex items-center gap-1.5 rounded-lg border bg-white text-xs font-semibold text-slate-700 shadow-sm transition hover:bg-slate-50 disabled:cursor-not-allowed disabled:opacity-50 dark:border-slate-700 dark:bg-slate-900 dark:text-slate-200 dark:hover:bg-slate-800 ${
          compact ? 'px-2.5 py-1.5' : 'px-3 py-2'
        }`}
        title="Baixar dados em formato aberto (Open Data)"
      >
        <svg viewBox="0 0 20 20" className="h-4 w-4 text-emerald-600 dark:text-emerald-400" fill="none" stroke="currentColor" strokeWidth="2">
          <path d="M3 13v3a2 2 0 0 0 2 2h10a2 2 0 0 0 2-2v-3" strokeLinecap="round" strokeLinejoin="round" />
          <path d="M7 9l3 3 3-3" strokeLinecap="round" strokeLinejoin="round" />
          <path d="M10 3v9" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
        <span>{label}</span>
        <svg viewBox="0 0 16 16" className={`h-3 w-3 transition-transform ${open ? 'rotate-180' : ''}`} fill="none" stroke="currentColor" strokeWidth="2">
          <path d="M4 6l4 4 4-4" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
      </button>

      {open && (
        <div className="absolute right-0 z-50 mt-1.5 w-44 rounded-xl border border-slate-200 bg-white p-1 shadow-lg dark:border-slate-700 dark:bg-slate-900">
          <button
            type="button"
            onClick={handleCsv}
            className="flex w-full items-center gap-2 rounded-lg px-3 py-2 text-left text-xs font-medium text-slate-700 transition hover:bg-emerald-50 hover:text-emerald-800 dark:text-slate-200 dark:hover:bg-slate-800 dark:hover:text-emerald-400"
          >
            <span className="rounded bg-emerald-100 px-1.5 py-0.5 text-[10px] font-bold text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300">
              CSV
            </span>
            <span>Excel / Planilhas (.csv)</span>
          </button>
          <button
            type="button"
            onClick={handleJson}
            className="flex w-full items-center gap-2 rounded-lg px-3 py-2 text-left text-xs font-medium text-slate-700 transition hover:bg-emerald-50 hover:text-emerald-800 dark:text-slate-200 dark:hover:bg-slate-800 dark:hover:text-emerald-400"
          >
            <span className="rounded bg-blue-100 px-1.5 py-0.5 text-[10px] font-bold text-blue-800 dark:bg-blue-950 dark:text-blue-300">
              JSON
            </span>
            <span>Dados Brutos (.json)</span>
          </button>
        </div>
      )}
    </div>
  );
}
