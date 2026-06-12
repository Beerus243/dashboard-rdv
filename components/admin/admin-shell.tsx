"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import {
  Activity,
  Flag,
  LayoutDashboard,
  LogOut,
  MessageSquare,
  Shield,
  Users,
} from "lucide-react";
import { useAdminAuth } from "@/components/providers/admin-auth-provider";
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
  { href: "/admin/users", label: "Utilisateurs", icon: Users, disabled: true },
  { href: "/admin/reports", label: "Signalements", icon: Flag, disabled: true },
  { href: "/admin/messages", label: "Chat", icon: MessageSquare, disabled: true },
  { href: "/admin/health", label: "Infrastructure", icon: Activity, disabled: true },
];

export function AdminShell({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const router = useRouter();
  const { admin, logout } = useAdminAuth();

  function handleLogout() {
    logout();
    router.replace("/admin/login");
  }

  return (
    <div className="flex min-h-screen bg-slate-950 text-slate-100">
      <aside className="hidden w-64 shrink-0 flex-col border-r border-slate-800 bg-slate-900/50 md:flex">
        <div className="flex items-center gap-2 border-b border-slate-800 px-5 py-5">
          <Shield className="h-6 w-6 text-rdv-primary" />
          <div>
            <p className="text-sm font-extrabold">RDV Admin</p>
            <p className="text-xs text-slate-500">Dashboard</p>
          </div>
        </div>
        <nav className="flex-1 space-y-1 p-3">
          {navItems.map(({ href, label, icon: Icon, exact, disabled }) => {
            const active = exact ? pathname === href : pathname.startsWith(href);
            if (disabled) {
              return (
                <span
                  key={href}
                  className="flex cursor-not-allowed items-center gap-3 rounded-xl px-3 py-2.5 text-sm text-slate-600"
                  title="Bientôt disponible"
                >
                  <Icon className="h-4 w-4" />
                  {label}
                </span>
              );
            }
            return (
              <Link
                key={href}
                href={href}
                className={cn(
                  "flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-semibold transition",
                  active
                    ? "bg-rdv-primary/15 text-rdv-primary"
                    : "text-slate-400 hover:bg-slate-800 hover:text-white",
                )}
              >
                <Icon className="h-4 w-4" />
                {label}
              </Link>
            );
          })}
        </nav>
      </aside>

      <div className="flex min-w-0 flex-1 flex-col">
        <header className="flex items-center justify-between border-b border-slate-800 bg-slate-900/80 px-4 py-3 md:px-6">
          <div className="md:hidden flex items-center gap-2">
            <Shield className="h-5 w-5 text-rdv-primary" />
            <span className="font-bold">RDV Admin</span>
          </div>
          <div className="ml-auto flex items-center gap-3">
            <div className="text-right">
              <p className="text-sm font-bold">{admin?.name}</p>
              <p className="text-xs text-slate-500">
                {admin?.adminRole ? ROLE_LABELS[admin.adminRole] : ""}
              </p>
            </div>
            <button
              type="button"
              onClick={handleLogout}
              className="flex items-center gap-2 rounded-xl border border-slate-700 px-3 py-2 text-sm font-semibold text-slate-300 hover:bg-slate-800 hover:text-white"
            >
              <LogOut className="h-4 w-4" />
              <span className="hidden sm:inline">Déconnexion</span>
            </button>
          </div>
        </header>
        <main className="flex-1 p-4 md:p-6">{children}</main>
      </div>
    </div>
  );
}
