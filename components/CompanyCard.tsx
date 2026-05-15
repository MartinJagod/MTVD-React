import Link from "next/link";
import { Building2 } from "lucide-react";

export function CompanyCard({ company, customerId }: { company: { id: string; name: string; legalName: string; products: unknown[]; priceLists: unknown[] }; customerId?: string }) {
  const href = `/companies/${company.id}/catalog${customerId ? `?customerId=${customerId}` : ""}`;
  return (
    <article className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
      <div className="flex items-start gap-4">
        <div className="rounded-2xl bg-brand-50 p-3 text-brand-600"><Building2 className="h-6 w-6" /></div>
        <div>
          <h3 className="text-lg font-bold text-slate-950">{company.name}</h3>
          <p className="text-sm text-slate-500">{company.legalName}</p>
        </div>
      </div>
      <div className="mt-5 grid grid-cols-2 gap-3 text-sm">
        <div className="rounded-xl bg-slate-50 p-3"><p className="font-bold text-slate-950">{company.products.length}</p><p className="text-slate-500">productos</p></div>
        <div className="rounded-xl bg-slate-50 p-3"><p className="font-bold text-slate-950">{company.priceLists.length}</p><p className="text-slate-500">listas</p></div>
      </div>
      <Link href={href} className="mt-5 block rounded-xl bg-brand-600 px-4 py-3 text-center text-sm font-bold text-white hover:bg-brand-500">Ver catálogo</Link>
    </article>
  );
}
