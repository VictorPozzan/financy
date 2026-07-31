import { Outlet } from "react-router-dom";
import { Header } from "@/components/Header";
import { useAuthStore } from "@/stores/auth";

export function Layout() {
  const isAuthenticated = useAuthStore((s) => s.isAuthenticated);

  return (
    <div className="min-h-screen">
      {isAuthenticated && <Header />}
      <main>
        <Outlet />
      </main>
    </div>
  );
}
