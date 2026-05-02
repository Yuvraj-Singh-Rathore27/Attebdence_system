import { motion } from "framer-motion";
import { cn } from "@/lib/utils";
import { Status } from "@/lib/attendance";

export type FilterKey = "All" | Status;

const tabs: { key: FilterKey; label: string }[] = [
  { key: "All", label: "All" },
  { key: "Present", label: "Full Day" },
  { key: "HalfDay", label: "Half Day" },
  { key: "Absent", label: "Absent" },
  { key: "LateEarly", label: "Late/Early" },
  { key: "OnLeave", label: "Time Off" },
];

export const Filters = ({
  active,
  onChange,
  counts,
}: {
  active: FilterKey;
  onChange: (k: FilterKey) => void;
  counts: Record<FilterKey, number>;
}) => (
  <div className="flex flex-wrap items-center gap-2 p-1.5 bg-secondary/60 rounded-2xl border border-border">
    {tabs.map((t) => {
      const isActive = active === t.key;
      return (
        <button
          key={t.key}
          onClick={() => onChange(t.key)}
          className="relative px-3 sm:px-4 py-2 rounded-xl text-xs sm:text-sm font-medium transition-colors"
        >
          {isActive && (
            <motion.span
              layoutId="filter-pill"
              className="absolute inset-0 bg-card shadow-soft rounded-xl"
              transition={{ type: "spring", stiffness: 400, damping: 32 }}
            />
          )}
          <span
            className={cn(
              "relative z-10 inline-flex items-center gap-2",
              isActive ? "text-foreground" : "text-muted-foreground hover:text-foreground",
            )}
          >
            {t.label}
            <span
              className={cn(
                "px-1.5 py-0.5 rounded-md text-[10px] font-semibold",
                isActive ? "bg-primary/10 text-primary" : "bg-muted text-muted-foreground",
              )}
            >
              {counts[t.key] ?? 0}
            </span>
          </span>
        </button>
      );
    })}
  </div>
);
