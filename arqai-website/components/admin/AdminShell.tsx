"use client";

import { useState, useEffect } from "react";
import { useRouter, usePathname } from "next/navigation";
import AdminSidebar from "./AdminSidebar";

interface AdminShellProps {
  children: React.ReactNode;
}

export default function AdminShell({ children }: AdminShellProps) {
  const [isAuthenticated, setIsAuthenticated] = useState<boolean | null>(null);
  const router = useRouter();
  const pathname = usePathname();

  // Skip auth check for login page
  const isLoginPage = pathname === "/admin/login";

  useEffect(() => {
    if (isLoginPage) {
      setIsAuthenticated(true);
      return;
    }

    // Check authentication
    const checkAuth = async () => {
      try {
        const response = await fetch("/api/admin/leads", {
          method: "GET",
          credentials: "include",
        });

        if (response.status === 401) {
          setIsAuthenticated(false);
          router.push("/admin/login");
        } else {
          setIsAuthenticated(true);
        }
      } catch {
        setIsAuthenticated(false);
        router.push("/admin/login");
      }
    };

    checkAuth();
  }, [isLoginPage, router]);

  // Show loading while checking auth
  if (isAuthenticated === null && !isLoginPage) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-50">
        <div className="text-center">
          <div className="w-10 h-10 border-3 border-slate-300 border-t-slate-600 rounded-full animate-spin mx-auto mb-4" />
          <p className="text-slate-500 text-sm">Loading...</p>
        </div>
      </div>
    );
  }

  // Login page doesn't need the shell
  if (isLoginPage) {
    return <>{children}</>;
  }

  return (
    <div className="min-h-screen bg-slate-50">
      <AdminSidebar />
      <main className="ml-56 min-h-screen transition-all duration-300">
        {children}
      </main>
    </div>
  );
}
