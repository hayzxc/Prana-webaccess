"use client";

import { User } from "@/types";
import {
  createContext,
  useContext,
  useState,
  useEffect,
  type ReactNode,
} from "react";

import AOS from "aos";
import "aos/dist/aos.css";

interface AuthContextType {
  user: User | null;
  login: (email: string, password: string) => Promise<boolean>;
  logout: () => void;
  loading: boolean;
  getAllUsers: () => Promise<User[]>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {    
    AOS.init({
      duration: 1000, 
      once: true, 
    });
    
  }, []);

  useEffect(() => {
    // Check for stored user session
    const storedUser = localStorage.getItem("user");
    if (storedUser) {
      try {
        setUser(JSON.parse(storedUser));
      } catch (error) {
        console.error("Error parsing stored user:", error);
        localStorage.removeItem("user");
      }
    }
    setLoading(false);
  }, []);

  const login = async (email: string, password: string): Promise<boolean> => {
    console.log("[v0] Login attempt started", { email });
    try {
      const response = await fetch("/api/auth/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email, password }),
        credentials: "include",
      });

      console.log("[v0] Login API response status:", response.status);

      if (response.ok) {
        const data = await response.json();
        console.log("[v0] Login API response data:", data);

        if (data.success && data.data) {
          setUser(data.data);
          localStorage.setItem("user", JSON.stringify(data.data));
          console.log("[v0] User state updated successfully");
          return true;
        } else {
          console.log("[v0] Unexpected API response structure:", data);
          return false;
        }
      } else {
        const errorData = await response.json();
        console.log("[v0] Login failed with error:", errorData);
        return false;
      }
    } catch (error) {
      console.error("[v0] Login failed with exception:", error);
      return false;
    }
  };

  const logout = async () => {
    try {
      await fetch("/api/auth/logout", {
        method: "POST",
        credentials: "include",
      });
      setUser(null);
      localStorage.removeItem("user");
    } catch (error) {
      console.error("Logout failed:", error);
      // Still clear local state even if API call fails
      setUser(null);
      localStorage.removeItem("user");
    }
  };

  const getAllUsers = async (): Promise<User[]> => {
    try {
      const response = await fetch("/api/admin/users", {
        method: "GET",
        credentials: "include",
      });

      if (response.ok) {
        const data = await response.json();
        return data.users || [];
      }
      throw new Error("Failed to fetch users");
    } catch (error) {
      console.error("Error fetching users:", error);
      throw error;
    }
  };

  return (
    <AuthContext.Provider value={{ user, login, logout, loading, getAllUsers }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
}
