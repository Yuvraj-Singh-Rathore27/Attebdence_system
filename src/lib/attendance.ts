export type Status = "Present" | "Absent" | "OnLeave" | "HalfDay" | "LateEarly";

export interface Employee {
  id: string;
  name: string;
  role: string;
  department: string;
  status: Status;
  punchIn: string | null;
  punchOut: string | null;
  durationMins: number;
  date: string; // YYYY-MM-DD
}

const NAMES: Array<Omit<Employee, "id" | "status" | "punchIn" | "punchOut" | "durationMins" | "date">> = [
  { name: "Pramod Kumar", role: "Service Executive", department: "Service" },
  { name: "Khushab Chauhan", role: "IT Developer", department: "IT" },
  { name: "Gyanendra V Tripathi", role: "Head of Sales", department: "Sales" },
  { name: "Manish Awdhosh Bharti", role: "Admin Executive", department: "Admin" },
  { name: "Production Lead", role: "Production Supervisor", department: "Production" },
  { name: "Aaranyak Chakraborty", role: "Design Engineer", department: "Design" },
  { name: "Sanni Yadav", role: "Helper", department: "Production" },
  { name: "Rohit Kumar Yadav", role: "Operator", department: "Production" },
  { name: "Priya Sharma", role: "HR Manager", department: "HR" },
  { name: "Anjali Mehta", role: "Accountant", department: "Finance" },
  { name: "Vikram Singh", role: "Sales Executive", department: "Sales" },
  { name: "Neha Patel", role: "UI Designer", department: "Design" },
];

const todayStr = () => new Date().toISOString().slice(0, 10);

export const seedEmployees = (): Employee[] => {
  const statuses: Status[] = ["Present", "Absent", "OnLeave", "HalfDay", "LateEarly"];
  return NAMES.map((n, i) => {
    const status = i < 6 ? "OnLeave" : statuses[i % statuses.length];
    const present = status === "Present" || status === "HalfDay" || status === "LateEarly";
    return {
      ...n,
      id: crypto.randomUUID(),
      status,
      punchIn: present ? "09:0" + ((i % 5) + 1) + " AM" : null,
      punchOut: status === "Present" ? "06:1" + (i % 5) + " PM" : null,
      durationMins: status === "Present" ? 540 + (i % 30) : status === "HalfDay" ? 240 : 0,
      date: todayStr(),
    };
  });
};

const KEY = "attendance.employees.v1";

export const loadEmployees = (): Employee[] => {
  try {
    const raw = localStorage.getItem(KEY);
    if (!raw) return seedEmployees();
    return JSON.parse(raw);
  } catch {
    return seedEmployees();
  }
};

export const saveEmployees = (list: Employee[]) => {
  localStorage.setItem(KEY, JSON.stringify(list));
};

export const statusLabel = (s: Status) =>
  ({ Present: "Present", Absent: "Absent", OnLeave: "On Leave", HalfDay: "Half Day", LateEarly: "Late/Early" }[s]);

export const formatDuration = (mins: number) => {
  if (!mins) return "00 : 00 Hrs";
  const h = Math.floor(mins / 60);
  const m = mins % 60;
  return `${String(h).padStart(2, "0")} : ${String(m).padStart(2, "0")} Hrs`;
};

export const initials = (name: string) =>
  name.split(" ").map((n) => n[0]).slice(0, 2).join("").toUpperCase();

export const avatarColor = (name: string) => {
  const palette = [
    "from-rose-400 to-red-500",
    "from-amber-400 to-orange-500",
    "from-emerald-400 to-teal-500",
    "from-sky-400 to-blue-500",
    "from-violet-400 to-purple-500",
    "from-fuchsia-400 to-pink-500",
  ];
  let h = 0;
  for (const ch of name) h = (h * 31 + ch.charCodeAt(0)) >>> 0;
  return palette[h % palette.length];
};
