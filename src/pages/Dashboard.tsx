import { useEffect, useMemo, useState } from "react";
import { motion } from "framer-motion";
import {
  Search, RotateCw, RefreshCw, Download, Plus, Calendar,
  Fingerprint, LogOut, Bell, ChevronDown,
} from "lucide-react";
import { Employee, Status, loadEmployees, saveEmployees } from "@/lib/attendance";
import { StatsBar } from "@/components/attendance/StatsBar";
import { Filters, FilterKey } from "@/components/attendance/Filters";
import { AttendanceTable } from "@/components/attendance/AttendanceTable";
import { MarkAttendanceDialog } from "@/components/attendance/MarkAttendanceDialog";
import { toast } from "sonner";

export const Dashboard = ({ user, onLogout }: { user: string; onLogout: () => void }) => {
  const [employees, setEmployees] = useState<Employee[]>(() => loadEmployees());
  const [filter, setFilter] = useState<FilterKey>("All");
  const [search, setSearch] = useState("");
  const [department, setDepartment] = useState<string>("All");
  const [open, setOpen] = useState(false);

  useEffect(() => { saveEmployees(employees); }, [employees]);

  const departments = useMemo(
    () => ["All", ...Array.from(new Set(employees.map((e) => e.department)))],
    [employees],
  );

  const filtered = useMemo(() => {
    return employees.filter((e) => {
      const matchSearch = e.name.toLowerCase().includes(search.toLowerCase());
      const matchDept = department === "All" || e.department === department;
      const matchFilter = filter === "All" || e.status === filter;
      return matchSearch && matchDept && matchFilter;
    });
  }, [employees, search, department, filter]);

  const counts = useMemo(() => ({
    All: employees.length,
    Present: employees.filter((e) => e.status === "Present").length,
    Absent: employees.filter((e) => e.status === "Absent").length,
    OnLeave: employees.filter((e) => e.status === "OnLeave").length,
    HalfDay: employees.filter((e) => e.status === "HalfDay").length,
    LateEarly: employees.filter((e) => e.status === "LateEarly").length,
  }), [employees]) as Record<FilterKey, number>;

  const updateStatus = (id: string, status: Status) => {
    setEmployees((prev) =>
      prev.map((e) => {
        if (e.id !== id) return e;
        const present = status === "Present" || status === "HalfDay" || status === "LateEarly";
        return {
          ...e,
          status,
          punchIn: present ? e.punchIn ?? new Date().toLocaleTimeString("en-US", { hour: "2-digit", minute: "2-digit" }) : null,
          punchOut: status === "Present" ? e.punchOut : null,
          durationMins: status === "Present" ? e.durationMins || 540 : status === "HalfDay" ? 240 : 0,
        };
      }),
    );
    toast.success(`Marked as ${status}`);
  };

  const removeEmployee = (id: string) => {
    setEmployees((prev) => prev.filter((e) => e.id !== id));
    toast.success("Record removed");
  };

  const addEmployee = (e: Omit<Employee, "id">) => {
    setEmployees((prev) => [{ ...e, id: crypto.randomUUID() }, ...prev]);
    toast.success("Attendance added");
  };

  const exportCsv = () => {
    const rows = [
      ["Name", "Role", "Department", "Date", "Status", "Punch In", "Punch Out", "Duration (mins)"],
      ...filtered.map((e) => [e.name, e.role, e.department, e.date, e.status, e.punchIn ?? "", e.punchOut ?? "", String(e.durationMins)]),
    ];
    const csv = rows.map((r) => r.map((c) => `"${c}"`).join(",")).join("\n");
    const blob = new Blob([csv], { type: "text/csv" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url; a.download = "attendance.csv"; a.click();
    URL.revokeObjectURL(url);
    toast.success("Exported CSV");
  };

  const sync = () => {
    toast.success("Synced with cloud");
  };

  const today = new Date().toLocaleDateString("en-GB").split("/").join("-");

  return (
    <div className="min-h-screen bg-background gradient-mesh">
      {/* Top nav */}
      <header className="sticky top-0 z-30 glass border-b border-border">
        <div className="max-w-[1400px] mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between gap-4">
          <div className="flex items-center gap-2.5 font-display font-bold text-lg">
            <div className="h-9 w-9 rounded-xl bg-gradient-primary grid place-items-center text-primary-foreground shadow-glow">
              <Fingerprint className="h-4 w-4" />
            </div>
            <span className="hidden sm:inline">Attendly</span>
          </div>
          <div className="flex items-center gap-2">
            <button className="hidden sm:grid h-9 w-9 place-items-center rounded-xl hover:bg-secondary text-muted-foreground relative">
              <Bell className="h-4 w-4" />
              <span className="absolute top-2 right-2 h-1.5 w-1.5 rounded-full bg-primary" />
            </button>
            <div className="flex items-center gap-2 pl-2 pr-1 py-1 rounded-xl hover:bg-secondary cursor-pointer">
              <div className="h-7 w-7 rounded-lg bg-gradient-to-br from-primary to-primary-glow grid place-items-center text-primary-foreground text-xs font-bold">
                {user.charAt(0).toUpperCase()}
              </div>
              <span className="hidden sm:inline text-sm font-semibold">Admin</span>
              <ChevronDown className="h-3.5 w-3.5 text-muted-foreground hidden sm:inline" />
            </div>
            <button
              onClick={onLogout}
              className="h-9 w-9 grid place-items-center rounded-xl hover:bg-destructive-soft text-muted-foreground hover:text-destructive transition-colors"
              title="Logout"
            >
              <LogOut className="h-4 w-4" />
            </button>
          </div>
        </div>
      </header>

      <main className="max-w-[1400px] mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8 space-y-6">
        {/* Page header */}
        <motion.div
          initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.4 }}
          className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4"
        >
          <div className="flex items-start gap-3">
            <div className="h-11 w-11 rounded-2xl bg-primary-soft bg-destructive-soft grid place-items-center text-primary">
              <Calendar className="h-5 w-5" />
            </div>
            <div>
              <h1 className="font-display text-2xl sm:text-3xl font-bold leading-tight">Attendance</h1>
              <p className="text-xs sm:text-sm text-muted-foreground font-medium">
                Employee logs &amp; real-time stats
              </p>
            </div>
          </div>

          <div className="flex flex-wrap items-center gap-2">
            <button
              onClick={sync}
              className="inline-flex items-center gap-2 h-10 px-3.5 rounded-xl bg-card border border-border text-sm font-semibold hover:bg-secondary transition-colors"
            >
              <RefreshCw className="h-4 w-4" /> <span className="hidden sm:inline">Sync</span>
            </button>
            <button
              onClick={() => setEmployees(loadEmployees())}
              className="inline-flex items-center gap-2 h-10 px-3.5 rounded-xl bg-card border border-border text-sm font-semibold hover:bg-secondary transition-colors"
              title="Reload"
            >
              <RotateCw className="h-4 w-4" />
            </button>
            <button
              onClick={exportCsv}
              className="inline-flex items-center gap-2 h-10 px-3.5 rounded-xl bg-card border border-border text-sm font-semibold hover:bg-secondary transition-colors"
            >
              <Download className="h-4 w-4" /> <span className="hidden sm:inline">Export</span>
            </button>
            <motion.button
              whileHover={{ y: -2 }} whileTap={{ scale: 0.97 }}
              onClick={() => setOpen(true)}
              className="inline-flex items-center gap-2 h-10 px-4 rounded-xl bg-gradient-primary text-primary-foreground text-sm font-semibold shadow-glow"
            >
              <Plus className="h-4 w-4" /> Mark Attendance
            </motion.button>
          </div>
        </motion.div>

        {/* Stats */}
        <StatsBar employees={employees} />

        {/* Toolbar */}
        <div className="bg-card border border-border rounded-2xl p-3 sm:p-4 shadow-soft flex flex-col lg:flex-row lg:items-center gap-3">
          <div className="relative flex-1 min-w-0">
            <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <input
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search employees…"
              className="input-base pl-10 bg-secondary/40"
            />
          </div>
          <div className="flex items-center gap-2 flex-wrap">
            <div className="relative">
              <select
                value={department}
                onChange={(e) => setDepartment(e.target.value)}
                className="input-base appearance-none pr-9 min-w-[170px] bg-card"
              >
                {departments.map((d) => (
                  <option key={d} value={d}>
                    {d === "All" ? "All Departments" : d}
                  </option>
                ))}
              </select>
              <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground pointer-events-none" />
            </div>
            <div className="hidden sm:flex items-center gap-2 h-11 px-3.5 rounded-xl bg-secondary/60 border border-border text-sm font-semibold">
              <Calendar className="h-4 w-4 text-muted-foreground" /> {today}
            </div>
          </div>
        </div>

        {/* Filters */}
        <Filters active={filter} onChange={setFilter} counts={counts} />

        {/* Table */}
        <AttendanceTable data={filtered} onUpdate={updateStatus} onDelete={removeEmployee} />

        <p className="text-center text-xs text-muted-foreground pt-4">
          Built with care · Data persists locally on your device
        </p>
      </main>

      <MarkAttendanceDialog open={open} onClose={() => setOpen(false)} onSubmit={addEmployee} />
    </div>
  );
};
