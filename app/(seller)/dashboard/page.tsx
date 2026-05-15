export const dynamic = "force-dynamic";

import Link from "next/link";
import { CustomerSelector } from "@/components/CustomerSelector";
import { CompanyCard } from "@/components/CompanyCard";
import { StatusBadge } from "@/components/StatusBadge";
import { formatCurrency } from "@/lib/utils";
import { getSellerContext } from "@/lib/data";

export default async function DashboardPage({ searchParams }: { searchParams: { customerId?: string } }) {
  const { user, companies, customers, orders } = await getSellerContext();
  const activeCustomerId = searchParams.customerId ?? customers[0]?.id;
  const drafts = orders.filter((order: any) => order.status === "DRAFT");

  return (
    <div className="space-y-6">
      <section className="grid gap-4 lg:grid-cols-[1fr_320px]">
        <div className="rounded-3xl bg-slate-950 p-6 text-white shadow-sm">
          <p className="text-sm font-semibold text-brand-100">Vendedor activo</p>
          <h1 className="mt-2 text-3xl font-black">Hola, {user.name}</h1>
          <p className="mt-2 max-w-2xl text-slate-300">Seleccioná un cliente, revisá sus empresas representadas y armá Notas de Pedido con precios vigentes por lista asignada.</p>
          <div className="mt-6 flex flex-wrap gap-3">
            <Link href="/orders/new" className="rounded-xl bg-brand-600 px-5 py-3 text-sm font-bold text-white">Nuevo pedido</Link>
            <Link href="/orders" className="rounded-xl bg-white/10 px-5 py-3 text-sm font-bold text-white">Ver borradores</Link>
          </div>
        </div>
        <CustomerSelector customers={customers} activeCustomerId={activeCustomerId} action="/dashboard" />
      </section>

      <section className="grid gap-4 sm:grid-cols-3">
        <div className="rounded-2xl bg-white p-5 shadow-sm"><p className="text-sm text-slate-500">Empresas</p><p className="text-3xl font-black text-slate-950">{companies.length}</p></div>
        <div className="rounded-2xl bg-white p-5 shadow-sm"><p className="text-sm text-slate-500">Clientes activos</p><p className="text-3xl font-black text-slate-950">{customers.length}</p></div>
        <div className="rounded-2xl bg-white p-5 shadow-sm"><p className="text-sm text-slate-500">Borradores</p><p className="text-3xl font-black text-slate-950">{drafts.length}</p></div>
      </section>

      <section>
        <div className="mb-4 flex items-center justify-between"><h2 className="text-xl font-black text-slate-950">Empresas representadas</h2><Link href="/companies" className="text-sm font-bold text-brand-600">Ver todas</Link></div>
        <div className="grid gap-4 md:grid-cols-2">{companies.map((company: any) => <CompanyCard key={company.id} company={company} customerId={activeCustomerId} />)}</div>
      </section>

      <section>
        <div className="mb-4 flex items-center justify-between"><h2 className="text-xl font-black text-slate-950">Últimas Notas de Pedido</h2><Link href="/orders" className="text-sm font-bold text-brand-600">Abrir listado</Link></div>
        <div className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">
          {orders.slice(0, 5).map((order: any) => (
            <Link href={`/orders/${order.id}`} key={order.id} className="grid gap-3 border-b border-slate-100 p-4 text-sm hover:bg-slate-50 md:grid-cols-5">
              <span className="font-bold text-slate-950">{order.orderNumber}</span><span>{order.customer.name}</span><span>{order.company.name}</span><StatusBadge status={order.status} /><span className="font-bold">{formatCurrency(order.total.toNumber())}</span>
            </Link>
          ))}
        </div>
      </section>
    </div>
  );
}
