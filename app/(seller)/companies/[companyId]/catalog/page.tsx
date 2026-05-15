export const dynamic = "force-dynamic";

import { notFound } from "next/navigation";
import { CustomerSelector } from "@/components/CustomerSelector";
import { ProductCard } from "@/components/ProductCard";
import { ProductQuickTable } from "@/components/ProductQuickTable";
import { EmptyState } from "@/components/EmptyState";
import { getCatalogData } from "@/lib/data";

export default async function CatalogPage({ params, searchParams }: { params: { companyId: string }; searchParams: { customerId?: string; categoryId?: string; q?: string; view?: string } }) {
  const data = await getCatalogData(params.companyId, searchParams.customerId, searchParams.categoryId, searchParams.q);
  if (!data.company) notFound();
  const listView = searchParams.view === "list";

  return (
    <div className="space-y-5">
      <div className="grid gap-4 lg:grid-cols-[1fr_320px]">
        <div className="rounded-3xl bg-white p-6 shadow-sm">
          <p className="text-sm font-bold uppercase tracking-wide text-brand-600">Catálogo</p>
          <h1 className="mt-1 text-3xl font-black text-slate-950">{data.company.name}</h1>
          <p className="mt-2 text-slate-600">Precios calculados según la lista asignada al cliente activo.</p>
        </div>
        <CustomerSelector customers={data.customers} activeCustomerId={data.activeCustomer?.id} action={`/companies/${params.companyId}/catalog`} />
      </div>

      <form className="grid gap-3 rounded-2xl border border-slate-200 bg-white p-4 shadow-sm md:grid-cols-[1fr_220px_180px_auto]" action={`/companies/${params.companyId}/catalog`}>
        <input type="hidden" name="customerId" value={data.activeCustomer?.id ?? ""} />
        <input name="q" defaultValue={searchParams.q} placeholder="Buscar por SKU o nombre" className="rounded-xl border border-slate-300 px-4 py-3" />
        <select name="categoryId" defaultValue={searchParams.categoryId ?? ""} className="rounded-xl border border-slate-300 px-4 py-3">
          <option value="">Todas las categorías</option>{data.company.categories.map((category: any) => <option key={category.id} value={category.id}>{category.name}</option>)}
        </select>
        <select name="view" defaultValue={searchParams.view ?? "cards"} className="rounded-xl border border-slate-300 px-4 py-3"><option value="cards">Vista catálogo</option><option value="list">Lista rápida</option></select>
        <button className="rounded-xl bg-slate-900 px-5 py-3 font-bold text-white">Filtrar</button>
      </form>

      {data.products.length === 0 ? <EmptyState title="Sin productos" description="No hay productos para los filtros aplicados." /> : listView ? <ProductQuickTable products={data.products} /> : <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">{data.products.map((product: any) => <ProductCard key={product.id} product={product} />)}</div>}
    </div>
  );
}
