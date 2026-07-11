"use client";

import Image from "next/image";
import Link from "next/link";
import { useCallback, useEffect, useState } from "react";
import { RefreshCw } from "lucide-react";
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
import { resolveImageUrl } from "@/lib/api/config";
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
  AdminError,
  AdminLoading,
  AdminPageHeader,
  AdminStatCard,
} from "@/components/admin/admin-ui";

const ONLINE_POLL_MS = 45_000;

function RetentionBar({ label, value }: { label: string; value: number }) {
  return (
    <div>
      <div className="mb-1 flex justify-between text-sm">
        <span className="text-rdv-muted">{label}</span>
        <span className="font-semibold text-rdv-text">{value}%</span>
      </div>
      <div className="h-2 overflow-hidden rounded-full bg-rdv-divider">
        <div
          className="h-full rounded-full bg-rdv-primary transition-all"
          style={{ width: `${Math.min(100, Math.max(0, value))}%` }}
        />
      </div>
    </div>
  );
}

function UserAvatar({
  name,
  avatarUrl,
}: {
  name: string;
  avatarUrl?: string | null;
}) {
  const initial = name.charAt(0).toUpperCase();
  if (avatarUrl) {
    return (
      <Image
        src={resolveImageUrl(avatarUrl)}
        alt=""
        width={40}
        height={40}
        className="h-10 w-10 shrink-0 rounded-full object-cover"
        unoptimized
      />
    );
  }
  return (
    <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-rdv-message text-sm font-bold text-rdv-primary">
      {initial}
    </span>
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
        fetchAdminUsersRecent(10),
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

  if (isLoading) return <AdminLoading />;
  if (error || !dashboard) {
    return <AdminError message={error ?? "Erreur inconnue"} />;
  }

  return (
    <div className="space-y-6">
      <AdminPageHeader
        title="Dashboard"
        description="GET /admin/dashboard — stats détaillées en parallèle"
        actions={
          <AdminButton
            variant="ghost"
            onClick={() => void loadAll(true)}
            disabled={isRefreshing}
            className="inline-flex items-center gap-2"
          >
            <RefreshCw
              className={`h-4 w-4 ${isRefreshing ? "animate-spin" : ""}`}
            />
            Actualiser
          </AdminButton>
        }
      />

      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-5">
        <AdminStatCard label="Utilisateurs" value={dashboard.totalUsers} />
        <AdminStatCard
          label="En ligne"
          value={activity?.onlineNow ?? online.length}
          accent="like"
        />
        <AdminStatCard
          label="Matchs"
          value={dashboard.matches}
          accent="primary"
        />
        <AdminStatCard label="Messages" value={dashboard.messages} />
        <AdminStatCard
          label="Profils complets"
          value={dashboard.profilesCompleted}
        />
      </div>

      <div className="grid gap-4 lg:grid-cols-2 xl:grid-cols-4">
        <AdminCard className="p-4">
          <h2 className="mb-3 text-[13px] font-bold text-rdv-text">
            Utilisateurs
          </h2>
          {usersStats ? (
            <ul className="space-y-2 text-sm">
              <li className="flex justify-between text-rdv-muted">
                <span>Total actifs</span>
                <span className="font-semibold text-rdv-text">
                  {usersStats.total}
                </span>
              </li>
              <li className="flex justify-between text-rdv-muted">
                <span>Hommes</span>
                <span className="font-semibold text-rdv-text">
                  {usersStats.male}
                </span>
              </li>
              <li className="flex justify-between text-rdv-muted">
                <span>Femmes</span>
                <span className="font-semibold text-rdv-text">
                  {usersStats.female}
                </span>
              </li>
              <li className="flex justify-between text-rdv-muted">
                <span>Vérifiés</span>
                <span className="font-semibold text-rdv-like">
                  {usersStats.verified}
                </span>
              </li>
            </ul>
          ) : null}
        </AdminCard>

        <AdminCard className="p-4">
          <h2 className="mb-3 text-[13px] font-bold text-rdv-text">Activité</h2>
          {activity ? (
            <ul className="space-y-2 text-sm">
              <li className="flex justify-between text-rdv-muted">
                <span>En ligne</span>
                <span className="font-semibold text-rdv-like">
                  {activity.onlineNow}
                </span>
              </li>
              <li className="flex justify-between text-rdv-muted">
                <span>Actifs 24 h</span>
                <span className="font-semibold text-rdv-text">
                  {activity.active24h}
                </span>
              </li>
              <li className="flex justify-between text-rdv-muted">
                <span>Actifs 7 j</span>
                <span className="font-semibold text-rdv-text">
                  {activity.active7d}
                </span>
              </li>
              <li className="flex justify-between text-rdv-muted">
                <span>Inactifs</span>
                <span className="font-semibold text-rdv-muted">
                  {activity.inactive}
                </span>
              </li>
            </ul>
          ) : null}
        </AdminCard>

        <AdminCard className="p-4">
          <h2 className="mb-3 text-[13px] font-bold text-rdv-text">Messages</h2>
          {messages ? (
            <ul className="space-y-2 text-sm">
              <li className="flex justify-between text-rdv-muted">
                <span>Total</span>
                <span className="font-semibold text-rdv-text">
                  {messages.totalMessages}
                </span>
              </li>
              <li className="flex justify-between text-rdv-muted">
                <span>Aujourd&apos;hui</span>
                <span className="font-semibold text-rdv-text">
                  {messages.today}
                </span>
              </li>
              <li className="flex justify-between text-rdv-muted">
                <span>Moy. / user</span>
                <span className="font-semibold text-rdv-text">
                  {messages.averagePerUser}
                </span>
              </li>
            </ul>
          ) : null}
        </AdminCard>

        <AdminCard className="p-4">
          <h2 className="mb-3 text-[13px] font-bold text-rdv-text">Swipes</h2>
          {swipes ? (
            <ul className="space-y-2 text-sm">
              <li className="flex justify-between text-rdv-muted">
                <span>Likes</span>
                <span className="font-semibold text-rdv-like">
                  {swipes.likes}
                </span>
              </li>
              <li className="flex justify-between text-rdv-muted">
                <span>Passes</span>
                <span className="font-semibold text-rdv-nope">
                  {swipes.passes}
                </span>
              </li>
              <li className="flex justify-between text-rdv-muted">
                <span>Super likes</span>
                <span className="font-semibold text-rdv-superlike">
                  {swipes.superLikes}
                </span>
              </li>
            </ul>
          ) : null}
        </AdminCard>
      </div>

      <div className="grid gap-4 lg:grid-cols-2">
        <AdminCard className="p-4">
          <h2 className="mb-4 text-[13px] font-bold text-rdv-text">
            Rétention J1 / J7 / J30
          </h2>
          {retention ? (
            <div className="space-y-4">
              <RetentionBar label="Jour 1" value={retention.day1} />
              <RetentionBar label="Jour 7" value={retention.day7} />
              <RetentionBar label="Jour 30" value={retention.day30} />
            </div>
          ) : null}
          <div className="mt-4 grid grid-cols-2 gap-3 border-t border-rdv-divider pt-4 text-sm">
            <div>
              <p className="text-rdv-muted">Nouveaux aujourd&apos;hui</p>
              <p className="font-bold text-rdv-text">
                {dashboard.newUsersToday}
              </p>
            </div>
            <div>
              <p className="text-rdv-muted">Nouveaux cette semaine</p>
              <p className="font-bold text-rdv-text">
                {dashboard.newUsersThisWeek}
              </p>
            </div>
            <div>
              <p className="text-rdv-muted">Actifs aujourd&apos;hui</p>
              <p className="font-bold text-rdv-text">{dashboard.activeToday}</p>
            </div>
            <div>
              <p className="text-rdv-muted">Actifs cette semaine</p>
              <p className="font-bold text-rdv-text">
                {dashboard.activeThisWeek}
              </p>
            </div>
          </div>
        </AdminCard>

        {overview ? (
          <AdminCard className="p-4">
            <h2 className="mb-3 text-[13px] font-bold text-rdv-text">
              Modération & infra
            </h2>
            <ul className="space-y-2 text-sm">
              <li className="flex justify-between text-rdv-muted">
                <span>Signalements ouverts</span>
                <span className="font-semibold text-rdv-nope">
                  {overview.openReports}
                </span>
              </li>
              <li className="flex justify-between text-rdv-muted">
                <span>Photos en attente</span>
                <span className="font-semibold text-rdv-primary">
                  {overview.pendingPhotos}
                </span>
              </li>
              <li className="flex justify-between text-rdv-muted">
                <span>Admins</span>
                <span className="font-semibold text-rdv-text">
                  {overview.admins}
                </span>
              </li>
              <li className="flex justify-between text-rdv-muted">
                <span>Bannis</span>
                <span className="font-semibold text-rdv-text">
                  {overview.bannedUsers}
                </span>
              </li>
            </ul>
            <div className="mt-4 flex flex-wrap gap-3 text-sm font-semibold">
              <Link href="/admin/reports" className="text-rdv-primary hover:underline">
                Signalements →
              </Link>
              <Link href="/admin/moderation" className="text-rdv-primary hover:underline">
                Modération →
              </Link>
              <Link href="/admin/bugs" className="text-rdv-primary hover:underline">
                Bugs app →
              </Link>
            </div>
          </AdminCard>
        ) : null}
      </div>

      <div className="grid gap-4 lg:grid-cols-2">
        <AdminCard className="p-4">
          <div className="mb-3 flex items-center justify-between">
            <h2 className="text-[13px] font-bold text-rdv-text">
              En ligne maintenant
            </h2>
            <AdminBadge variant="success">{online.length}</AdminBadge>
          </div>
          {online.length === 0 ? (
            <p className="py-6 text-center text-sm text-rdv-muted">
              Aucun utilisateur en ligne.
            </p>
          ) : (
            <ul className="max-h-80 space-y-3 overflow-y-auto">
              {online.map((u) => (
                <li key={u.id} className="flex items-center gap-3">
                  <UserAvatar name={u.name} avatarUrl={u.avatarUrl} />
                  <div className="min-w-0 flex-1">
                    <Link
                      href={`/admin/users/${u.id}`}
                      className="truncate font-semibold text-rdv-text hover:text-rdv-primary"
                    >
                      {u.name}
                    </Link>
                    <p className="truncate text-xs text-rdv-muted">{u.email}</p>
                  </div>
                  <span className="h-2 w-2 shrink-0 rounded-full bg-rdv-like" />
                </li>
              ))}
            </ul>
          )}
        </AdminCard>

        <AdminCard className="p-4">
          <h2 className="mb-3 text-[13px] font-bold text-rdv-text">
            Derniers inscrits
          </h2>
          {recent.length === 0 ? (
            <p className="py-6 text-center text-sm text-rdv-muted">
              Aucun nouvel inscrit.
            </p>
          ) : (
            <ul className="max-h-80 space-y-3 overflow-y-auto">
              {recent.map((u) => (
                <li key={u.id} className="flex items-center gap-3">
                  <UserAvatar name={u.name} avatarUrl={u.avatarUrl} />
                  <div className="min-w-0 flex-1">
                    <Link
                      href={`/admin/users/${u.id}`}
                      className="truncate font-semibold text-rdv-text hover:text-rdv-primary"
                    >
                      {u.name}
                    </Link>
                    <p className="truncate text-xs text-rdv-muted">
                      {[u.city, u.gender].filter(Boolean).join(" · ") ||
                        u.email}
                    </p>
                  </div>
                  <AdminBadge variant={u.isComplete ? "success" : "default"}>
                    {u.isComplete ? "Complet" : "Incomplet"}
                  </AdminBadge>
                </li>
              ))}
            </ul>
          )}
        </AdminCard>
      </div>
    </div>
  );
}
