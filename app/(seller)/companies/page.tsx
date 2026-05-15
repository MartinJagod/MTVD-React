export const dynamic = "force-dynamic";

import { CompanyCard } from "@/components/CompanyCard";
import { getCompaniesForSeller, getSellerContext } from "@/lib/data";

export default async function CompaniesPage({ searchParams }: { searchParams: { customerId?: string } }) {
  const [companies, context] = await Promise.all([getCompaniesForSeller(), getSellerContext()]);
  const customerId = searchParams.customerId ?? context.customers[0]?.id;
  return (
    <div className="space-y-5">
      <div><h1 className="text-3xl font-black text-slate-950">Empresas representadas</h1><p className="mt-1 text-slate-600">Catálogos y listas de precios disponibles para el vendedor activo.</p></div>
      <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">{companies.map((company: any) => <CompanyCard key={company.id} company={company} customerId={customerId} />)}</div>
    </div>
  );
}
