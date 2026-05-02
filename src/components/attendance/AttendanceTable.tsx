import { AnimatePresence, motion } from "framer-motion";
import { Check, X, Clock, CalendarOff, Trash2, FileText, AlertCircle } from "lucide-react";
import { Employee, Status, avatarColor, formatDuration, initials } from "@/lib/attendance";
import { StatusBadge } from "./StatusBadge";
import { cn } from "@/lib/utils";

const actions: { status: Status; label: string; icon: typeof Check; cls: string }[] = [
  { status: "Present", label: "Present", icon: Check, cls: "bg-success-soft text-success hover:bg-success hover:text-success-foreground" },
  { status: "Absent", label: "Absent", icon: X, cls: "bg-destructive-soft text-destructive hover:bg-destructive hover:text-destructive-foreground" },
  { status: "OnLeave", label: "Leave", icon: CalendarOff, cls: "bg-info-soft text-info hover:bg-info hover:text-info-foreground" },
  { status: "HalfDay", label: "Half", icon: Clock, cls: "bg-warning-soft text-warning hover:bg-warning hover:text-warning-foreground" },
];

const monthShort = (d: string) => {
  const date = new Date(d);
  return `${date.toLocaleString("en-US", { month: "short" })} ${date.getDate()}`;
};

interface Props {
  data: Employee[];
  onUpdate: (id: string, status: Status) => void;
  onDelete: (id: string) => void;
}

export const AttendanceTable = ({ data, onUpdate, onDelete }: Props) => {
  return (
    <div className="bg-card border border-border rounded-3xl shadow-soft overflow-hidden">
      {/* Desktop table */}
      <div className="hidden lg:block overflow-x-auto scrollbar-thin">
        <table className="w-full text-sm">
          <thead>
            <tr className="bg-secondary/50 text-[11px] uppercase tracking-wider text-muted-foreground">
              <th className="text-left font-semibold py-4 px-6">Employee</th>
              <th className="text-left font-semibold py-4 px-4">Date</th>
              <th className="text-left font-semibold py-4 px-4">Punch In</th>
              <th className="text-left font-semibold py-4 px-4">Punch Out</th>
              <th className="text-left font-semibold py-4 px-4">Status</th>
              <th className="text-left font-semibold py-4 px-4">Duration</th>
              <th className="text-right font-semibold py-4 px-6">Actions</th>
            </tr>
          </thead>
          <tbody>
            <AnimatePresence initial={false}>
              {data.map((emp, i) => (
                <motion.tr
                  key={emp.id}
                  layout
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, x: -20 }}
                  transition={{ delay: Math.min(i * 0.025, 0.3), duration: 0.35 }}
                  className="border-t border-border hover:bg-secondary/40 transition-colors group"
                >
                  <td className="py-4 px-6">
                    <div className="flex items-center gap-3">
                      <div
                        className={cn(
                          "h-10 w-10 rounded-xl bg-gradient-to-br grid place-items-center text-white font-semibold text-sm shadow-soft",
                          avatarColor(emp.name),
                        )}
                      >
                        {initials(emp.name)}
                      </div>
                      <div>
                        <div className="font-semibold text-foreground">{emp.name}</div>
                        <div className="text-xs text-muted-foreground">{emp.role}</div>
                      </div>
                    </div>
                  </td>
                  <td className="px-4 text-foreground/80 font-medium">{monthShort(emp.date)}</td>
                  <td className="px-4">
                    {emp.punchIn ? (
                      <span className="font-medium text-foreground/80">{emp.punchIn}</span>
                    ) : (
                      <span className="text-muted-foreground">—</span>
                    )}
                  </td>
                  <td className="px-4">
                    {emp.punchOut ? (
                      <span className="font-medium text-foreground/80">{emp.punchOut}</span>
                    ) : emp.punchIn && !emp.punchOut ? (
                      <span className="inline-flex items-center gap-1 text-destructive text-xs font-semibold">
                        <AlertCircle className="h-3 w-3" /> MISSING
                      </span>
                    ) : (
                      <span className="text-muted-foreground">—</span>
                    )}
                  </td>
                  <td className="px-4">
                    <StatusBadge status={emp.status} />
                  </td>
                  <td className="px-4 font-semibold text-foreground/80 tabular-nums">
                    {formatDuration(emp.durationMins)}
                  </td>
                  <td className="px-6">
                    <div className="flex items-center justify-end gap-1 opacity-60 group-hover:opacity-100 transition-opacity">
                      {actions.map((a) => (
                        <button
                          key={a.status}
                          onClick={() => onUpdate(emp.id, a.status)}
                          title={a.label}
                          className={cn(
                            "h-8 w-8 grid place-items-center rounded-lg transition-all hover:scale-110",
                            a.cls,
                          )}
                        >
                          <a.icon className="h-3.5 w-3.5" />
                        </button>
                      ))}
                      <button
                        onClick={() => onDelete(emp.id)}
                        title="Remove"
                        className="h-8 w-8 grid place-items-center rounded-lg text-muted-foreground hover:bg-destructive/10 hover:text-destructive transition-all hover:scale-110"
                      >
                        <Trash2 className="h-3.5 w-3.5" />
                      </button>
                    </div>
                  </td>
                </motion.tr>
              ))}
            </AnimatePresence>
          </tbody>
        </table>
      </div>

      {/* Mobile cards */}
      <div className="lg:hidden divide-y divide-border">
        <AnimatePresence initial={false}>
          {data.map((emp, i) => (
            <motion.div
              key={emp.id}
              layout
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, x: -20 }}
              transition={{ delay: Math.min(i * 0.03, 0.3) }}
              className="p-4 sm:p-5"
            >
              <div className="flex items-start justify-between gap-3 mb-3">
                <div className="flex items-center gap-3 min-w-0">
                  <div
                    className={cn(
                      "h-11 w-11 shrink-0 rounded-xl bg-gradient-to-br grid place-items-center text-white font-semibold shadow-soft",
                      avatarColor(emp.name),
                    )}
                  >
                    {initials(emp.name)}
                  </div>
                  <div className="min-w-0">
                    <div className="font-semibold text-foreground truncate">{emp.name}</div>
                    <div className="text-xs text-muted-foreground truncate">{emp.role}</div>
                  </div>
                </div>
                <StatusBadge status={emp.status} />
              </div>
              <div className="grid grid-cols-3 gap-2 text-xs mb-3">
                <div className="bg-secondary/60 rounded-lg px-2 py-1.5">
                  <div className="text-muted-foreground text-[10px] uppercase">In</div>
                  <div className="font-semibold text-foreground">{emp.punchIn ?? "—"}</div>
                </div>
                <div className="bg-secondary/60 rounded-lg px-2 py-1.5">
                  <div className="text-muted-foreground text-[10px] uppercase">Out</div>
                  <div className="font-semibold text-foreground">{emp.punchOut ?? "—"}</div>
                </div>
                <div className="bg-secondary/60 rounded-lg px-2 py-1.5">
                  <div className="text-muted-foreground text-[10px] uppercase">Hrs</div>
                  <div className="font-semibold text-foreground tabular-nums">
                    {formatDuration(emp.durationMins).replace(" Hrs", "")}
                  </div>
                </div>
              </div>
              <div className="flex items-center gap-1.5">
                {actions.map((a) => (
                  <button
                    key={a.status}
                    onClick={() => onUpdate(emp.id, a.status)}
                    className={cn(
                      "flex-1 inline-flex items-center justify-center gap-1 px-2 py-2 rounded-lg text-xs font-semibold transition-all active:scale-95",
                      a.cls,
                    )}
                  >
                    <a.icon className="h-3.5 w-3.5" />
                    <span className="hidden sm:inline">{a.label}</span>
                  </button>
                ))}
                <button
                  onClick={() => onDelete(emp.id)}
                  className="h-9 w-9 grid place-items-center rounded-lg text-muted-foreground bg-secondary/60 active:scale-95"
                >
                  <Trash2 className="h-3.5 w-3.5" />
                </button>
              </div>
            </motion.div>
          ))}
        </AnimatePresence>
      </div>

      {data.length === 0 && (
        <div className="py-16 text-center">
          <FileText className="h-10 w-10 mx-auto text-muted-foreground/50 mb-3" />
          <p className="text-muted-foreground font-medium">No records found</p>
          <p className="text-xs text-muted-foreground/70 mt-1">Try a different filter or search term</p>
        </div>
      )}
    </div>
  );
};
