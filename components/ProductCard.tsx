import { AddToOrderButton } from "@/components/AddToOrderButton";
import { formatCurrency } from "@/lib/utils";
import type { ProductForOrder } from "@/lib/data";

export function ProductCard({ product }: { product: ProductForOrder }) {
  return (
    <article className="flex h-full flex-col overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">
      <div className="flex h-36 items-center justify-center bg-gradient-to-br from-slate-100 to-slate-200 p-4 text-center text-xs font-bold uppercase tracking-wide text-slate-400">
        {product.imageUrl ? product.name : "Imagen producto"}
      </div>
      <div className="flex flex-1 flex-col p-4">
        <p className="text-xs font-bold uppercase tracking-wide text-brand-600">{product.sku} · {product.categoryName}</p>
        <h3 className="mt-1 text-base font-bold text-slate-950">{product.name}</h3>
        <p className="mt-2 flex-1 text-sm text-slate-600">{product.shortDescription}</p>
        <div className="mt-4 flex items-end justify-between gap-3">
          <div>
            <p className="text-xs text-slate-500">Unidad: {product.saleUnit}</p>
            <p className="text-lg font-black text-slate-950">{product.price ? formatCurrency(product.price) : "Precio no disponible"}</p>
          </div>
          <div className="w-28"><AddToOrderButton productId={product.id} disabled={!product.price} /></div>
        </div>
      </div>
    </article>
  );
}
