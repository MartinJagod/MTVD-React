import { Decimal } from "@prisma/client/runtime/library";
import { prisma } from "@/lib/prisma";
import { z } from "zod";

export const orderItemInputSchema = z.object({
  productId: z.string().min(1),
  quantity: z.number().int().positive()
});

export const createOrderSchema = z.object({
  companyId: z.string().min(1),
  customerId: z.string().min(1),
  sellerId: z.string().min(1),
  status: z.enum(["DRAFT", "SENT"]),
  notes: z.string().optional(),
  items: z.array(orderItemInputSchema).min(1)
});

export type CreateOrderInput = z.infer<typeof createOrderSchema>;

export async function createOrder(input: CreateOrderInput) {
  const data = createOrderSchema.parse(input);
  const products = await prisma.product.findMany({ where: { id: { in: data.items.map((item) => item.productId) }, companyId: data.companyId } });
  const priceLists = await prisma.customerPriceList.findMany({
    where: { customerId: data.customerId, priceList: { companyId: data.companyId, active: true } },
    include: { priceList: { include: { items: true } } }
  });

  const priceByProduct = new Map<string, Decimal>();
  for (const assignment of priceLists) {
    for (const priceItem of assignment.priceList.items) {
      priceByProduct.set(priceItem.productId, priceItem.price);
    }
  }

  const productById = new Map(products.map((product: any) => [product.id, product]));
  const orderItems = data.items.map((item) => {
    const product = productById.get(item.productId) as any;
    const price = priceByProduct.get(item.productId);
    if (!product || !price) {
      throw new Error("El pedido contiene productos sin precio disponible para el cliente.");
    }
    const quantity = new Decimal(item.quantity);
    const lineSubtotal = price.mul(quantity);
    const vatRate = product.vatRate;
    const lineVat = lineSubtotal.mul(vatRate).div(100);
    return {
      productId: product.id,
      sku: product.sku,
      name: product.name,
      quantity: item.quantity,
      unitPrice: price,
      vatRate,
      lineSubtotal,
      lineVat,
      lineTotal: lineSubtotal.add(lineVat)
    };
  });

  const subtotal = orderItems.reduce((sum, item) => sum.add(item.lineSubtotal), new Decimal(0));
  const vatTotal = orderItems.reduce((sum, item) => sum.add(item.lineVat), new Decimal(0));
  const total = subtotal.add(vatTotal);
  const orderNumber = `NP-${Date.now()}`;
  const status = data.status;

  return prisma.order.create({
    data: {
      orderNumber,
      sellerId: data.sellerId,
      customerId: data.customerId,
      companyId: data.companyId,
      status,
      notes: data.notes,
      subtotal,
      vatTotal,
      total,
      sentAt: status === "SENT" ? new Date() : null,
      items: { create: orderItems },
      statusHistory: { create: { status, comment: status === "SENT" ? "Pedido enviado desde MVP" : "Borrador guardado" } }
    },
    include: { items: true }
  });
}
