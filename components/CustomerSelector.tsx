type Customer = { id: string; name: string; legalName?: string };

export function CustomerSelector({ customers, activeCustomerId, action }: { customers: Customer[]; activeCustomerId?: string; action?: string }) {
  return (
    <form action={action} className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm">
      <label htmlFor="customerId" className="text-sm font-bold text-slate-900">Cliente activo</label>
      <select id="customerId" name="customerId" defaultValue={activeCustomerId ?? customers[0]?.id} className="mt-2 w-full rounded-xl border border-slate-300 bg-white px-3 py-3 text-sm font-semibold text-slate-900">
        {customers.map((customer) => (
          <option key={customer.id} value={customer.id}>{customer.name}</option>
        ))}
      </select>
      <button className="mt-3 w-full rounded-xl bg-slate-900 px-4 py-2 text-sm font-bold text-white">Aplicar cliente</button>
    </form>
  );
}
