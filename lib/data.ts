import { prisma } from "@/lib/prisma";
import { getActiveUser } from "@/lib/auth";

export type ProductForOrder = Awaited<ReturnType<typeof getCatalogData>>["products"][number];

function toNumber(value: { toNumber: () => number } | number) {
  return typeof value === "number" ? value : value.toNumber();
}

export async function getSellerContext() {
  const { user, seller } = await getActiveUser();
  const [companies, customers, orders] = await Promise.all([
    prisma.company.findMany({
      where: { sellerCompanies: { some: { sellerId: seller.id } } },
      include: { products: true, priceLists: true },
      orderBy: { name: "asc" }
    }),
    prisma.customer.findMany({
      where: { sellerCustomers: { some: { sellerId: seller.id } }, status: "ACTIVE" },
      include: { customerPriceLists: { include: { priceList: true } } },
      orderBy: { name: "asc" }
    }),
    prisma.order.findMany({
      where: { sellerId: seller.id },
      include: { customer: true, company: true, items: true },
      orderBy: { createdAt: "desc" }
    })
  ]);

  return { user, seller, companies, customers, orders };
}

export async function getCompaniesForSeller() {
  const { seller } = await getActiveUser();
  return prisma.company.findMany({
    where: { sellerCompanies: { some: { sellerId: seller.id } } },
    include: { products: true, priceLists: true },
    orderBy: { name: "asc" }
  });
}

export async function getCatalogData(companyId: string, customerId?: string, categoryId?: string, query?: string) {
  const [company, customers] = await Promise.all([
    prisma.company.findUnique({ where: { id: companyId }, include: { categories: { orderBy: { name: "asc" } } } }),
    prisma.customer.findMany({ where: { status: "ACTIVE" }, orderBy: { name: "asc" } })
  ]);

  const customer = customerId ? customers.find((item: any) => item.id === customerId) : customers[0];
  const priceLists = customer
    ? await prisma.customerPriceList.findMany({
        where: { customerId: customer.id, priceList: { companyId, active: true } },
        include: { priceList: { include: { items: true } } }
      })
    : [];

  const priceByProduct = new Map<string, number>();
  for (const assignment of priceLists) {
    for (const priceItem of assignment.priceList.items) {
      priceByProduct.set(priceItem.productId, toNumber(priceItem.price));
    }
  }

  const products = await prisma.product.findMany({
    where: {
      companyId,
      status: "ACTIVE",
      ...(categoryId ? { categoryId } : {}),
      ...(query ? { OR: [{ name: { contains: query, mode: "insensitive" } }, { sku: { contains: query, mode: "insensitive" } }] } : {})
    },
    include: { category: true, brand: true },
    orderBy: { name: "asc" }
  });

  return {
    company,
    customers,
    activeCustomer: customer,
    products: products.map((product: any) => ({
      id: product.id,
      sku: product.sku,
      name: product.name,
      shortDescription: product.shortDescription,
      imageUrl: product.imageUrl,
      status: product.status,
      vatRate: toNumber(product.vatRate),
      saleUnit: product.saleUnit,
      minPurchase: product.minPurchase,
      stock: product.stock,
      categoryId: product.categoryId,
      categoryName: product.category.name,
      brandName: product.brand?.name ?? null,
      price: priceByProduct.get(product.id) ?? null
    }))
  };
}

export async function getOrderFormData() {
  const { seller } = await getActiveUser();
  const [companies, customers, products] = await Promise.all([
    getCompaniesForSeller(),
    prisma.customer.findMany({ where: { sellerCustomers: { some: { sellerId: seller.id } }, status: "ACTIVE" }, orderBy: { name: "asc" } }),
    prisma.product.findMany({ where: { status: "ACTIVE" }, include: { company: true, category: true }, orderBy: { name: "asc" } })
  ]);

  const assignments = await prisma.customerPriceList.findMany({ include: { priceList: { include: { items: true } } } });
  const prices = assignments.flatMap((assignment: any) => assignment.priceList.items.map((item: any) => ({
    customerId: assignment.customerId,
    companyId: assignment.priceList.companyId,
    productId: item.productId,
    price: toNumber(item.price)
  })));

  return {
    seller,
    companies: companies.map((company: any) => ({ id: company.id, name: company.name })),
    customers: customers.map((customer: any) => ({ id: customer.id, name: customer.name, legalName: customer.legalName })),
    products: products.map((product: any) => ({
      id: product.id,
      companyId: product.companyId,
      sku: product.sku,
      name: product.name,
      categoryName: product.category.name,
      vatRate: toNumber(product.vatRate),
      minPurchase: product.minPurchase,
      saleUnit: product.saleUnit
    })),
    prices
  };
}

export async function getOrders() {
  const { seller } = await getActiveUser();
  return prisma.order.findMany({
    where: { sellerId: seller.id },
    include: { customer: true, company: true, items: true },
    orderBy: { createdAt: "desc" }
  });
}

export async function getOrderById(orderId: string) {
  return prisma.order.findUnique({
    where: { id: orderId },
    include: { customer: { include: { locations: true } }, company: true, seller: { include: { user: true } }, items: true, statusHistory: { orderBy: { createdAt: "asc" } } }
  });
}
