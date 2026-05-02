import { motion } from "framer-motion";
import { Users, UserCheck, UserX, CalendarClock, Clock } from "lucide-react";
import { Employee } from "@/lib/attendance";

const cards = [
  { key: "total", label: "Total", icon: Users, color: "text-foreground", bg: "bg-secondary" },
  { key: "present", label: "Present", icon: UserCheck, color: "text-success", bg: "bg-success-soft" },
  { key: "absent", label: "Absent", icon: UserX, color: "text-destructive", bg: "bg-destructive-soft" },
  { key: "leave", label: "On Leave", icon: CalendarClock, color: "text-info", bg: "bg-info-soft" },
  { key: "half", label: "Half / Late", icon: Clock, color: "text-warning", bg: "bg-warning-soft" },
] as const;

export const StatsBar = ({ employees }: { employees: Employee[] }) => {
  const counts = {
    total: employees.length,
    present: employees.filter((e) => e.status === "Present").length,
    absent: employees.filter((e) => e.status === "Absent").length,
    leave: employees.filter((e) => e.status === "OnLeave").length,
    half: employees.filter((e) => e.status === "HalfDay" || e.status === "LateEarly").length,
  };

  return (
    <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3 sm:gap-4">
      {cards.map((c, i) => {
        const Icon = c.icon;
        return (
          <motion.div
            key={c.key}
            initial={{ opacity: 0, y: 14 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.06, duration: 0.45, ease: [0.22, 1, 0.36, 1] }}
            whileHover={{ y: -3 }}
            className="group relative bg-card border border-border rounded-2xl p-4 sm:p-5 shadow-soft overflow-hidden"
          >
            <div className="flex items-center justify-between mb-3">
              <span className="text-xs font-medium text-muted-foreground uppercase tracking-wider">
                {c.label}
              </span>
              <div className={`h-8 w-8 rounded-lg ${c.bg} grid place-items-center`}>
                <Icon className={`h-4 w-4 ${c.color}`} />
              </div>
            </div>
            <div className="flex items-end justify-between">
              <span className="text-2xl sm:text-3xl font-display font-bold text-foreground">
                {counts[c.key as keyof typeof counts]}
              </span>
              <span className="text-[11px] text-muted-foreground">today</span>
            </div>
            <div className="absolute inset-x-0 bottom-0 h-0.5 bg-gradient-primary opacity-0 group-hover:opacity-100 transition-opacity" />
          </motion.div>
        );
      })}
    </div>
  );
};
