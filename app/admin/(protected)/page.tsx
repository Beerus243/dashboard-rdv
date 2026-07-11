"use client";

import Link from "next/link";
import { useCallback, useEffect, useState } from "react";
import {
  Bug,
  Flag,
  Heart,
  ImageIcon,
  MessageSquare,
  RefreshCw,
  UserCheck,
  Users,
  Zap,
} from "lucide-react";
import { ApiError } from "@/lib/api/client";
import {
  fetchAdminDashboard,
  fetchAdminStatsActivity,
  fetchAdminStatsMessages,
  fetchAdminStatsOverview,
  fetchAdminStatsRetention,
  fetchAdminStatsSwipes,
  fetchAdminStatsUsers,
  fetchAdminUsersOnline,
  fetchAdminUsersRecent,
} from "@/lib/api/admin";
import type {
  AdminDashboard,
  AdminOnlineUser,
  AdminRecentUser,
  AdminStatsActivity,
  AdminStatsMessages,
  AdminStatsOverview,
  AdminStatsRetention,
  AdminStatsSwipes,
  AdminStatsUsers,
} from "@/lib/types/admin";
import {
  AdminBadge,
  AdminButton,
  AdminCard,
  AdminEmpty,
  AdminError,
  AdminHeroBanner,
  AdminListItem,
  AdminQuickAction,
  AdminSectionTitle,
  AdminSkeleton,
  AdminStatCard,
  AdminStatSkeleton,
  AdminUserAvatar,
} from "@/components/admin/admin-ui";

const ONLINE_POLL_MS = 45_000;

function RetentionBar({ label, value }: { label: string; value: number }) {
  return (
    <div>
      <div className="mb-1.5 flex justify-between text-sm">
        <span className="font-medium text-rdv-muted">{label}</span>
        <span className="font-bold tabular-nums text-rdv-text">{value}%</span>
      </div>
      <div className="h-2.5 overflow-hidden rounded-full bg-rdv-divider">
        <div
          className="h-full rounded-full bg-gradient-to-r from-rdv-primary to-rdv-gradient-end transition-all duration-700"
          style={{ width: `${Math.min(100, Math.max(0, value))}%` }}
        />
      </div>
    </div>
  );
}

function MetricRow({
  label,
  value,
  accent,
}: {
  label: string;
  value: string | number;
  accent?: "like" | "nope" | "primary";
}) {
  const colors = {
    like: "text-rdv-like",
    nope: "text-rdv-nope",
    primary: "text-rdv-primary",
  };
  return (
    <li className="flex items-center justify-between gap-4 py-1.5 text-sm">
      <span className="text-rdv-muted">{label}</span>
      <span
        className={`font-bold tabular-nums ${accent ? colors[accent] : "text-rdv-text"}`}
      >
        {value}
      </span>
    </li>
  );
}

export default function AdminDashboardPage() {
  const [dashboard, setDashboard] = useState<AdminDashboard | null>(null);
  const [usersStats, setUsersStats] = useState<AdminStatsUsers | null>(null);
  const [activity, setActivity] = useState<AdminStatsActivity | null>(null);
  const [messages, setMessages] = useState<AdminStatsMessages | null>(null);
  const [swipes, setSwipes] = useState<AdminStatsSwipes | null>(null);
  const [retention, setRetention] = useState<AdminStatsRetention | null>(null);
  const [overview, setOverview] = useState<AdminStatsOverview | null>(null);
  const [online, setOnline] = useState<AdminOnlineUser[]>([]);
  const [recent, setRecent] = useState<AdminRecentUser[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const loadOnline = useCallback(async () => {
    try {
      const res = await fetchAdminUsersOnline();
      setOnline(res.data);
    } catch {
      /* polling silencieux */
    }
  }, []);

  const loadAll = useCallback(async (silent = false) => {
    if (!silent) setIsLoading(true);
    else setIsRefreshing(true);
    setError(null);
    try {
      const [
        dash,
        users,
        act,
        msgs,
        swp,
        ret,
        ov,
        onlineRes,
        recentRes,
      ] = await Promise.all([
        fetchAdminDashboard(),
        fetchAdminStatsUsers(),
        fetchAdminStatsActivity(),
        fetchAdminStatsMessages(),
        fetchAdminStatsSwipes(),
        fetchAdminStatsRetention(),
        fetchAdminStatsOverview(),
        fetchAdminUsersOnline(),
        fetchAdminUsersRecent(8),
      ]);
      setDashboard(dash);
      setUsersStats(users);
      setActivity(act);
      setMessages(msgs);
      setSwipes(swp);
      setRetention(ret);
      setOverview(ov);
      setOnline(onlineRes.data);
      setRecent(recentRes.data);
    } catch (err) {
      setError(
        err instanceof ApiError
          ? err.message
          : "Impossible de charger le dashboard.",
      );
    } finally {
      setIsLoading(false);
      setIsRefreshing(false);
    }
  }, []);

  useEffect(() => {
    void loadAll();
  }, [loadAll]);

  useEffect(() => {
    const id = setInterval(() => void loadOnline(), ONLINE_POLL_MS);
    return () => clearInterval(id);
  }, [loadOnline]);

  if (isLoading) {
    return (
      <div className="space-y-6">
        <AdminSkeleton className="h-28 w-full rounded-[var(--rdv-radius-hero)]" />
        <AdminStatSkeleton count={5} />
        <div className="grid gap-4 lg:grid-cols-2">
          <AdminSkeleton className="h-64 w-full" />
          <AdminSkeleton className="h-64 w-full" />
        </div>
      </div>
    );
  }

  if (error || !dashboard) {
    return (
      <AdminError message={error ?? "Erreur inconnue"} onRetry={() => void loadAll()} />
    );
  }

  const onlineCount = activity?.onlineNow ?? online.length;

  return (
    <div className="space-y-6">
      <AdminHeroBanner
        title="Vue d'ensemble"
        subtitle={`${dashboard.totalUsers} utilisateurs · ${onlineCount} en ligne · ${dashboard.newUsersToday} nouveaux aujourd'hui`}
        action={
          <AdminButton
            variant="secondary"
            onClick={() => void loadAll(true)}
            disabled={isRefreshing}
            className="border-white/30 bg-white/15 text-white hover:bg-white/25"
          >
            <RefreshCw
              className={`h-4 w-4 ${isRefreshing ? "animate-spin" : ""}`}
            />
            Actualiser
          </AdminButton>
        }
      />

      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-5">
        <AdminStatCard
          label="Utilisateurs"
          value={dashboard.totalUsers}
          icon={Users}
          hint={`+${dashboard.newUsersThisWeek} cette semaine`}
        />
        <AdminStatCard
          label="En ligne"
          value={onlineCount}
          icon={Zap}
          accent="like"
          hint="Mis à jour toutes les 45 s"
        />
        <AdminStatCard
          label="Matchs"
          value={dashboard.matches}
          icon={Heart}
          accent="primary"
        />
        <AdminStatCard
          label="Messages"
          value={dashboard.messages}
          icon={MessageSquare}
          hint={messages ? `${messages.today} aujourd'hui` : undefined}
        />
        <AdminStatCard
          label="Profils complets"
          value={dashboard.profilesCompleted}
          icon={UserCheck}
          hint={`${Math.round((dashboard.profilesCompleted / Math.max(dashboard.totalUsers, 1)) * 100)}% du total`}
        />
      </div>

      <div>
        <AdminSectionTitle title="Indicateurs détaillés" />
        <div className="grid gap-4 lg:grid-cols-2 xl:grid-cols-4">
          <AdminCard className="p-4">
            <h3 className="mb-3 text-sm font-bold text-rdv-text">Utilisateurs</h3>
            {usersStats ? (
              <ul>
                <MetricRow label="Total actifs" value={usersStats.total} />
                <MetricRow label="Hommes" value={usersStats.male} />
                <MetricRow label="Femmes" value={usersStats.female} />
                <MetricRow
                  label="Vérifiés"
                  value={usersStats.verified}
                  accent="like"
                />
              </ul>
            ) : null}
          </AdminCard>

          <AdminCard className="p-4">
            <h3 className="mb-3 text-sm font-bold text-rdv-text">Activité</h3>
            {activity ? (
              <ul>
                <MetricRow label="En ligne" value={activity.onlineNow} accent="like" />
                <MetricRow label="Actifs 24 h" value={activity.active24h} />
                <MetricRow label="Actifs 7 j" value={activity.active7d} />
                <MetricRow label="Inactifs" value={activity.inactive} />
              </ul>
            ) : null}
          </AdminCard>

          <AdminCard className="p-4">
            <h3 className="mb-3 text-sm font-bold text-rdv-text">Messages</h3>
            {messages ? (
              <ul>
                <MetricRow label="Total" value={messages.totalMessages} />
                <MetricRow label="Aujourd'hui" value={messages.today} />
                <MetricRow
                  label="Moy. / user"
                  value={messages.averagePerUser}
                />
              </ul>
            ) : null}
          </AdminCard>

          <AdminCard className="p-4">
            <h3 className="mb-3 text-sm font-bold text-rdv-text">Swipes</h3>
            {swipes ? (
              <ul>
                <MetricRow label="Likes" value={swipes.likes} accent="like" />
                <MetricRow label="Passes" value={swipes.passes} accent="nope" />
                <MetricRow
                  label="Super likes"
                  value={swipes.superLikes}
                  accent="primary"
                />
              </ul>
            ) : null}
          </AdminCard>
        </div>
      </div>

      <div className="grid gap-4 lg:grid-cols-2">
        <AdminCard className="p-4">
          <AdminSectionTitle title="Rétention" />
          {retention ? (
            <div className="space-y-4">
              <RetentionBar label="Jour 1" value={retention.day1} />
              <RetentionBar label="Jour 7" value={retention.day7} />
              <RetentionBar label="Jour 30" value={retention.day30} />
            </div>
          ) : null}
          <div className="mt-5 grid grid-cols-2 gap-3 border-t border-rdv-divider pt-4">
            <div className="rounded-[var(--rdv-radius-input)] bg-rdv-bg p-3">
              <p className="text-xs text-rdv-muted">Actifs aujourd'hui</p>
              <p className="text-lg font-extrabold tabular-nums">
                {dashboard.activeToday}
              </p>
            </div>
            <div className="rounded-[var(--rdv-radius-input)] bg-rdv-bg p-3">
              <p className="text-xs text-rdv-muted">Actifs cette semaine</p>
              <p className="text-lg font-extrabold tabular-nums">
                {dashboard.activeThisWeek}
              </p>
            </div>
          </div>
        </AdminCard>

        {overview ? (
          <AdminCard className="p-4">
            <AdminSectionTitle title="Modération" />
            <ul className="space-y-1">
              <MetricRow
                label="Signalements ouverts"
                value={overview.openReports}
                accent="nope"
              />
              <MetricRow
                label="Photos en attente"
                value={overview.pendingPhotos}
                accent="primary"
              />
              <MetricRow label="Admins" value={overview.admins} />
              <MetricRow label="Comptes bannis" value={overview.bannedUsers} />
            </ul>
            <div className="mt-5 grid gap-2 sm:grid-cols-2">
              <AdminQuickAction
                href="/admin/reports"
                label="Signalements"
                description="Traiter les reports utilisateurs"
                icon={Flag}
              />
              <AdminQuickAction
                href="/admin/moderation"
                label="Modération"
                description="Photos et messages"
                icon={ImageIcon}
              />
              <AdminQuickAction
                href="/admin/bugs"
                label="Bugs app"
                description="Retours des utilisateurs"
                icon={Bug}
              />
              <AdminQuickAction
                href="/admin/users"
                label="Utilisateurs"
                description="Gérer les comptes"
                icon={Users}
              />
            </div>
          </AdminCard>
        ) : null}
      </div>

      <div className="grid gap-4 lg:grid-cols-2">
        <AdminCard className="p-2">
          <div className="flex items-center justify-between px-2 py-2">
            <AdminSectionTitle title="En ligne" className="mb-0" />
            <AdminBadge variant="success" dot>
              {online.length}
            </AdminBadge>
          </div>
          {online.length === 0 ? (
            <AdminEmpty message="Aucun utilisateur connecté pour le moment." />
          ) : (
            <div className="max-h-80 overflow-y-auto px-1 pb-1">
              {online.map((u) => (
                <AdminListItem
                  key={u.id}
                  href={`/admin/users/${u.id}`}
                  avatar={
                    <AdminUserAvatar
                      name={u.name}
                      avatarUrl={u.avatarUrl}
                      online
                    />
                  }
                  title={u.name}
                  subtitle={u.email}
                />
              ))}
            </div>
          )}
        </AdminCard>

        <AdminCard className="p-2">
          <AdminSectionTitle title="Derniers inscrits" className="px-2 pt-2" />
          {recent.length === 0 ? (
            <AdminEmpty message="Aucune inscription récente." />
          ) : (
            <div className="max-h-80 overflow-y-auto px-1 pb-1">
              {recent.map((u) => (
                <AdminListItem
                  key={u.id}
                  href={`/admin/users/${u.id}`}
                  avatar={
                    <AdminUserAvatar name={u.name} avatarUrl={u.avatarUrl} />
                  }
                  title={u.name}
                  subtitle={
                    [u.city, u.gender].filter(Boolean).join(" · ") || u.email
                  }
                  trailing={
                    <AdminBadge variant={u.isComplete ? "success" : "default"}>
                      {u.isComplete ? "Complet" : "Incomplet"}
                    </AdminBadge>
                  }
                />
              ))}
            </div>
          )}
          <div className="border-t border-rdv-divider p-3">
            <Link
              href="/admin/users"
              className="text-sm font-semibold text-rdv-primary hover:underline"
            >
              Voir tous les utilisateurs →
            </Link>
          </div>
        </AdminCard>
      </div>
    </div>
  );
}
