import { Status, statusLabel } from "@/lib/attendance";
import { cn } from "@/lib/utils";

const styles: Record<Status, string> = {
  Present: "bg-success-soft text-success",
  Absent: "bg-destructive-soft text-destructive",
  OnLeave: "bg-info-soft text-info",
  HalfDay: "bg-warning-soft text-warning",
  LateEarly: "bg-warning-soft text-warning",
};

export const StatusBadge = ({ status }: { status: Status }) => (
  <span
    className={cn(
      "inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold",
      styles[status],
    )}
  >
    <span className="h-1.5 w-1.5 rounded-full bg-current animate-pulse-soft" />
    {statusLabel(status)}
  </span>
);
