import Link from "next/link";

export function AddToOrderButton({ productId, disabled }: { productId: string; disabled: boolean }) {
  if (disabled) {
    return <button disabled className="w-full rounded-xl bg-slate-200 px-3 py-2 text-sm font-bold text-slate-500">Sin precio</button>;
  }
  return <Link href={`/orders/new?productId=${productId}`} className="block rounded-xl bg-slate-900 px-3 py-2 text-center text-sm font-bold text-white hover:bg-slate-700">Agregar</Link>;
}
