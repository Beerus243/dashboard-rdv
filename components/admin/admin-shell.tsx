"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import {
  Activity,
  Bell,
  Bug,
  Flag,
  Heart,
  ImageIcon,
  LayoutDashboard,
  LogOut,
  MessageSquare,
  Moon,
  ScrollText,
  Shield,
  Sun,
  Users,
} from "lucide-react";
import { useAdminAuth } from "@/components/providers/admin-auth-provider";
import { useTheme } from "@/components/providers/theme-provider";
import { cn } from "@/lib/utils/cn";
import type { AdminRole } from "@/lib/types/admin";

const ROLE_LABELS: Record<AdminRole, string> = {
  SUPER_ADMIN: "Super Admin",
  ADMIN: "Admin",
  MODERATOR: "Modérateur",
  OBSERVER: "Observateur",
};

const navItems = [
  { href: "/admin", label: "Dashboard", icon: LayoutDashboard, exact: true },
  { href: "/admin/users", label: "Utilisateurs", icon: Users },
  { href: "/admin/reports", label: "Signalements", icon: Flag },
  { href: "/admin/bugs", label: "Bugs app", icon: Bug },
  { href: "/admin/moderation", label: "Modération", icon: ImageIcon },
  { href: "/admin/matches", label: "Matchs", icon: Heart },
  { href: "/admin/chat", label: "Chat", icon: MessageSquare },
  { href: "/admin/notifications", label: "Notifications", icon: Bell },
  { href: "/admin/health", label: "Infrastructure", icon: Activity },
  { href: "/admin/audit", label: "Audit", icon: ScrollText },
];

export function AdminShell({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const router = useRouter();
  const { admin, logout } = useAdminAuth();
  const { theme, toggleTheme } = useTheme();

  function handleLogout() {
    logout();
    router.replace("/admin/login");
  }

  return (
    <div className="admin-root flex min-h-screen bg-rdv-bg text-rdv-text">
      <aside className="hidden w-64 shrink-0 flex-col border-r border-rdv-divider bg-rdv-surface md:flex">
        <div className="flex items-center gap-2 border-b border-rdv-divider px-5 py-5">
          <div className="flex h-9 w-9 items-center justify-center rounded-[var(--rdv-radius-input)] bg-rdv-primary/10">
            <Shield className="h-5 w-5 text-rdv-primary" />
          </div>
          <div>
            <p className="text-sm font-extrabold text-rdv-text">RDV Admin</p>
            <p className="text-xs text-rdv-muted">Dashboard</p>
          </div>
        </div>
        <nav className="flex-1 space-y-1 overflow-y-auto p-3">
          {navItems.map(({ href, label, icon: Icon, exact }) => {
            const active = exact
              ? pathname === href
              : pathname === href || pathname.startsWith(`${href}/`);
            return (
              <Link
                key={href}
                href={href}
                className={cn(
                  "flex items-center gap-3 rounded-[var(--rdv-radius-input)] px-3 py-2.5 text-sm font-semibold transition",
                  active
                    ? "bg-rdv-message text-rdv-primary"
                    : "text-rdv-muted hover:bg-rdv-message hover:text-rdv-text",
                )}
              >
                <Icon className="h-4 w-4 shrink-0" />
                {label}
              </Link>
            );
          })}
        </nav>
        <div className="border-t border-rdv-divider p-3 text-xs text-rdv-muted">
          docs/admin-design-system.md
        </div>
      </aside>

      <div className="flex min-w-0 flex-1 flex-col">
        <header className="flex items-center justify-between border-b border-rdv-divider bg-rdv-surface px-4 py-3 md:px-6">
          <div className="flex items-center gap-2 md:hidden">
            <Shield className="h-5 w-5 text-rdv-primary" />
            <span className="font-bold">RDV Admin</span>
          </div>
          <div className="ml-auto flex items-center gap-2 sm:gap-3">
            <button
              type="button"
              onClick={toggleTheme}
              className="flex h-9 w-9 items-center justify-center rounded-[var(--rdv-radius-input)] border border-rdv-divider text-rdv-muted transition hover:bg-rdv-message hover:text-rdv-text"
              aria-label={
                theme === "dark" ? "Mode clair" : "Mode sombre"
              }
            >
              {theme === "dark" ? (
                <Sun className="h-4 w-4" />
              ) : (
                <Moon className="h-4 w-4" />
              )}
            </button>
            <div className="hidden text-right sm:block">
              <p className="text-sm font-bold">{admin?.name}</p>
              <p className="text-xs text-rdv-muted">
                {admin?.adminRole ? ROLE_LABELS[admin.adminRole] : ""}
              </p>
            </div>
            <button
              type="button"
              onClick={handleLogout}
              className="flex items-center gap-2 rounded-[var(--rdv-radius-input)] border border-rdv-divider px-3 py-2 text-sm font-semibold text-rdv-text transition hover:bg-rdv-message"
            >
              <LogOut className="h-4 w-4" />
              <span className="hidden sm:inline">Déconnexion</span>
            </button>
          </div>
        </header>
        <main className="flex-1 p-4 md:p-5">{children}</main>
      </div>
    </div>
  );
}
