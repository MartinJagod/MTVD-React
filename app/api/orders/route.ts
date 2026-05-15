import { NextResponse } from "next/server";
import { createOrder } from "@/lib/orders";

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const order = await createOrder(body);
    return NextResponse.json({ id: order.id, orderNumber: order.orderNumber });
  } catch (error) {
    return NextResponse.json({ error: error instanceof Error ? error.message : "Error desconocido" }, { status: 400 });
  }
}
