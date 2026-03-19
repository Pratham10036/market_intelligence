import {
  createContext,
  useContext,
  useEffect,
  useState,
  type ReactNode,
} from "react";
import { authApi } from "../api/auth";

type User = {
  id: string;
  email: string;
  name: string;
};

type AuthContextType = {
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  login: (accessToken: string) => void;
  logout: () => Promise<void>;
};

const AuthContext = createContext<AuthContextType>(null!);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  // On mount: if a token exists, fetch current user from /me.
  // If the token is expired or invalid, clear auth state gracefully.
  useEffect(() => {
    const token = localStorage.getItem("access_token");
    if (!token) {
      setIsLoading(false);
      return;
    }

    setIsAuthenticated(true);

    authApi.getCurrentUser(token).then((res) => {
      if (res.isSuccess && res.data?.id) {
        setUser(res.data);
      } else {
        // Token expired or invalid — clear auth state
        localStorage.removeItem("access_token");
        setIsAuthenticated(false);
        setUser(null);
      }
      setIsLoading(false);
    });
  }, []);

  const login = (accessToken: string) => {
    localStorage.setItem("access_token", accessToken);
    setIsAuthenticated(true);
  };

  const logout = async () => {
    const token = localStorage.getItem("access_token");
    if (token) {
      await authApi.logout(token);
    }
    localStorage.removeItem("access_token");
    setIsAuthenticated(false);
    setUser(null);
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        isAuthenticated,
        isLoading,
        login,
        logout,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  return useContext(AuthContext);
}
