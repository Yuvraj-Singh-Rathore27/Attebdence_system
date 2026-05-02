import { useState } from "react";
import { motion } from "framer-motion";
import { Fingerprint, Mail, Lock, Eye, EyeOff, ArrowRight, Sparkles } from "lucide-react";

export const Login = ({ onLogin }: { onLogin: (email: string) => void }) => {
  const [email, setEmail] = useState("admin@gmail.com");
  const [password, setPassword] = useState("admin@1234");
  const [show, setShow] = useState(false);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const submit = (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setLoading(true);
    setTimeout(() => {
      if (email === "admin@gmail.com" && password === "admin@1234") {
        localStorage.setItem("attendance.session", email);
        onLogin(email);
      } else {
        setError("Invalid email or password");
        setLoading(false);
      }
    }, 600);
  };

  return (
    <div className="min-h-screen w-full grid lg:grid-cols-2 bg-background">
      {/* Left brand panel */}
      <div className="hidden lg:flex relative overflow-hidden bg-gradient-primary text-primary-foreground p-12 flex-col justify-between">
        <div className="absolute inset-0 opacity-30 mix-blend-overlay"
             style={{ backgroundImage: "radial-gradient(at 20% 20%, white 0px, transparent 50%), radial-gradient(at 80% 90%, white 0px, transparent 50%)" }} />
        <div className="relative">
          <div className="flex items-center gap-2 font-display font-bold text-2xl">
            <div className="h-10 w-10 rounded-xl bg-white/15 backdrop-blur grid place-items-center">
              <Fingerprint className="h-5 w-5" />
            </div>
            Attendly
          </div>
        </div>
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7 }}
          className="relative max-w-md"
        >
          <div className="inline-flex items-center gap-2 bg-white/15 backdrop-blur px-3 py-1.5 rounded-full text-xs font-semibold mb-5">
            <Sparkles className="h-3.5 w-3.5" /> Smarter workforce tracking
          </div>
          <h1 className="font-display text-4xl xl:text-5xl font-extrabold leading-tight text-balance">
            Attendance, simplified for the modern workplace.
          </h1>
          <p className="mt-4 text-primary-foreground/85 leading-relaxed">
            Real-time check-ins, beautiful insights and effortless team management — all in one elegant dashboard.
          </p>
        </motion.div>
        <div className="relative grid grid-cols-3 gap-3 max-w-md">
          {[
            { v: "98%", l: "Attendance" },
            { v: "120+", l: "Teams" },
            { v: "24/7", l: "Sync" },
          ].map((s, i) => (
            <motion.div
              key={s.l}
              initial={{ opacity: 0, y: 14 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 + i * 0.1 }}
              className="bg-white/10 backdrop-blur rounded-2xl p-4 border border-white/15"
            >
              <div className="font-display font-bold text-2xl">{s.v}</div>
              <div className="text-xs text-primary-foreground/80">{s.l}</div>
            </motion.div>
          ))}
        </div>
      </div>

      {/* Right form */}
      <div className="flex items-center justify-center p-6 sm:p-10 gradient-mesh">
        <motion.form
          onSubmit={submit}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="w-full max-w-md bg-card rounded-3xl shadow-elevated border border-border p-7 sm:p-9"
        >
          <div className="lg:hidden flex items-center gap-2 font-display font-bold text-xl mb-8">
            <div className="h-9 w-9 rounded-xl bg-gradient-primary grid place-items-center text-primary-foreground">
              <Fingerprint className="h-4 w-4" />
            </div>
            Attendly
          </div>
          <h2 className="font-display text-2xl sm:text-3xl font-bold">Welcome back</h2>
          <p className="text-muted-foreground text-sm mt-1.5 mb-7">
            Sign in to access your attendance dashboard
          </p>

          <div className="space-y-4">
            <label className="block">
              <span className="block text-xs font-semibold text-foreground/70 mb-1.5">Email</span>
              <div className="relative">
                <Mail className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="you@company.com"
                  className="input-base pl-10"
                  required
                />
              </div>
            </label>
            <label className="block">
              <span className="block text-xs font-semibold text-foreground/70 mb-1.5">Password</span>
              <div className="relative">
                <Lock className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <input
                  type={show ? "text" : "password"}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Your password"
                  className="input-base pl-10 pr-10"
                  required
                />
                <button
                  type="button"
                  onClick={() => setShow((s) => !s)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 h-7 w-7 grid place-items-center rounded-md text-muted-foreground hover:text-foreground"
                >
                  {show ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                </button>
              </div>
            </label>

            {error && (
              <motion.div
                initial={{ opacity: 0, y: -4 }}
                animate={{ opacity: 1, y: 0 }}
                className="text-xs font-semibold text-destructive bg-destructive-soft px-3 py-2 rounded-lg"
              >
                {error}
              </motion.div>
            )}

            <button
              type="submit"
              disabled={loading}
              className="group w-full h-12 rounded-xl bg-gradient-primary text-primary-foreground font-semibold shadow-glow hover:opacity-95 active:scale-[0.98] transition-all inline-flex items-center justify-center gap-2 disabled:opacity-70"
            >
              {loading ? "Signing in…" : "Sign in"}
              {!loading && <ArrowRight className="h-4 w-4 group-hover:translate-x-0.5 transition-transform" />}
            </button>
          </div>

          <div className="mt-6 p-3 rounded-xl bg-secondary/60 border border-border text-xs text-muted-foreground">
            <span className="font-semibold text-foreground">Demo:</span> admin@gmail.com / admin@1234
          </div>
        </motion.form>
      </div>
    </div>
  );
};
