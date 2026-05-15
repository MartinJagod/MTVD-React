import Link from "next/link";
import { Menu, Plus } from "lucide-react";

export function Topbar({ title = "Panel del vendedor" }: { title?: string }) {
  return (
    <header className="sticky top-0 z-10 border-b border-slate-200 bg-white/90 backdrop-blur">
      <div className="flex h-16 items-center justify-between px-4 sm:px-6 lg:px-8">
        <div className="flex items-center gap-3">
          <Menu className="h-6 w-6 text-slate-500 lg:hidden" />
          <div>
            <p className="text-xs font-semibold uppercase tracking-wide text-slate-500">RutaB2B</p>
            <h2 className="text-lg font-bold text-slate-950">{title}</h2>
          </div>
        </div>
        <Link href="/orders/new" className="inline-flex items-center gap-2 rounded-xl bg-brand-600 px-4 py-2 text-sm font-bold text-white shadow-sm hover:bg-brand-500">
          <Plus className="h-4 w-4" /> Nueva Nota
        </Link>
      </div>
    </header>
  );
}
