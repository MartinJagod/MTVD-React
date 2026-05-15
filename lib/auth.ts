import { prisma } from "@/lib/prisma";

export async function getActiveUser() {
  const user = await prisma.user.findFirst({
    where: { role: "SELLER" },
    orderBy: { createdAt: "asc" },
    include: { sellerProfile: true }
  });

  if (!user || !user.sellerProfile) {
    throw new Error("No hay vendedor activo. Ejecutá el seed inicial.");
  }

  return { user, seller: user.sellerProfile };
}
