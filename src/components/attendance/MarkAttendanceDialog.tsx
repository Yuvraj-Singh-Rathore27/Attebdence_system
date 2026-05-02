import { useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { X, UserPlus } from "lucide-react";
import { Employee, Status } from "@/lib/attendance";
import { cn } from "@/lib/utils";

const statusOptions: { value: Status; label: string; cls: string }[] = [
  { value: "Present", label: "Present", cls: "bg-success-soft text-success border-success/20" },
  { value: "Absent", label: "Absent", cls: "bg-destructive-soft text-destructive border-destructive/20" },
  { value: "OnLeave", label: "On Leave", cls: "bg-info-soft text-info border-info/20" },
  { value: "HalfDay", label: "Half Day", cls: "bg-warning-soft text-warning border-warning/20" },
  { value: "LateEarly", label: "Late/Early", cls: "bg-warning-soft text-warning border-warning/20" },
];

interface Props {
  open: boolean;
  onClose: () => void;
  onSubmit: (e: Omit<Employee, "id">) => void;
}

export const MarkAttendanceDialog = ({ open, onClose, onSubmit }: Props) => {
  const [name, setName] = useState("");
  const [role, setRole] = useState("");
  const [department, setDepartment] = useState("");
  const [status, setStatus] = useState<Status>("Present");
  const [punchIn, setPunchIn] = useState("");
  const [punchOut, setPunchOut] = useState("");

  const reset = () => {
    setName(""); setRole(""); setDepartment(""); setStatus("Present"); setPunchIn(""); setPunchOut("");
  };

  const submit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) return;
    const present = status === "Present" || status === "HalfDay" || status === "LateEarly";
    onSubmit({
      name: name.trim(),
      role: role.trim() || "Employee",
      department: department.trim() || "General",
      status,
      punchIn: present && punchIn ? punchIn : null,
      punchOut: status === "Present" && punchOut ? punchOut : null,
      durationMins: status === "Present" ? 540 : status === "HalfDay" ? 240 : 0,
      date: new Date().toISOString().slice(0, 10),
    });
    reset();
    onClose();
  };

  return (
    <AnimatePresence>
      {open && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-50 grid place-items-end sm:place-items-center bg-foreground/40 backdrop-blur-sm p-0 sm:p-4"
          onClick={onClose}
        >
          <motion.form
            onSubmit={submit}
            onClick={(e) => e.stopPropagation()}
            initial={{ opacity: 0, y: 40, scale: 0.96 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 40, scale: 0.96 }}
            transition={{ type: "spring", stiffness: 300, damping: 30 }}
            className="w-full sm:max-w-lg bg-card sm:rounded-3xl rounded-t-3xl shadow-elevated border border-border p-6 sm:p-7 max-h-[90vh] overflow-y-auto scrollbar-thin"
          >
            <div className="flex items-start justify-between mb-6">
              <div className="flex items-center gap-3">
                <div className="h-11 w-11 rounded-2xl bg-gradient-primary grid place-items-center shadow-glow">
                  <UserPlus className="h-5 w-5 text-primary-foreground" />
                </div>
                <div>
                  <h2 className="font-display text-xl font-bold">Mark Attendance</h2>
                  <p className="text-xs text-muted-foreground">Add a new employee record</p>
                </div>
              </div>
              <button
                type="button"
                onClick={onClose}
                className="h-9 w-9 grid place-items-center rounded-xl hover:bg-secondary text-muted-foreground"
              >
                <X className="h-4 w-4" />
              </button>
            </div>

            <div className="space-y-4">
              <Field label="Full Name *">
                <input
                  required
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="e.g. Pramod Kumar"
                  className="input-base"
                />
              </Field>
              <div className="grid grid-cols-2 gap-3">
                <Field label="Role">
                  <input value={role} onChange={(e) => setRole(e.target.value)} placeholder="e.g. Developer" className="input-base" />
                </Field>
                <Field label="Department">
                  <input value={department} onChange={(e) => setDepartment(e.target.value)} placeholder="e.g. IT" className="input-base" />
                </Field>
              </div>

              <Field label="Status">
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                  {statusOptions.map((s) => (
                    <button
                      key={s.value}
                      type="button"
                      onClick={() => setStatus(s.value)}
                      className={cn(
                        "px-3 py-2 rounded-xl text-xs font-semibold border-2 transition-all",
                        status === s.value ? s.cls : "border-border text-muted-foreground hover:border-foreground/20",
                      )}
                    >
                      {s.label}
                    </button>
                  ))}
                </div>
              </Field>

              <div className="grid grid-cols-2 gap-3">
                <Field label="Punch In">
                  <input value={punchIn} onChange={(e) => setPunchIn(e.target.value)} placeholder="09:00 AM" className="input-base" />
                </Field>
                <Field label="Punch Out">
                  <input value={punchOut} onChange={(e) => setPunchOut(e.target.value)} placeholder="06:00 PM" className="input-base" />
                </Field>
              </div>
            </div>

            <div className="flex items-center gap-3 mt-7">
              <button
                type="button"
                onClick={onClose}
                className="flex-1 h-11 rounded-xl border border-border font-semibold hover:bg-secondary transition-colors"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="flex-1 h-11 rounded-xl bg-gradient-primary text-primary-foreground font-semibold shadow-glow hover:opacity-95 active:scale-[0.98] transition-all"
              >
                Save Record
              </button>
            </div>
          </motion.form>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

const Field = ({ label, children }: { label: string; children: React.ReactNode }) => (
  <label className="block">
    <span className="block text-xs font-semibold text-foreground/70 mb-1.5">{label}</span>
    {children}
  </label>
);
