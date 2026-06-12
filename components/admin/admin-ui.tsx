"use client";

import { cn } from "@/lib/utils/cn";

export function AdminPageHeader({
  title,
  description,
  actions,
}: {
  title: string;
  description?: string;
  actions?: React.ReactNode;
}) {
  return (
    <div className="mb-6 flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
      <div>
        <h1 className="text-[22px] font-extrabold text-rdv-text">{title}</h1>
        {description ? (
          <p className="mt-1 text-sm text-rdv-muted">{description}</p>
        ) : null}
      </div>
      {actions ? <div className="flex shrink-0 gap-2">{actions}</div> : null}
    </div>
  );
}

export function AdminCard({
  children,
  className,
}: {
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <div className={cn("rdv-card overflow-hidden", className)}>{children}</div>
  );
}

export function AdminLoading() {
  return (
    <div className="flex justify-center py-16">
      <div className="h-10 w-10 animate-spin rounded-full border-[3px] border-rdv-primary border-t-transparent" />
    </div>
  );
}

export function AdminError({ message }: { message: string }) {
  return (
    <div className="rounded-[var(--rdv-radius-input)] border border-rdv-nope/30 bg-rdv-nope-surface px-4 py-3 text-sm text-rdv-nope">
      {message}
    </div>
  );
}

export function AdminEmpty({ message }: { message: string }) {
  return (
    <p className="py-12 text-center text-sm text-rdv-muted">{message}</p>
  );
}

export function AdminBadge({
  children,
  variant = "default",
}: {
  children: React.ReactNode;
  variant?: "default" | "primary" | "success" | "warning" | "danger" | "info";
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
        "inline-flex rounded-full px-2.5 py-0.5 text-[11px] font-semibold",
        styles[variant],
      )}
    >
      {children}
    </span>
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
          ? "border border-rdv-primary/30 bg-rdv-chip text-rdv-primary"
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
          <tr className="border-b border-rdv-divider text-[11px] uppercase tracking-wide text-rdv-muted">
            {headers.map((h) => (
              <th key={h} className="px-4 py-3 font-semibold">
                {h}
              </th>
            ))}
          </tr>
        </thead>
        <tbody className="divide-y divide-rdv-divider [&_tr]:text-rdv-text [&_tr]:transition [&_tr:hover]:bg-rdv-message">
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

export function AdminLink({
  href,
  children,
}: {
  href: string;
  children: React.ReactNode;
}) {
  return (
    <a href={href} className="font-semibold text-rdv-text hover:text-rdv-primary">
      {children}
    </a>
  );
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
    <div className="flex items-center justify-between border-t border-rdv-divider px-4 py-3 text-sm text-rdv-muted">
      <span>
        {total} résultat{total > 1 ? "s" : ""}
      </span>
      <div className="flex gap-2">
        <button
          type="button"
          disabled={page <= 1}
          onClick={() => onPageChange(page - 1)}
          className="rounded-[var(--rdv-radius-input)] border border-rdv-divider px-3 py-1.5 text-rdv-text transition hover:bg-rdv-message disabled:opacity-40"
        >
          Précédent
        </button>
        <span className="px-2 py-1.5 text-rdv-text">Page {page}</span>
        <button
          type="button"
          disabled={!hasMore}
          onClick={() => onPageChange(page + 1)}
          className="rounded-[var(--rdv-radius-input)] border border-rdv-divider px-3 py-1.5 text-rdv-text transition hover:bg-rdv-message disabled:opacity-40"
        >
          Suivant
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
        "w-full rounded-[var(--rdv-radius-input)] border border-rdv-divider bg-rdv-surface px-3 py-2 text-sm text-rdv-text outline-none transition focus:border-rdv-primary focus:ring-[1.5px] focus:ring-rdv-primary/30",
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
    <AdminInput
      type="search"
      value={value}
      onChange={(e) => onChange(e.target.value)}
      placeholder={placeholder}
      className="max-w-xs sm:max-w-sm"
    />
  );
}

export function AdminButton({
  children,
  onClick,
  variant = "primary",
  disabled,
  type = "button",
  className,
}: {
  children: React.ReactNode;
  onClick?: () => void;
  variant?: "primary" | "secondary" | "ghost" | "danger";
  disabled?: boolean;
  type?: "button" | "submit";
  className?: string;
}) {
  const styles = {
    primary:
      "bg-rdv-primary text-white hover:bg-rdv-primary/90 shadow-none",
    secondary:
      "border border-rdv-divider bg-transparent text-rdv-primary hover:bg-rdv-message",
    ghost:
      "border border-rdv-divider text-rdv-text hover:bg-rdv-message",
    danger: "bg-rdv-nope text-white hover:bg-rdv-nope/90 shadow-none",
  };
  return (
    <button
      type={type}
      disabled={disabled}
      onClick={onClick}
      className={cn(
        "rounded-[var(--rdv-radius-input)] px-4 py-2 text-sm font-bold transition disabled:opacity-50",
        styles[variant],
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
}: {
  label: string;
  value: number | string;
  accent?: "like" | "nope" | "primary";
}) {
  const valueColor = {
    like: "text-rdv-like",
    nope: "text-rdv-nope",
    primary: "text-rdv-primary",
  };
  return (
    <AdminCard className="p-4">
      <p className="text-[11px] font-semibold uppercase tracking-wide text-rdv-muted">
        {label}
      </p>
      <p
        className={cn(
          "mt-2 text-3xl font-extrabold text-rdv-text",
          accent && valueColor[accent],
        )}
      >
        {value}
      </p>
    </AdminCard>
  );
}
