"use client";

import { cn } from "@/lib/utils/cn";

type AppScreenAppBarProps = {
  title: string;
  actions?: React.ReactNode;
  leading?: React.ReactNode;
};

export function AppScreenAppBar({
  title,
  actions,
  leading,
}: AppScreenAppBarProps) {
  return (
    <header className="sticky top-0 z-40 bg-rdv-appbar text-white shadow-sm dark:bg-rdv-appbar-dark dark:text-rdv-text-dark">
      <div className="mx-auto flex h-14 max-w-3xl items-center gap-3 px-4">
        {leading ? <div className="shrink-0">{leading}</div> : null}
        <h1 className="flex-1 truncate text-xl font-extrabold">{title}</h1>
        {actions ? (
          <div className="flex shrink-0 items-center gap-1">{actions}</div>
        ) : null}
      </div>
    </header>
  );
}

export function AppCard({
  className,
  children,
}: {
  className?: string;
  children: React.ReactNode;
}) {
  return (
    <div
      className={cn(
        "rounded-[18px] border border-black/5 bg-rdv-surface shadow-[0_5px_12px_rgba(0,0,0,0.08)] dark:border-white/10",
        className,
      )}
    >
      {children}
    </div>
  );
}

export function EmptyState({
  title,
  description,
  action,
}: {
  title: string;
  description?: string;
  action?: React.ReactNode;
}) {
  return (
    <div className="flex flex-col items-center justify-center px-6 py-16 text-center">
      <h2 className="text-lg font-bold text-rdv-text">{title}</h2>
      {description ? (
        <p className="mt-2 max-w-sm text-sm text-rdv-muted">{description}</p>
      ) : null}
      {action ? <div className="mt-6">{action}</div> : null}
    </div>
  );
}

export function LoadingState({ label = "Chargement…" }: { label?: string }) {
  return (
    <div className="flex flex-col items-center justify-center py-20">
      <div className="h-10 w-10 animate-spin rounded-full border-[3px] border-rdv-primary border-t-transparent" />
      <p className="mt-4 text-sm font-medium text-rdv-muted">{label}</p>
    </div>
  );
}
