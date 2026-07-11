import type { LucideIcon } from "lucide-react";
import {
  Activity,
  Bell,
  Bug,
  Flag,
  Heart,
  ImageIcon,
  LayoutDashboard,
  MessageSquare,
  ScrollText,
  Users,
} from "lucide-react";

export type AdminNavItem = {
  href: string;
  label: string;
  icon: LucideIcon;
  exact?: boolean;
};

export type AdminNavGroup = {
  label: string;
  items: AdminNavItem[];
};

export const adminNavGroups: AdminNavGroup[] = [
  {
    label: "Principal",
    items: [
      { href: "/admin", label: "Dashboard", icon: LayoutDashboard, exact: true },
      { href: "/admin/users", label: "Utilisateurs", icon: Users },
      { href: "/admin/matches", label: "Matchs", icon: Heart },
      { href: "/admin/chat", label: "Chat", icon: MessageSquare },
    ],
  },
  {
    label: "Modération",
    items: [
      { href: "/admin/reports", label: "Signalements", icon: Flag },
      { href: "/admin/bugs", label: "Bugs app", icon: Bug },
      { href: "/admin/moderation", label: "Modération contenu", icon: ImageIcon },
      { href: "/admin/notifications", label: "Notifications", icon: Bell },
    ],
  },
  {
    label: "Système",
    items: [
      { href: "/admin/health", label: "Infrastructure", icon: Activity },
      { href: "/admin/audit", label: "Journal d'audit", icon: ScrollText },
    ],
  },
];

export const adminNavItems = adminNavGroups.flatMap((g) => g.items);

export function getAdminPageTitle(pathname: string): string {
  if (pathname === "/admin") return "Dashboard";
  const match = adminNavItems.find(
    (item) =>
      item.exact
        ? pathname === item.href
        : pathname === item.href || pathname.startsWith(`${item.href}/`),
  );
  if (match) return match.label;
  if (pathname.startsWith("/admin/users/")) return "Profil utilisateur";
  if (pathname.startsWith("/admin/chat/")) return "Conversation";
  return "Administration";
}
