import { NavLink } from "react-router-dom";
import { Logo } from "@/components/Logo";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { useAuthStore } from "@/stores/auth";
import { cn, getInitials } from "@/lib/utils";

const navItems = [
  { to: "/", label: "Dashboard" },
  { to: "/transacoes", label: "Transações" },
  { to: "/categorias", label: "Categorias" },
];

export function Header() {
  const user = useAuthStore((s) => s.user);

  return (
    <header className="border-b border-border bg-card">
      <div className="mx-auto flex h-16 max-w-6xl items-center justify-between px-6">
        <Logo />
        <nav className="flex items-center gap-6">
          {navItems.map((item) => (
            <NavLink
              key={item.to}
              to={item.to}
              end={item.to === "/"}
              className={({ isActive }) =>
                cn(
                  "text-sm transition-colors",
                  isActive ? "font-semibold text-primary" : "font-normal text-muted-foreground hover:text-foreground"
                )
              }
            >
              {item.label}
            </NavLink>
          ))}
        </nav>
        <NavLink to="/perfil" aria-label="Perfil">
          <Avatar className="h-9 w-9">
            <AvatarFallback>{user ? getInitials(user.name) : "?"}</AvatarFallback>
          </Avatar>
        </NavLink>
      </div>
    </header>
  );
}
