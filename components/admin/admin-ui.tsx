"use client";

import Image from "next/image";
import Link from "next/link";
import type { LucideIcon } from "lucide-react";
import {
  ChevronLeft,
  ChevronRight,
  Inbox,
  Search,
} from "lucide-react";
import { resolveImageUrl } from "@/lib/api/config";
import { cn } from "@/lib/utils/cn";

export function AdminPageHeader({
  title,
  description,
  actions,
  backHref,
}: {
  title: string;
  description?: string;
  actions?: React.ReactNode;
  backHref?: string;
}) {
  return (
    <div className="mb-6 flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
      <div className="min-w-0">
        {backHref ? (
          <Link
            href={backHref}
            className="mb-2 inline-flex items-center gap-1 text-sm font-semibold text-rdv-muted transition hover:text-rdv-primary"
          >
            <ChevronLeft className="h-4 w-4" />
            Retour
          </Link>
        ) : null}
        <h1 className="text-[22px] font-extrabold tracking-tight text-rdv-text">
          {title}
        </h1>
        {description ? (
          <p className="mt-1 max-w-2xl text-sm leading-relaxed text-rdv-muted">
            {description}
          </p>
        ) : null}
      </div>
      {actions ? (
        <div className="flex shrink-0 flex-wrap items-center gap-2">
          {actions}
        </div>
      ) : null}
    </div>
  );
}

export function AdminCard({
  children,
  className,
  padding = false,
}: {
  children: React.ReactNode;
  className?: string;
  padding?: boolean;
}) {
  return (
    <div
      className={cn(
        "rdv-card overflow-hidden transition-shadow hover:shadow-[0_8px_20px_rgba(0,0,0,0.06)]",
        padding && "p-4",
        className,
      )}
    >
      {children}
    </div>
  );
}

export function AdminSectionTitle({
  title,
  action,
  className,
}: {
  title: string;
  action?: React.ReactNode;
  className?: string;
}) {
  return (
    <div
      className={cn(
        "mb-4 flex items-center justify-between gap-3",
        className,
      )}
    >
      <h2 className="text-[13px] font-bold uppercase tracking-wide text-rdv-muted">
        {title}
      </h2>
      {action}
    </div>
  );
}

export function AdminSkeleton({
  className,
}: {
  className?: string;
}) {
  return (
    <div
      className={cn(
        "animate-pulse rounded-[var(--rdv-radius-input)] bg-rdv-divider/60",
        className,
      )}
    />
  );
}

export function AdminStatSkeleton({ count = 4 }: { count?: number }) {
  return (
    <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
      {Array.from({ length: count }).map((_, i) => (
        <AdminCard key={i} className="p-4">
          <AdminSkeleton className="mb-3 h-3 w-20" />
          <AdminSkeleton className="h-8 w-16" />
        </AdminCard>
      ))}
    </div>
  );
}

export function AdminTableSkeleton({ rows = 5 }: { rows?: number }) {
  return (
    <AdminCard className="p-4">
      <div className="space-y-3">
        {Array.from({ length: rows }).map((_, i) => (
          <AdminSkeleton key={i} className="h-10 w-full" />
        ))}
      </div>
    </AdminCard>
  );
}

export function AdminLoading({ label }: { label?: string }) {
  return (
    <div className="flex flex-col items-center justify-center gap-3 py-16">
      <div className="h-10 w-10 animate-spin rounded-full border-[3px] border-rdv-primary border-t-transparent" />
      {label ? (
        <p className="text-sm text-rdv-muted">{label}</p>
      ) : null}
    </div>
  );
}

export function AdminError({
  message,
  onRetry,
}: {
  message: string;
  onRetry?: () => void;
}) {
  return (
    <div className="rounded-[var(--rdv-radius-input)] border border-rdv-nope/30 bg-rdv-nope-surface px-4 py-4">
      <p className="text-sm font-semibold text-rdv-nope">{message}</p>
      {onRetry ? (
        <button
          type="button"
          onClick={onRetry}
          className="mt-3 text-sm font-bold text-rdv-primary hover:underline"
        >
          Réessayer
        </button>
      ) : null}
    </div>
  );
}

export function AdminEmpty({
  message,
  icon: Icon = Inbox,
}: {
  message: string;
  icon?: LucideIcon;
}) {
  return (
    <div className="flex flex-col items-center justify-center px-4 py-16 text-center">
      <div className="mb-4 flex h-14 w-14 items-center justify-center rounded-full bg-rdv-message">
        <Icon className="h-6 w-6 text-rdv-muted" />
      </div>
      <p className="max-w-sm text-sm text-rdv-muted">{message}</p>
    </div>
  );
}

export function AdminBadge({
  children,
  variant = "default",
  dot,
}: {
  children: React.ReactNode;
  variant?: "default" | "primary" | "success" | "warning" | "danger" | "info";
  dot?: boolean;
}) {
  const styles = {
    default: "bg-rdv-chip text-rdv-text",
    primary: "bg-rdv-primary text-white",
    success: "bg-rdv-like-surface text-rdv-like",
    warning: "bg-rdv-superlike-surface text-rdv-superlike",
    danger: "bg-rdv-nope-surface text-rdv-nope",
    info: "bg-rdv-message text-rdv-primary",
  };
  return (
    <span
      className={cn(
        "inline-flex items-center gap-1.5 rounded-full px-2.5 py-0.5 text-[11px] font-semibold",
        styles[variant],
      )}
    >
      {dot ? (
        <span
          className={cn(
            "h-1.5 w-1.5 rounded-full",
            variant === "success" && "bg-rdv-like",
            variant === "danger" && "bg-rdv-nope",
            variant === "primary" && "bg-white",
            variant === "default" && "bg-rdv-muted",
            variant === "warning" && "bg-rdv-superlike",
            variant === "info" && "bg-rdv-primary",
          )}
        />
      ) : null}
      {children}
    </span>
  );
}

export function AdminFilterTabs<T extends string>({
  options,
  value,
  onChange,
}: {
  options: { value: T; label: string }[];
  value: T;
  onChange: (v: T) => void;
}) {
  return (
    <div className="flex flex-wrap gap-2">
      {options.map((opt) => (
        <button
          key={opt.value}
          type="button"
          onClick={() => onChange(opt.value)}
          className={cn(
            "rounded-full px-3.5 py-2 text-[13px] font-semibold transition",
            value === opt.value
              ? "bg-rdv-primary text-white shadow-sm"
              : "border border-rdv-divider bg-rdv-surface text-rdv-muted hover:border-rdv-primary/30 hover:bg-rdv-message hover:text-rdv-text",
          )}
        >
          {opt.label}
        </button>
      ))}
    </div>
  );
}

export function AdminPillChip({
  children,
  selected,
  onClick,
}: {
  children: React.ReactNode;
  selected?: boolean;
  onClick?: () => void;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={cn(
        "rounded-full px-3 py-2 text-[13px] font-semibold transition",
        selected
          ? "bg-rdv-primary text-white"
          : "border border-rdv-divider bg-rdv-surface text-rdv-muted hover:bg-rdv-message",
      )}
    >
      {children}
    </button>
  );
}

export function AdminTable({
  headers,
  children,
}: {
  headers: string[];
  children: React.ReactNode;
}) {
  return (
    <div className="overflow-x-auto">
      <table className="w-full min-w-[640px] text-left text-sm">
        <thead>
          <tr className="border-b border-rdv-divider bg-rdv-bg/50 text-[11px] uppercase tracking-wide text-rdv-muted">
            {headers.map((h) => (
              <th key={h} className="px-4 py-3 font-semibold">
                {h}
              </th>
            ))}
          </tr>
        </thead>
        <tbody className="divide-y divide-rdv-divider [&_tr]:text-rdv-text [&_tr]:transition [&_tr:hover]:bg-rdv-message/70">
          {children}
        </tbody>
      </table>
    </div>
  );
}

export function AdminTableRow({
  children,
  className,
}: {
  children: React.ReactNode;
  className?: string;
}) {
  return <tr className={className}>{children}</tr>;
}

export function AdminPagination({
  page,
  hasMore,
  total,
  onPageChange,
}: {
  page: number;
  hasMore: boolean;
  total: number;
  onPageChange: (page: number) => void;
}) {
  return (
    <div className="flex flex-col gap-3 border-t border-rdv-divider px-4 py-3 text-sm text-rdv-muted sm:flex-row sm:items-center sm:justify-between">
      <span>
        {total} résultat{total > 1 ? "s" : ""}
      </span>
      <div className="flex items-center gap-2">
        <button
          type="button"
          disabled={page <= 1}
          onClick={() => onPageChange(page - 1)}
          className="inline-flex items-center gap-1 rounded-[var(--rdv-radius-input)] border border-rdv-divider px-3 py-1.5 text-rdv-text transition hover:bg-rdv-message disabled:opacity-40"
        >
          <ChevronLeft className="h-4 w-4" />
          Préc.
        </button>
        <span className="min-w-[4.5rem] text-center font-semibold text-rdv-text">
          Page {page}
        </span>
        <button
          type="button"
          disabled={!hasMore}
          onClick={() => onPageChange(page + 1)}
          className="inline-flex items-center gap-1 rounded-[var(--rdv-radius-input)] border border-rdv-divider px-3 py-1.5 text-rdv-text transition hover:bg-rdv-message disabled:opacity-40"
        >
          Suiv.
          <ChevronRight className="h-4 w-4" />
        </button>
      </div>
    </div>
  );
}

export function AdminInput({
  className,
  ...props
}: React.InputHTMLAttributes<HTMLInputElement>) {
  return (
    <input
      {...props}
      className={cn(
        "w-full rounded-[var(--rdv-radius-input)] border border-rdv-divider bg-rdv-surface px-3 py-2.5 text-sm text-rdv-text outline-none transition placeholder:text-rdv-muted/70 focus:border-rdv-primary focus:ring-[1.5px] focus:ring-rdv-primary/25",
        className,
      )}
    />
  );
}

export function AdminSearchInput({
  value,
  onChange,
  placeholder = "Rechercher…",
}: {
  value: string;
  onChange: (v: string) => void;
  placeholder?: string;
}) {
  return (
    <div className="relative w-full max-w-xs sm:max-w-sm">
      <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-rdv-muted" />
      <AdminInput
        type="search"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        className="pl-9"
      />
    </div>
  );
}

export function AdminButton({
  children,
  onClick,
  variant = "primary",
  disabled,
  type = "button",
  className,
  size = "md",
}: {
  children: React.ReactNode;
  onClick?: () => void;
  variant?: "primary" | "secondary" | "ghost" | "danger";
  disabled?: boolean;
  type?: "button" | "submit";
  className?: string;
  size?: "sm" | "md";
}) {
  const styles = {
    primary: "bg-rdv-primary text-white hover:bg-rdv-primary/90",
    secondary:
      "border border-rdv-divider bg-transparent text-rdv-primary hover:bg-rdv-message",
    ghost: "border border-rdv-divider text-rdv-text hover:bg-rdv-message",
    danger: "bg-rdv-nope text-white hover:bg-rdv-nope/90",
  };
  const sizes = {
    sm: "px-3 py-1.5 text-xs",
    md: "px-4 py-2 text-sm",
  };
  return (
    <button
      type={type}
      disabled={disabled}
      onClick={onClick}
      className={cn(
        "inline-flex items-center justify-center gap-2 rounded-[var(--rdv-radius-input)] font-bold transition disabled:opacity-50",
        styles[variant],
        sizes[size],
        className,
      )}
    >
      {children}
    </button>
  );
}

export function AdminStatCard({
  label,
  value,
  accent,
  icon: Icon,
  hint,
}: {
  label: string;
  value: number | string;
  accent?: "like" | "nope" | "primary";
  icon?: LucideIcon;
  hint?: string;
}) {
  const accentStyles = {
    like: {
      icon: "bg-rdv-like-surface text-rdv-like",
      value: "text-rdv-like",
    },
    nope: {
      icon: "bg-rdv-nope-surface text-rdv-nope",
      value: "text-rdv-nope",
    },
    primary: {
      icon: "bg-rdv-message text-rdv-primary",
      value: "text-rdv-primary",
    },
  };
  const style = accent ? accentStyles[accent] : null;

  return (
    <AdminCard className="p-4">
      <div className="flex items-start justify-between gap-3">
        <div className="min-w-0">
          <p className="text-[11px] font-semibold uppercase tracking-wide text-rdv-muted">
            {label}
          </p>
          <p
            className={cn(
              "mt-2 text-3xl font-extrabold tabular-nums text-rdv-text",
              style?.value,
            )}
          >
            {value}
          </p>
          {hint ? (
            <p className="mt-1 text-xs text-rdv-muted">{hint}</p>
          ) : null}
        </div>
        {Icon ? (
          <div
            className={cn(
              "flex h-10 w-10 shrink-0 items-center justify-center rounded-[var(--rdv-radius-input)]",
              style?.icon ?? "bg-rdv-message text-rdv-muted",
            )}
          >
            <Icon className="h-5 w-5" />
          </div>
        ) : null}
      </div>
    </AdminCard>
  );
}

export function AdminUserAvatar({
  name,
  avatarUrl,
  size = "md",
  online,
}: {
  name: string;
  avatarUrl?: string | null;
  size?: "sm" | "md" | "lg";
  online?: boolean;
}) {
  const sizes = {
    sm: "h-8 w-8 text-xs",
    md: "h-10 w-10 text-sm",
    lg: "h-12 w-12 text-base",
  };
  const initial = name.charAt(0).toUpperCase();

  return (
    <div className="relative shrink-0">
      {avatarUrl ? (
        <Image
          src={resolveImageUrl(avatarUrl)}
          alt=""
          width={48}
          height={48}
          className={cn("rounded-full object-cover", sizes[size])}
          unoptimized
        />
      ) : (
        <span
          className={cn(
            "flex items-center justify-center rounded-full bg-rdv-message font-bold text-rdv-primary",
            sizes[size],
          )}
        >
          {initial}
        </span>
      )}
      {online ? (
        <span className="absolute -bottom-0.5 -right-0.5 h-3 w-3 rounded-full border-2 border-rdv-surface bg-rdv-like" />
      ) : null}
    </div>
  );
}

export function AdminQuickAction({
  href,
  label,
  description,
  icon: Icon,
}: {
  href: string;
  label: string;
  description: string;
  icon: LucideIcon;
}) {
  return (
    <Link
      href={href}
      className="group flex items-center gap-3 rounded-[var(--rdv-radius-input)] border border-rdv-divider bg-rdv-surface p-3 transition hover:border-rdv-primary/30 hover:bg-rdv-message"
    >
      <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-[var(--rdv-radius-input)] bg-rdv-message text-rdv-primary transition group-hover:bg-rdv-primary group-hover:text-white">
        <Icon className="h-5 w-5" />
      </div>
      <div className="min-w-0">
        <p className="font-semibold text-rdv-text">{label}</p>
        <p className="truncate text-xs text-rdv-muted">{description}</p>
      </div>
      <ChevronRight className="ml-auto h-4 w-4 shrink-0 text-rdv-muted opacity-0 transition group-hover:opacity-100" />
    </Link>
  );
}

export function AdminHeroBanner({
  title,
  subtitle,
  action,
}: {
  title: string;
  subtitle?: string;
  action?: React.ReactNode;
}) {
  return (
    <div className="rdv-gradient-hero relative overflow-hidden rounded-[var(--rdv-radius-hero)] px-5 py-6 text-white shadow-[var(--rdv-shadow-card)] sm:px-6 sm:py-7">
      <div className="relative z-10 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h2 className="text-xl font-extrabold sm:text-2xl">{title}</h2>
          {subtitle ? (
            <p className="mt-1 text-sm text-white/85">{subtitle}</p>
          ) : null}
        </div>
        {action}
      </div>
      <div className="pointer-events-none absolute -right-8 -top-8 h-32 w-32 rounded-full bg-white/10" />
      <div className="pointer-events-none absolute -bottom-10 right-20 h-24 w-24 rounded-full bg-white/5" />
    </div>
  );
}

export function AdminListItem({
  href,
  avatar,
  title,
  subtitle,
  trailing,
}: {
  href?: string;
  avatar: React.ReactNode;
  title: React.ReactNode;
  subtitle?: React.ReactNode;
  trailing?: React.ReactNode;
}) {
  const content = (
    <>
      {avatar}
      <div className="min-w-0 flex-1">
        <div className="truncate font-semibold text-rdv-text">{title}</div>
        {subtitle ? (
          <div className="truncate text-xs text-rdv-muted">{subtitle}</div>
        ) : null}
      </div>
      {trailing}
    </>
  );

  const className =
    "flex items-center gap-3 rounded-[var(--rdv-radius-input)] px-2 py-2 transition hover:bg-rdv-message";

  if (href) {
    return (
      <Link href={href} className={className}>
        {content}
      </Link>
    );
  }

  return <div className={className}>{content}</div>;
}
