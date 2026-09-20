export default function StatsSkeleton() {
  return (
    <div className="grid gap-3 md:grid-cols-3">
      {[1, 2, 3].map((i) => (
        <div
          key={i}
          className="flex animate-pulse flex-col rounded-xl border bg-white p-3 dark:border-slate-700 dark:bg-slate-900"
        >
          {/* Título do Gráfico */}
          <div className="h-4 w-1/3 rounded bg-slate-200 dark:bg-slate-700" />
          {/* Subtítulo */}
          <div className="mt-1.5 h-3 w-1/2 rounded bg-slate-100 dark:bg-slate-800" />

          {/* Gráfico Donut placeholder */}
          <div className="my-3 flex h-48 items-center justify-center">
            <div className="relative flex h-36 w-36 items-center justify-center rounded-full border-8 border-slate-200 dark:border-slate-700">
              <div className="h-16 w-16 rounded-full bg-white dark:bg-slate-900" />
            </div>
          </div>

          {/* Legendas inferiores */}
          <div className="mt-auto flex justify-center gap-3 pt-1">
            <div className="h-2.5 w-12 rounded bg-slate-200 dark:bg-slate-700" />
            <div className="h-2.5 w-12 rounded bg-slate-200 dark:bg-slate-700" />
            <div className="h-2.5 w-12 rounded bg-slate-200 dark:bg-slate-700" />
          </div>
        </div>
      ))}
    </div>
  );
}
