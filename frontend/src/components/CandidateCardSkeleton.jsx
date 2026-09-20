export default function CandidateCardSkeleton() {
  return (
    <div className="flex animate-pulse gap-3 rounded-xl border bg-white p-3 shadow-sm dark:border-slate-700 dark:bg-slate-900">
      {/* Avatar redondo animado */}
      <div className="h-16 w-16 shrink-0 rounded-full bg-slate-200 dark:bg-slate-700" />

      {/* Conteúdo textual animado */}
      <div className="min-w-0 flex-1 space-y-2 py-0.5">
        {/* Nome do Candidato */}
        <div className="h-4 w-3/4 rounded bg-slate-200 dark:bg-slate-700" />

        {/* Selo TSE placeholder */}
        <div className="h-4 w-28 rounded-full bg-emerald-100 dark:bg-emerald-950/60" />

        {/* Partido · Número */}
        <div className="h-3 w-1/2 rounded bg-slate-200 dark:bg-slate-700" />

        {/* Ocupação / Instrução */}
        <div className="h-3 w-2/3 rounded bg-slate-100 dark:bg-slate-800" />

        {/* Patrimônio */}
        <div className="h-3 w-1/3 rounded bg-slate-200 dark:bg-slate-700" />
      </div>
    </div>
  );
}
