"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  Compass,
  Heart,
  Home,
  MessageCircle,
  User,
} from "lucide-react";
import { cn } from "@/lib/utils/cn";

const items = [
  { href: "/accueil", label: "Accueil", icon: Home },
  { href: "/explore", label: "Explorer", icon: Compass },
  { href: "/likes", label: "J'aime", icon: Heart },
  { href: "/messages", label: "Messages", icon: MessageCircle },
  { href: "/profile", label: "Profil", icon: User },
];

export function BottomNav() {
  const pathname = usePathname();

  return (
    <nav className="pointer-events-none fixed inset-x-0 bottom-0 z-50 px-3 pb-3 pt-1">
      <div
        className={cn(
          "pointer-events-auto mx-auto flex max-w-lg items-stretch rounded-[28px] border px-1.5 py-2 shadow-[0_8px_20px_rgba(0,0,0,0.08)]",
          "border-rdv-divider bg-rdv-surface",
        )}
      >
        {items.map(({ href, label, icon: Icon }) => {
          const active =
            pathname === href || pathname.startsWith(`${href}/`);
          return (
            <Link
              key={href}
              href={href}
              className={cn(
                "flex flex-1 flex-col items-center justify-center rounded-[18px] px-1 py-2 transition-colors duration-200",
                active
                  ? "bg-rdv-primary/10 text-rdv-primary dark:bg-white/10 dark:text-rdv-text-dark"
                  : "text-rdv-muted hover:text-rdv-text",
              )}
            >
              <Icon
                className={cn("h-6 w-6", active && "scale-105")}
                strokeWidth={active ? 2.4 : 2}
              />
              <span
                className={cn(
                  "mt-1 max-w-full truncate text-[10px]",
                  active ? "font-bold" : "font-medium",
                )}
              >
                {label}
              </span>
            </Link>
          );
        })}
      </div>
    </nav>
  );
}
