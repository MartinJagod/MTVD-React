import { AddToOrderButton } from "@/components/AddToOrderButton";
import { formatCurrency } from "@/lib/utils";
import type { ProductForOrder } from "@/lib/data";

export function ProductQuickTable({ products }: { products: ProductForOrder[] }) {
  return (
    <div className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">
      <div className="overflow-x-auto">
        <table className="min-w-full divide-y divide-slate-200 text-sm">
          <thead className="bg-slate-50 text-left text-xs font-bold uppercase tracking-wide text-slate-500">
            <tr><th className="px-4 py-3">SKU</th><th className="px-4 py-3">Producto</th><th className="px-4 py-3">Categoría</th><th className="px-4 py-3">Mín.</th><th className="px-4 py-3">Precio</th><th className="px-4 py-3">Acción</th></tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            {products.map((product) => (
              <tr key={product.id} className="hover:bg-slate-50">
                <td className="px-4 py-3 font-mono text-xs text-slate-500">{product.sku}</td>
                <td className="px-4 py-3 font-semibold text-slate-950">{product.name}</td>
                <td className="px-4 py-3 text-slate-600">{product.categoryName}</td>
                <td className="px-4 py-3 text-slate-600">{product.minPurchase} {product.saleUnit}</td>
                <td className="px-4 py-3 font-bold text-slate-950">{product.price ? formatCurrency(product.price) : "Precio no disponible"}</td>
                <td className="px-4 py-3"><div className="w-28"><AddToOrderButton productId={product.id} disabled={!product.price} /></div></td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
