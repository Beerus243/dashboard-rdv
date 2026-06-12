"use client";

import { useEffect, useState } from "react";
import {
  AlertTriangle,
  Heart,
  ImageIcon,
  MessageCircle,
  UserPlus,
  Users,
} from "lucide-react";
import { ApiError } from "@/lib/api/client";
import { fetchAdminHealth, fetchAdminUsersStats } from "@/lib/api/admin";
import type { AdminUsersStats } from "@/lib/types/admin";
import { cn } from "@/lib/utils/cn";
import { LoadingState } from "@/components/ui/app-primitives";

function StatCard({
  label,
  value,
  icon: Icon,
  accent = "text-rdv-primary",
}: {
  label: string;
  value: number | string;
  icon: React.ComponentType<{ className?: string }>;
  accent?: string;
}) {
  return (
    <div className="rounded-2xl border border-slate-800 bg-slate-900/60 p-4">
      <div className="flex items-start justify-between">
        <div>
          <p className="text-xs font-semibold uppercase tracking-wide text-slate-500">
            {label}
          </p>
          <p className="mt-2 text-3xl font-extrabold text-white">{value}</p>
        </div>
        <Icon className={cn("h-5 w-5 opacity-80", accent)} />
      </div>
    </div>
  );
}

export default function AdminDashboardPage() {
  const [stats, setStats] = useState<AdminUsersStats | null>(null);
  const [health, setHealth] = useState<string>("—");
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function load() {
      try {
        const [usersStats, healthData] = await Promise.all([
          fetchAdminUsersStats(),
          fetchAdminHealth(),
        ]);
        setStats(usersStats);
        setHealth(healthData.status ?? "unknown");
      } catch (err) {
        setError(
          err instanceof ApiError
            ? err.message
            : "Impossible de charger le dashboard.",
        );
      } finally {
        setIsLoading(false);
      }
    }
    void load();
  }, []);

  if (isLoading) {
    return <LoadingState label="Chargement du dashboard…" />;
  }

  if (error || !stats) {
    return (
      <div className="rounded-2xl border border-red-500/30 bg-red-500/10 p-6 text-red-300">
        {error ?? "Erreur inconnue"}
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-extrabold text-white">Dashboard</h1>
        <p className="mt-1 text-sm text-slate-400">
          Vue d&apos;ensemble de la plateforme RDV — API{" "}
          <span
            className={
              health === "ok"
                ? "font-semibold text-emerald-400"
                : "font-semibold text-amber-400"
            }
          >
            {health}
          </span>
        </p>
      </div>

      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <StatCard label="Utilisateurs" value={stats.totalUsers} icon={Users} />
        <StatCard
          label="Actifs"
          value={stats.activeUsers}
          icon={Users}
          accent="text-emerald-400"
        />
        <StatCard
          label="Nouveaux (24h)"
          value={stats.newToday}
          icon={UserPlus}
          accent="text-sky-400"
        />
        <StatCard
          label="Nouveaux (7j)"
          value={stats.newWeek}
          icon={UserPlus}
          accent="text-sky-400"
        />
        <StatCard label="Matchs" value={stats.totalMatches} icon={Heart} accent="text-pink-400" />
        <StatCard
          label="Messages"
          value={stats.totalMessages}
          icon={MessageCircle}
          accent="text-violet-400"
        />
        <StatCard
          label="Signalements ouverts"
          value={stats.openReports}
          icon={AlertTriangle}
          accent="text-amber-400"
        />
        <StatCard
          label="Photos en attente"
          value={stats.pendingPhotos}
          icon={ImageIcon}
          accent="text-orange-400"
        />
      </div>

      <div className="grid gap-4 md:grid-cols-3">
        <div className="rounded-2xl border border-slate-800 bg-slate-900/60 p-4">
          <p className="text-xs font-semibold uppercase text-slate-500">Bannis</p>
          <p className="mt-2 text-2xl font-bold text-white">{stats.bannedUsers}</p>
        </div>
        <div className="rounded-2xl border border-slate-800 bg-slate-900/60 p-4">
          <p className="text-xs font-semibold uppercase text-slate-500">E-mails vérifiés</p>
          <p className="mt-2 text-2xl font-bold text-white">{stats.verifiedUsers}</p>
        </div>
        <div className="rounded-2xl border border-slate-800 bg-slate-900/60 p-4">
          <p className="text-xs font-semibold uppercase text-slate-500">Comptes admin</p>
          <p className="mt-2 text-2xl font-bold text-white">{stats.admins}</p>
        </div>
      </div>
    </div>
  );
}
