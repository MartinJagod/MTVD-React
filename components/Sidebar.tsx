import Link from "next/link";
import { Building2, ClipboardList, LayoutDashboard, PlusCircle } from "lucide-react";

const items = [
  { href: "/dashboard", label: "Dashboard", icon: LayoutDashboard },
  { href: "/companies", label: "Empresas", icon: Building2 },
  { href: "/orders/new", label: "Nuevo pedido", icon: PlusCircle },
  { href: "/orders", label: "Pedidos", icon: ClipboardList }
];

export function Sidebar() {
  return (
    <aside className="fixed inset-y-0 left-0 hidden w-72 border-r border-slate-200 bg-white p-6 lg:block">
      <Link href="/dashboard" className="block">
        <div className="rounded-2xl bg-brand-600 px-4 py-3 text-white shadow-sm">
          <p className="text-xs font-semibold uppercase tracking-[0.25em] text-brand-100">SaaS B2B</p>
          <h1 className="mt-1 text-2xl font-bold">RutaB2B</h1>
        </div>
      </Link>
      <nav className="mt-8 space-y-2">
        {items.map((item) => (
          <Link key={item.href} href={item.href} className="flex items-center gap-3 rounded-xl px-4 py-3 text-sm font-semibold text-slate-700 hover:bg-slate-100 hover:text-brand-600">
            <item.icon className="h-5 w-5" />
            {item.label}
          </Link>
        ))}
      </nav>
      <div className="absolute bottom-6 left-6 right-6 rounded-2xl border border-slate-200 bg-slate-50 p-4 text-sm text-slate-600">
        <p className="font-semibold text-slate-900">MVP técnico</p>
        <p className="mt-1">Auth simulada con vendedor activo y roles preparados.</p>
      </div>
    </aside>
  );
}
