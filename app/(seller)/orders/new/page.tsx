export const dynamic = "force-dynamic";

import { OrderForm } from "@/components/OrderForm";
import { getOrderFormData } from "@/lib/data";

export default async function NewOrderPage() {
  const data = await getOrderFormData();
  return (
    <div className="space-y-5">
      <div><h1 className="text-3xl font-black text-slate-950">Nueva Nota de Pedido</h1><p className="mt-1 text-slate-600">Seleccioná empresa y cliente, agregá productos con precio disponible y guardá el pedido.</p></div>
      <OrderForm sellerId={data.seller.id} companies={data.companies} customers={data.customers} products={data.products} prices={data.prices} />
    </div>
  );
}
