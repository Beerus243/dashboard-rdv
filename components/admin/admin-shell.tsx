"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import {
  LogOut,
  Menu,
  Moon,
  Shield,
  Sun,
  X,
} from "lucide-react";
import { useAdminAuth } from "@/components/providers/admin-auth-provider";
import { useTheme } from "@/components/providers/theme-provider";
import {
  adminNavGroups,
  getAdminPageTitle,
} from "@/components/admin/admin-nav";
import { AdminUserAvatar } from "@/components/admin/admin-ui";
import { cn } from "@/lib/utils/cn";
import type { AdminRole } from "@/lib/types/admin";

const ROLE_LABELS: Record<AdminRole, string> = {
  SUPER_ADMIN: "Super Admin",
  ADMIN: "Admin",
  MODERATOR: "Modérateur",
  OBSERVER: "Observateur",
};

function NavLinks({
  pathname,
  onNavigate,
}: {
  pathname: string;
  onNavigate?: () => void;
}) {
  return (
    <div className="space-y-5">
      {adminNavGroups.map((group) => (
        <div key={group.label}>
          <p className="mb-2 px-3 text-[10px] font-bold uppercase tracking-wider text-rdv-muted">
            {group.label}
          </p>
          <div className="space-y-0.5">
            {group.items.map(({ href, label, icon: Icon, exact }) => {
              const active = exact
                ? pathname === href
                : pathname === href || pathname.startsWith(`${href}/`);
              return (
                <Link
                  key={href}
                  href={href}
                  onClick={onNavigate}
                  className={cn(
                    "flex items-center gap-3 rounded-[var(--rdv-radius-input)] px-3 py-2.5 text-sm font-semibold transition",
                    active
                      ? "bg-rdv-primary text-white shadow-sm"
                      : "text-rdv-muted hover:bg-rdv-message hover:text-rdv-text",
                  )}
                >
                  <Icon className="h-4 w-4 shrink-0" />
                  {label}
                </Link>
              );
            })}
          </div>
        </div>
      ))}
    </div>
  );
}

export function AdminShell({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const router = useRouter();
  const { admin, logout } = useAdminAuth();
  const { theme, toggleTheme } = useTheme();
  const [mobileOpen, setMobileOpen] = useState(false);
  const pageTitle = getAdminPageTitle(pathname);

  useEffect(() => {
    setMobileOpen(false);
  }, [pathname]);

  useEffect(() => {
    if (!mobileOpen) return;
    const prev = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = prev;
    };
  }, [mobileOpen]);

  function handleLogout() {
    logout();
    router.replace("/admin/login");
  }

  return (
    <div className="admin-root flex min-h-screen bg-rdv-bg text-rdv-text">
      <aside className="hidden w-64 shrink-0 flex-col border-r border-rdv-divider bg-rdv-surface lg:flex">
        <div className="flex items-center gap-3 border-b border-rdv-divider px-5 py-5">
          <div className="flex h-10 w-10 items-center justify-center rounded-[var(--rdv-radius-input)] bg-rdv-primary text-white">
            <Shield className="h-5 w-5" />
          </div>
          <div>
            <p className="text-sm font-extrabold">RDV Admin</p>
            <p className="text-xs text-rdv-muted">Console de gestion</p>
          </div>
        </div>
        <nav className="flex-1 overflow-y-auto p-3">
          <NavLinks pathname={pathname} />
        </nav>
        {admin ? (
          <div className="border-t border-rdv-divider p-4">
            <div className="flex items-center gap-3">
              <AdminUserAvatar name={admin.name} avatarUrl={admin.avatarUrl} size="sm" />
              <div className="min-w-0">
                <p className="truncate text-sm font-bold">{admin.name}</p>
                <p className="truncate text-xs text-rdv-muted">
                  {admin.adminRole ? ROLE_LABELS[admin.adminRole] : ""}
                </p>
              </div>
            </div>
          </div>
        ) : null}
      </aside>

      {mobileOpen ? (
        <div className="fixed inset-0 z-50 lg:hidden">
          <button
            type="button"
            className="absolute inset-0 bg-black/40 backdrop-blur-[2px]"
            aria-label="Fermer le menu"
            onClick={() => setMobileOpen(false)}
          />
          <aside className="absolute left-0 top-0 flex h-full w-[min(100%,18rem)] flex-col bg-rdv-surface shadow-xl">
            <div className="flex items-center justify-between border-b border-rdv-divider px-4 py-4">
              <div className="flex items-center gap-2">
                <Shield className="h-5 w-5 text-rdv-primary" />
                <span className="font-extrabold">RDV Admin</span>
              </div>
              <button
                type="button"
                onClick={() => setMobileOpen(false)}
                className="flex h-9 w-9 items-center justify-center rounded-[var(--rdv-radius-input)] text-rdv-muted hover:bg-rdv-message"
                aria-label="Fermer"
              >
                <X className="h-5 w-5" />
              </button>
            </div>
            <nav className="flex-1 overflow-y-auto p-3">
              <NavLinks pathname={pathname} onNavigate={() => setMobileOpen(false)} />
            </nav>
          </aside>
        </div>
      ) : null}

      <div className="flex min-w-0 flex-1 flex-col">
        <header className="sticky top-0 z-40 border-b border-rdv-divider bg-rdv-surface/95 backdrop-blur-md">
          <div className="flex items-center gap-3 px-4 py-3 md:px-6">
            <button
              type="button"
              onClick={() => setMobileOpen(true)}
              className="flex h-9 w-9 items-center justify-center rounded-[var(--rdv-radius-input)] border border-rdv-divider text-rdv-text hover:bg-rdv-message lg:hidden"
              aria-label="Ouvrir le menu"
            >
              <Menu className="h-5 w-5" />
            </button>

            <div className="min-w-0 flex-1 lg:hidden">
              <p className="truncate text-sm font-extrabold">{pageTitle}</p>
            </div>

            <div className="ml-auto flex items-center gap-2">
              <button
                type="button"
                onClick={toggleTheme}
                className="flex h-9 w-9 items-center justify-center rounded-[var(--rdv-radius-input)] border border-rdv-divider text-rdv-muted transition hover:bg-rdv-message hover:text-rdv-text"
                aria-label={theme === "dark" ? "Mode clair" : "Mode sombre"}
              >
                {theme === "dark" ? (
                  <Sun className="h-4 w-4" />
                ) : (
                  <Moon className="h-4 w-4" />
                )}
              </button>
              <button
                type="button"
                onClick={handleLogout}
                className="flex h-9 w-9 items-center justify-center rounded-[var(--rdv-radius-input)] border border-rdv-divider text-rdv-muted transition hover:border-rdv-nope/30 hover:bg-rdv-nope-surface hover:text-rdv-nope sm:hidden"
                aria-label="Déconnexion"
              >
                <LogOut className="h-4 w-4" />
              </button>
              <button
                type="button"
                onClick={handleLogout}
                className="hidden items-center gap-2 rounded-[var(--rdv-radius-input)] border border-rdv-divider px-3 py-2 text-sm font-semibold text-rdv-text transition hover:bg-rdv-message sm:flex"
              >
                <LogOut className="h-4 w-4" />
                Déconnexion
              </button>
            </div>
          </div>
        </header>

        <main className="mx-auto w-full max-w-7xl flex-1 p-4 md:p-6">
          {children}
        </main>
      </div>
    </div>
  );
}
