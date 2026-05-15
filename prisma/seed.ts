import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

async function main() {
  await prisma.orderStatusHistory.deleteMany();
  await prisma.orderItem.deleteMany();
  await prisma.order.deleteMany();
  await prisma.customerPriceList.deleteMany();
  await prisma.sellerCustomer.deleteMany();
  await prisma.sellerCompany.deleteMany();
  await prisma.priceListItem.deleteMany();
  await prisma.priceList.deleteMany();
  await prisma.productImage.deleteMany();
  await prisma.product.deleteMany();
  await prisma.category.deleteMany();
  await prisma.brand.deleteMany();
  await prisma.customerLocation.deleteMany();
  await prisma.customer.deleteMany();
  await prisma.sellerProfile.deleteMany();
  await prisma.company.deleteMany();
  await prisma.user.deleteMany();

  const [sellerA, sellerB] = await Promise.all([
    prisma.user.create({ data: { name: "Lucía Varela", email: "lucia@rutab2b.local", role: "SELLER", sellerProfile: { create: { phone: "+54 351 555-1001", region: "Centro" } } }, include: { sellerProfile: true } }),
    prisma.user.create({ data: { name: "Martín Ponce", email: "martin@rutab2b.local", role: "SELLER", sellerProfile: { create: { phone: "+54 11 5555-2002", region: "Buenos Aires" } } }, include: { sellerProfile: true } })
  ]);

  const hyundai = await prisma.company.create({ data: { name: "Hyundai Herramientas", legalName: "Hyundai Herramientas Argentina S.A.", taxId: "30-70000001-1" } });
  const canon = await prisma.company.create({ data: { name: "Canon", legalName: "Canon Argentina S.A.", taxId: "30-70000002-2" } });

  const [herramientas, energia, impresion, imagen] = await Promise.all([
    prisma.category.create({ data: { name: "Herramientas eléctricas", companyId: hyundai.id } }),
    prisma.category.create({ data: { name: "Energía y jardín", companyId: hyundai.id } }),
    prisma.category.create({ data: { name: "Impresión", companyId: canon.id } }),
    prisma.category.create({ data: { name: "Imagen y oficina", companyId: canon.id } })
  ]);

  const [hyundaiBrand, canonBrand] = await Promise.all([
    prisma.brand.create({ data: { name: "Hyundai", companyId: hyundai.id } }),
    prisma.brand.create({ data: { name: "Canon", companyId: canon.id } })
  ]);

  const productSeeds = [
    [hyundai.id, hyundaiBrand.id, herramientas.id, "HY-TAL18", "Taladro inalámbrico 18V", "Taladro con batería de litio y maletín", 21, "unidad", 1, 34],
    [hyundai.id, hyundaiBrand.id, herramientas.id, "HY-AM115", "Amoladora angular 115mm", "Amoladora compacta para uso profesional", 21, "unidad", 1, 40],
    [hyundai.id, hyundaiBrand.id, herramientas.id, "HY-SEN750", "Sierra sensitiva 750W", "Corte preciso para obra y taller", 21, "unidad", 1, 18],
    [hyundai.id, hyundaiBrand.id, energia.id, "HY-GEN3000", "Generador 3000W", "Generador portátil naftero monofásico", 21, "unidad", 1, 9],
    [hyundai.id, hyundaiBrand.id, energia.id, "HY-HID120", "Hidrolavadora 120 bar", "Equipo de limpieza con accesorios", 21, "unidad", 1, 22],
    [hyundai.id, hyundaiBrand.id, energia.id, "HY-COR52", "Cortadora de césped 52cc", "Cortadora robusta para espacios verdes", 21, "unidad", 1, 12],
    [canon.id, canonBrand.id, impresion.id, "CN-PIXMA-G3110", "PIXMA G3110", "Multifunción ink tank WiFi", 21, "unidad", 1, 25],
    [canon.id, canonBrand.id, impresion.id, "CN-LBP6030", "Laser LBP6030", "Impresora láser compacta monocromo", 21, "unidad", 1, 31],
    [canon.id, canonBrand.id, impresion.id, "CN-TINTA-BK", "Botella tinta GI-190 BK", "Tinta negra original para línea G", 21, "caja", 3, 180],
    [canon.id, canonBrand.id, imagen.id, "CN-EOS-R50", "Cámara EOS R50", "Mirrorless compacta para creadores", 21, "unidad", 1, 7],
    [canon.id, canonBrand.id, imagen.id, "CN-SCAN-LIDE", "Scanner LiDE 400", "Scanner plano USB de alta resolución", 21, "unidad", 1, 16],
    [canon.id, canonBrand.id, imagen.id, "CN-CALC-MP", "Calculadora MP120", "Calculadora de escritorio con impresión", 21, "unidad", 2, 44]
  ] as const;

  const products = [];
  for (const [companyId, brandId, categoryId, sku, name, shortDescription, vatRate, saleUnit, minPurchase, stock] of productSeeds) {
    products.push(await prisma.product.create({ data: { companyId, brandId, categoryId, sku, name, shortDescription, vatRate, saleUnit, minPurchase, stock, imageUrl: `/products/${sku}.jpg`, images: { create: { url: `/products/${sku}.jpg`, alt: name } } } }));
  }

  const [ferreteria, insumos, grafica, estudio] = await Promise.all([
    prisma.customer.create({ data: { name: "Ferretería Norte", legalName: "Ferretería Norte SRL", taxId: "30-71000001-4", email: "compras@ferrenorte.local", locations: { create: { name: "Sucursal Centro", address: "Av. Colón 1200", city: "Córdoba", province: "Córdoba" } } } }),
    prisma.customer.create({ data: { name: "Insumos del Sur", legalName: "Insumos del Sur S.A.", taxId: "30-71000002-5", email: "pedidos@insumosur.local", locations: { create: { name: "Depósito", address: "Ruta 3 km 42", city: "Bahía Blanca", province: "Buenos Aires" } } } }),
    prisma.customer.create({ data: { name: "Gráfica Central", legalName: "Gráfica Central S.H.", taxId: "30-71000003-6", email: "admin@graficacentral.local", locations: { create: { name: "Local", address: "San Martín 455", city: "Rosario", province: "Santa Fe" } } } }),
    prisma.customer.create({ data: { name: "Estudio Pixel", legalName: "Pixel Office SAS", taxId: "30-71000004-7", email: "hola@pixel.local", locations: { create: { name: "Oficina", address: "Humboldt 1700", city: "CABA", province: "Buenos Aires" } } } })
  ]);

  const [hyundaiMinorista, hyundaiMayorista, canonCanal] = await Promise.all([
    prisma.priceList.create({ data: { name: "Hyundai Minorista", companyId: hyundai.id } }),
    prisma.priceList.create({ data: { name: "Hyundai Mayorista", companyId: hyundai.id } }),
    prisma.priceList.create({ data: { name: "Canon Canal", companyId: canon.id } })
  ]);

  for (let index = 0; index < products.length; index += 1) {
    const product = products[index];
    if (product.companyId === hyundai.id) {
      const base = 48000 + index * 18500;
      await prisma.priceListItem.create({ data: { priceListId: hyundaiMinorista.id, productId: product.id, price: base } });
      await prisma.priceListItem.create({ data: { priceListId: hyundaiMayorista.id, productId: product.id, price: Math.round(base * 0.86) } });
    } else {
      const base = 36000 + index * 21000;
      await prisma.priceListItem.create({ data: { priceListId: canonCanal.id, productId: product.id, price: base } });
    }
  }

  await prisma.sellerCompany.createMany({ data: [
    { sellerId: sellerA.sellerProfile!.id, companyId: hyundai.id },
    { sellerId: sellerA.sellerProfile!.id, companyId: canon.id },
    { sellerId: sellerB.sellerProfile!.id, companyId: canon.id }
  ] });
  await prisma.sellerCustomer.createMany({ data: [
    { sellerId: sellerA.sellerProfile!.id, customerId: ferreteria.id },
    { sellerId: sellerA.sellerProfile!.id, customerId: insumos.id },
    { sellerId: sellerA.sellerProfile!.id, customerId: grafica.id },
    { sellerId: sellerA.sellerProfile!.id, customerId: estudio.id },
    { sellerId: sellerB.sellerProfile!.id, customerId: grafica.id },
    { sellerId: sellerB.sellerProfile!.id, customerId: estudio.id }
  ] });
  await prisma.customerPriceList.createMany({ data: [
    { customerId: ferreteria.id, priceListId: hyundaiMinorista.id },
    { customerId: insumos.id, priceListId: hyundaiMayorista.id },
    { customerId: grafica.id, priceListId: canonCanal.id },
    { customerId: estudio.id, priceListId: canonCanal.id }
  ] });

  console.log("Seed RutaB2B cargado: 2 empresas, 2 vendedores, 4 clientes, 12 productos y 3 listas de precios.");
}

main().finally(async () => prisma.$disconnect());
