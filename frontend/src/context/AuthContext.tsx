import {
  createContext,
  useContext,
  useState,
  useEffect,
  type ReactNode,
} from "react";
export type User = {
  id: string;
  name: string;
  role: "patient" | "doctor" | "admin";
  email: string;
};
type AuthContextType = {
  user: User | null;
  login: (email: string, password: string) => Promise<User | null>;
  logout: () => void;
  setUser: (user: User | null) => void;
  loading: boolean;
};
const AuthContext = createContext<AuthContextType | undefined>(undefined);
export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  useEffect(() => {
    const storedUser = localStorage.getItem("user");
    if (storedUser) {
      setUser(JSON.parse(storedUser));
    }
    setLoading(false);
  }, []);
  const login = async (
    email: string,
    password: string
  ): Promise<User | null> => {
    try {
      const res = await fetch("http://localhost:1111/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });
      const data = await res.json();
      if (!res.ok || !data.success) return null;
      const loggedInUser: User = {
        id: data.data.user.id,
        name: data.data.user.name,
        email: data.data.user.email,
        role: data.data.user.role,
      };
      setUser(loggedInUser);
      localStorage.setItem("user", JSON.stringify(loggedInUser));
      return loggedInUser;
    } catch {
      return null;
    }
  };
  const logout = () => {
    setUser(null);
    localStorage.removeItem("user");
  };
  return (
    <AuthContext.Provider value={{ user, login, logout, setUser, loading }}>
      {children}
    </AuthContext.Provider>
  );
}
export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) throw new Error("useAuth must be used inside AuthProvider");
  return context;
}
