import { forwardRef } from "react";
import { ApprovalStatus } from "@/data/types";
import { CheckCircle2, Clock, AlertCircle } from "lucide-react";
import { cn } from "@/lib/utils";

const meta: Record<ApprovalStatus, { label: string; classes: string; Icon: typeof Clock }> = {
  pending: {
    label: "Pending review",
    classes: "bg-warning/10 text-warning border-warning/20",
    Icon: Clock,
  },
  approved: {
    label: "Approved",
    classes: "bg-success/10 text-success border-success/20",
    Icon: CheckCircle2,
  },
  needs_revision: {
    label: "Needs revision",
    classes: "bg-destructive/10 text-destructive border-destructive/20",
    Icon: AlertCircle,
  },
};

export const StatusBadge = forwardRef<HTMLSpanElement, { status: ApprovalStatus; className?: string }>(
  ({ status, className }, ref) => {
    const m = meta[status];
    const Icon = m.Icon;
    return (
      <span
        ref={ref}
        className={cn(
          "inline-flex items-center gap-1.5 rounded-full border px-2.5 py-0.5 text-xs font-medium",
          m.classes,
          className,
        )}
      >
        <Icon className="h-3.5 w-3.5" />
        {m.label}
      </span>
    );
  },
);
StatusBadge.displayName = "StatusBadge";
