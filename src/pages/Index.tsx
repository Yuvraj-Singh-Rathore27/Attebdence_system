import { useEffect, useState } from "react";
import { Login } from "./Login";
import { Dashboard } from "./Dashboard";

const Index = () => {
  const [user, setUser] = useState<string | null>(null);

  useEffect(() => {
    const session = localStorage.getItem("attendance.session");
    if (session) setUser(session);
  }, []);

  const logout = () => {
    localStorage.removeItem("attendance.session");
    setUser(null);
  };

  return user ? <Dashboard user={user} onLogout={logout} /> : <Login onLogin={setUser} />;
};

export default Index;
