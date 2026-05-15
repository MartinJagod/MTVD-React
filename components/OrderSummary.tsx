import { formatCurrency } from "@/lib/utils";

export function OrderSummary({ subtotal, vatTotal, total }: { subtotal: number; vatTotal: number; total: number }) {
  return (
    <aside className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
      <h3 className="text-lg font-bold text-slate-950">Resumen</h3>
      <dl className="mt-4 space-y-3 text-sm">
        <div className="flex justify-between"><dt className="text-slate-500">Subtotal</dt><dd className="font-bold text-slate-950">{formatCurrency(subtotal)}</dd></div>
        <div className="flex justify-between"><dt className="text-slate-500">IVA</dt><dd className="font-bold text-slate-950">{formatCurrency(vatTotal)}</dd></div>
        <div className="border-t border-slate-200 pt-3 flex justify-between text-lg"><dt className="font-black text-slate-950">Total</dt><dd className="font-black text-brand-600">{formatCurrency(total)}</dd></div>
      </dl>
    </aside>
  );
}
