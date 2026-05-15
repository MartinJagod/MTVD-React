export const dynamic = "force-dynamic";

import Link from "next/link";
import { notFound } from "next/navigation";
import { StatusBadge } from "@/components/StatusBadge";
import { OrderSummary } from "@/components/OrderSummary";
import { getOrderById } from "@/lib/data";
import { formatCurrency, formatDate } from "@/lib/utils";

export default async function OrderDetailPage({ params }: { params: { orderId: string } }) {
  const order = await getOrderById(params.orderId);
  if (!order) notFound();
  const editable = order.status === "DRAFT";
  return (
    <div className="space-y-5">
      <div className="flex flex-wrap items-start justify-between gap-4 rounded-3xl bg-white p-6 shadow-sm">
        <div>
          <p className="text-sm font-bold uppercase tracking-wide text-brand-600">Nota de Pedido</p>
          <h1 className="mt-1 text-3xl font-black text-slate-950">{order.orderNumber}</h1>
          <p className="mt-2 text-slate-600">{order.company.name} · {order.customer.name} · {formatDate(order.createdAt)}</p>
        </div>
        <div className="text-right"><StatusBadge status={order.status} /><p className="mt-3 text-sm font-semibold text-slate-500">{editable ? "Borrador editable" : "Pedido bloqueado para edición"}</p></div>
      </div>

      <div className="grid gap-5 lg:grid-cols-[1fr_320px]">
        <section className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">
          <div className="border-b border-slate-200 p-5"><h2 className="text-lg font-black text-slate-950">Ítems</h2></div>
          <div className="overflow-x-auto"><table className="min-w-full text-sm"><thead className="bg-slate-50 text-left text-xs uppercase text-slate-500"><tr><th className="px-4 py-3">SKU</th><th className="px-4 py-3">Producto</th><th className="px-4 py-3">Cant.</th><th className="px-4 py-3">Precio aplicado</th><th className="px-4 py-3">IVA</th><th className="px-4 py-3">Total</th></tr></thead><tbody className="divide-y divide-slate-100">{order.items.map((item: any) => <tr key={item.id}><td className="px-4 py-3 font-mono text-xs">{item.sku}</td><td className="px-4 py-3 font-semibold">{item.name}</td><td className="px-4 py-3">{item.quantity}</td><td className="px-4 py-3">{formatCurrency(item.unitPrice.toNumber())}</td><td className="px-4 py-3">{formatCurrency(item.lineVat.toNumber())}</td><td className="px-4 py-3 font-bold">{formatCurrency(item.lineTotal.toNumber())}</td></tr>)}</tbody></table></div>
        </section>
        <div className="space-y-4"><OrderSummary subtotal={order.subtotal.toNumber()} vatTotal={order.vatTotal.toNumber()} total={order.total.toNumber()} />{editable ? <Link href="/orders/new" className="block rounded-xl bg-brand-600 px-4 py-3 text-center font-bold text-white">Crear nueva versión</Link> : null}</div>
      </div>

      <section className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
        <h2 className="text-lg font-black text-slate-950">Historial de estado</h2>
        <div className="mt-4 space-y-3">{order.statusHistory.map((event: any) => <div key={event.id} className="flex items-center justify-between rounded-xl bg-slate-50 p-3"><StatusBadge status={event.status} /><span className="text-sm text-slate-500">{formatDate(event.createdAt)}</span></div>)}</div>
      </section>
    </div>
  );
}
