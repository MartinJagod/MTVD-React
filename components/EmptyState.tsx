import Link from "next/link";

export function EmptyState({ title, description, href, action }: { title: string; description: string; href?: string; action?: string }) {
  return (
    <div className="rounded-2xl border border-dashed border-slate-300 bg-white p-10 text-center">
      <h3 className="text-lg font-bold text-slate-950">{title}</h3>
      <p className="mx-auto mt-2 max-w-md text-sm text-slate-500">{description}</p>
      {href && action ? <Link href={href} className="mt-5 inline-flex rounded-xl bg-brand-600 px-4 py-2 text-sm font-bold text-white">{action}</Link> : null}
    </div>
  );
}
