import { Badge } from "@/components/ui/badge";
import type { DeliveryStatus } from "@/lib/mock-data";

const statusConfig: Record<DeliveryStatus, { label: string; className: string }> = {
  pending: { label: "Pendente", className: "bg-amber-100 text-amber-800 border-amber-200" },
  accepted: { label: "Aceita", className: "bg-blue-100 text-blue-800 border-blue-200" },
  collected: { label: "Coletada", className: "bg-purple-100 text-purple-800 border-purple-200" },
  delivered: { label: "Entregue", className: "bg-emerald-100 text-emerald-800 border-emerald-200" },
};

export const StatusBadge = ({ status }: { status: DeliveryStatus }) => {
  const config = statusConfig[status];
  return (
    <Badge variant="outline" className={config.className}>
      {config.label}
    </Badge>
  );
};
