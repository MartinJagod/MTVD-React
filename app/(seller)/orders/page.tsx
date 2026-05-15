export const dynamic = "force-dynamic";

import Link from "next/link";
import { EmptyState } from "@/components/EmptyState";
import { StatusBadge } from "@/components/StatusBadge";
import { getOrders } from "@/lib/data";
import { formatCurrency, formatDate } from "@/lib/utils";

export default async function OrdersPage() {
  const orders = await getOrders();
  return (
    <div className="space-y-5">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div><h1 className="text-3xl font-black text-slate-950">Notas de Pedido</h1><p className="mt-1 text-slate-600">Listado de borradores y pedidos enviados.</p></div>
        <Link href="/orders/new" className="rounded-xl bg-brand-600 px-4 py-3 text-sm font-bold text-white">Nueva Nota</Link>
      </div>
      {orders.length === 0 ? <EmptyState title="Todavía no hay pedidos" description="Creá el primer borrador para validar el flujo comercial." href="/orders/new" action="Crear pedido" /> : (
        <div className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">
          <div className="overflow-x-auto">
            <table className="min-w-full text-sm">
              <thead className="bg-slate-50 text-left text-xs font-bold uppercase tracking-wide text-slate-500"><tr><th className="px-4 py-3">Número</th><th className="px-4 py-3">Cliente</th><th className="px-4 py-3">Empresa</th><th className="px-4 py-3">Estado</th><th className="px-4 py-3">Fecha</th><th className="px-4 py-3">Total</th></tr></thead>
              <tbody className="divide-y divide-slate-100">{orders.map((order: any) => <tr key={order.id} className="hover:bg-slate-50"><td className="px-4 py-3 font-bold"><Link href={`/orders/${order.id}`}>{order.orderNumber}</Link></td><td className="px-4 py-3">{order.customer.name}</td><td className="px-4 py-3">{order.company.name}</td><td className="px-4 py-3"><StatusBadge status={order.status} /></td><td className="px-4 py-3">{formatDate(order.createdAt)}</td><td className="px-4 py-3 font-black">{formatCurrency(order.total.toNumber())}</td></tr>)}</tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
}
