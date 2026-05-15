type OrderStatus = "DRAFT" | "SENT" | "RECEIVED" | "APPROVED" | "REJECTED" | "PROCESSED";
import { cn } from "@/lib/utils";

const labels: Record<OrderStatus, string> = { DRAFT: "Borrador", SENT: "Enviada", RECEIVED: "Recibida", APPROVED: "Aprobada", REJECTED: "Rechazada", PROCESSED: "Procesada" };

export function StatusBadge({ status }: { status: OrderStatus }) {
  return <span className={cn("inline-flex rounded-full px-3 py-1 text-xs font-bold", status === "DRAFT" ? "bg-amber-100 text-amber-800" : "bg-emerald-100 text-emerald-800")}>{labels[status]}</span>;
}
