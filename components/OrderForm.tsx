"use client";

import { useMemo, useState } from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { useRouter, useSearchParams } from "next/navigation";
import { z } from "zod";
import { OrderSummary } from "@/components/OrderSummary";
import { formatCurrency } from "@/lib/utils";

const schema = z.object({ companyId: z.string().min(1), customerId: z.string().min(1), notes: z.string().optional() });
type FormValues = z.infer<typeof schema>;
type Company = { id: string; name: string };
type Customer = { id: string; name: string; legalName: string };
type Product = { id: string; companyId: string; sku: string; name: string; categoryName: string; vatRate: number; minPurchase: number; saleUnit: string };
type Price = { customerId: string; companyId: string; productId: string; price: number };
type Line = { productId: string; quantity: number };

export function OrderForm({ sellerId, companies, customers, products, prices }: { sellerId: string; companies: Company[]; customers: Customer[]; products: Product[]; prices: Price[] }) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const preselectedProductId = searchParams.get("productId");
  const preselectedProduct = products.find((product) => product.id === preselectedProductId);
  const [lines, setLines] = useState<Line[]>(preselectedProduct ? [{ productId: preselectedProduct.id, quantity: preselectedProduct.minPurchase }] : []);
  const [isSaving, setIsSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const { register, watch, handleSubmit, formState: { errors } } = useForm<FormValues>({
    resolver: zodResolver(schema),
    defaultValues: { companyId: preselectedProduct?.companyId ?? companies[0]?.id, customerId: customers[0]?.id, notes: "" }
  });

  const companyId = watch("companyId");
  const customerId = watch("customerId");
  const visibleProducts = products.filter((product) => product.companyId === companyId);
  const priceMap = useMemo(() => new Map(prices.filter((price) => price.companyId === companyId && price.customerId === customerId).map((price) => [price.productId, price.price])), [prices, companyId, customerId]);

  const enrichedLines = lines.map((line) => {
    const product = products.find((item) => item.id === line.productId)!;
    const price = priceMap.get(line.productId) ?? null;
    const lineSubtotal = price ? price * line.quantity : 0;
    const lineVat = lineSubtotal * (product.vatRate / 100);
    return { ...line, product, price, lineSubtotal, lineVat, lineTotal: lineSubtotal + lineVat };
  });
  const subtotal = enrichedLines.reduce((sum, line) => sum + line.lineSubtotal, 0);
  const vatTotal = enrichedLines.reduce((sum, line) => sum + line.lineVat, 0);
  const total = subtotal + vatTotal;

  function addLine(productId: string) {
    const product = products.find((item) => item.id === productId);
    if (!product || !priceMap.has(productId)) return;
    setLines((current) => current.some((line) => line.productId === productId) ? current : [...current, { productId, quantity: product.minPurchase }]);
  }

  function updateQuantity(productId: string, quantity: number) {
    setLines((current) => current.map((line) => line.productId === productId ? { ...line, quantity: Math.max(1, quantity) } : line));
  }

  async function submit(values: FormValues, status: "DRAFT" | "SENT") {
    setError(null);
    setIsSaving(true);
    const response = await fetch("/api/orders", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ ...values, sellerId, status, items: lines })
    });
    const payload = await response.json();
    setIsSaving(false);
    if (!response.ok) {
      setError(payload.error ?? "No se pudo guardar el pedido.");
      return;
    }
    router.push(`/orders/${payload.id}`);
    router.refresh();
  }

  return (
    <form className="grid gap-5 lg:grid-cols-[1fr_320px]" onSubmit={handleSubmit((values) => submit(values, "DRAFT"))}>
      <div className="space-y-5">
        <section className="grid gap-4 rounded-2xl border border-slate-200 bg-white p-5 shadow-sm md:grid-cols-2">
          <div><label className="text-sm font-bold text-slate-900">Empresa</label><select {...register("companyId")} className="mt-2 w-full rounded-xl border border-slate-300 px-4 py-3">{companies.map((company) => <option key={company.id} value={company.id}>{company.name}</option>)}</select>{errors.companyId ? <p className="mt-1 text-sm text-red-600">{errors.companyId.message}</p> : null}</div>
          <div><label className="text-sm font-bold text-slate-900">Cliente</label><select {...register("customerId")} className="mt-2 w-full rounded-xl border border-slate-300 px-4 py-3">{customers.map((customer) => <option key={customer.id} value={customer.id}>{customer.name}</option>)}</select>{errors.customerId ? <p className="mt-1 text-sm text-red-600">{errors.customerId.message}</p> : null}</div>
          <div className="md:col-span-2"><label className="text-sm font-bold text-slate-900">Observaciones</label><textarea {...register("notes")} rows={2} className="mt-2 w-full rounded-xl border border-slate-300 px-4 py-3" placeholder="Condiciones comerciales, entrega, etc." /></div>
        </section>

        <section className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
          <h2 className="text-lg font-black text-slate-950">Agregar productos</h2>
          <div className="mt-4 grid gap-3 md:grid-cols-2">
            {visibleProducts.map((product) => {
              const price = priceMap.get(product.id) ?? null;
              return <button type="button" key={product.id} disabled={!price} onClick={() => addLine(product.id)} className="rounded-xl border border-slate-200 p-4 text-left hover:border-brand-500 disabled:cursor-not-allowed disabled:bg-slate-50 disabled:text-slate-400"><p className="text-xs font-bold uppercase text-slate-500">{product.sku} · {product.categoryName}</p><p className="font-bold text-slate-950">{product.name}</p><p className="mt-1 text-sm font-black text-brand-600">{price ? formatCurrency(price) : "Precio no disponible"}</p></button>;
            })}
          </div>
        </section>

        <section className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">
          <div className="border-b border-slate-200 p-5"><h2 className="text-lg font-black text-slate-950">Ítems de la Nota de Pedido</h2></div>
          <div className="overflow-x-auto"><table className="min-w-full text-sm"><thead className="bg-slate-50 text-left text-xs uppercase text-slate-500"><tr><th className="px-4 py-3">Producto</th><th className="px-4 py-3">Precio</th><th className="px-4 py-3">Cantidad</th><th className="px-4 py-3">Total</th><th /></tr></thead><tbody className="divide-y divide-slate-100">{enrichedLines.map((line) => <tr key={line.productId}><td className="px-4 py-3 font-semibold">{line.product.name}</td><td className="px-4 py-3">{line.price ? formatCurrency(line.price) : "Sin precio"}</td><td className="px-4 py-3"><input type="number" min={line.product.minPurchase} value={line.quantity} onChange={(event) => updateQuantity(line.productId, Number(event.target.value))} className="w-24 rounded-lg border border-slate-300 px-3 py-2" /></td><td className="px-4 py-3 font-bold">{formatCurrency(line.lineTotal)}</td><td className="px-4 py-3"><button type="button" onClick={() => setLines((current) => current.filter((item) => item.productId !== line.productId))} className="font-bold text-red-600">Quitar</button></td></tr>)}</tbody></table></div>
        </section>
      </div>
      <div className="space-y-4">
        <OrderSummary subtotal={subtotal} vatTotal={vatTotal} total={total} />
        {error ? <p className="rounded-xl bg-red-50 p-3 text-sm font-semibold text-red-700">{error}</p> : null}
        <button type="submit" disabled={isSaving || lines.length === 0} className="w-full rounded-xl bg-slate-900 px-4 py-3 font-bold text-white disabled:bg-slate-300">Guardar borrador</button>
        <button type="button" disabled={isSaving || lines.length === 0} onClick={handleSubmit((values) => submit(values, "SENT"))} className="w-full rounded-xl bg-brand-600 px-4 py-3 font-bold text-white disabled:bg-slate-300">Marcar como enviada</button>
        <p className="text-xs text-slate-500">Los pedidos enviados quedan bloqueados para edición en esta versión.</p>
      </div>
    </form>
  );
}
