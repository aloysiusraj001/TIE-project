import { ReactNode } from "react";
import { Link, NavLink, useNavigate } from "react-router-dom";
import { useApp } from "@/data/store";
import { Button } from "@/components/ui/button";
import { LogOut } from "lucide-react";
import { cn } from "@/lib/utils";

interface AppShellProps {
  nav: { to: string; label: string; icon: ReactNode }[];
  children: ReactNode;
  roleLabel: string;
}

const AppShell = ({ nav, children, roleLabel }: AppShellProps) => {
  const user = useApp((s) => s.users.find((u) => u.id === s.currentUserId));
  const signOut = useApp((s) => s.signOut);
  const navigate = useNavigate();

  if (!user) return null;

  const handleLogout = () => {
    void signOut().finally(() => navigate("/"));
  };

  return (
    <div className="flex min-h-screen bg-gradient-subtle">
      <aside className="hidden w-64 flex-col bg-sidebar text-sidebar-foreground lg:flex">
        <div className="flex items-center gap-2 px-6 py-6">
          <div className="flex h-9 w-9 items-center justify-center rounded-md">
            <img src="/favicon.svg" alt="Project Tracking" className="h-9 w-9" />
          </div>
          <div>
            <div className="font-serif text-lg font-semibold leading-tight">Project Tracking</div>
            <div className="text-[11px] uppercase tracking-wider text-sidebar-foreground/60">{roleLabel}</div>
          </div>
        </div>

        <nav className="flex-1 px-3 py-2">
          {nav.map((item) => (
            <NavLink
              key={item.to}
              to={item.to}
              end
              className={({ isActive }) =>
                cn(
                  "mb-1 flex items-center gap-3 rounded-md px-3 py-2.5 text-sm font-medium transition-colors",
                  isActive
                    ? "bg-sidebar-accent text-sidebar-accent-foreground"
                    : "text-sidebar-foreground/80 hover:bg-sidebar-accent/60 hover:text-sidebar-accent-foreground",
                )
              }
            >
              {item.icon}
              {item.label}
            </NavLink>
          ))}
        </nav>

        <div className="border-t border-sidebar-border px-4 py-4">
          <div className="mb-3 flex items-center gap-3">
            <span
              className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full text-xs font-semibold text-primary-foreground"
              style={{ backgroundColor: `hsl(${user.avatarColor})` }}
            >
              {user.name.split(" ").map((n) => n[0]).slice(0, 2).join("")}
            </span>
            <div className="min-w-0">
              <div className="truncate text-sm font-medium">{user.name}</div>
              <div className="truncate text-xs text-sidebar-foreground/60">{user.email}</div>
            </div>
          </div>
          <Button
            variant="ghost"
            size="sm"
            onClick={handleLogout}
            className="w-full justify-start text-sidebar-foreground/80 hover:bg-sidebar-accent hover:text-sidebar-accent-foreground"
          >
            <LogOut className="mr-2 h-4 w-4" /> Sign out
          </Button>
        </div>
      </aside>

      <div className="flex min-w-0 flex-1 flex-col">
        <header className="flex items-center justify-between border-b border-border bg-card px-6 py-4 lg:hidden">
          <Link to="/" className="flex items-center gap-2 font-serif font-semibold">
            <img src="/favicon.svg" alt="Project Tracking" className="h-5 w-5" /> Project Tracking
          </Link>
          <Button size="sm" variant="ghost" onClick={handleLogout}>
            <LogOut className="h-4 w-4" />
          </Button>
        </header>
        <main className="flex-1 overflow-auto">{children}</main>
      </div>
    </div>
  );
};

export default AppShell;
