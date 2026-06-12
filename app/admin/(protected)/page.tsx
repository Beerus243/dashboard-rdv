"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { ApiError } from "@/lib/api/client";
import {
  fetchAdminAgeGroupStats,
  fetchAdminGenderStats,
  fetchAdminGeographyStats,
  fetchAdminHealth,
  fetchAdminUsersStats,
} from "@/lib/api/admin";
import type {
  AdminUsersStats,
  StatAgeGroup,
  StatGender,
  StatGeography,
} from "@/lib/types/admin";
import {
  AdminCard,
  AdminError,
  AdminLoading,
  AdminPageHeader,
  AdminStatCard,
} from "@/components/admin/admin-ui";

export default function AdminDashboardPage() {
  const [stats, setStats] = useState<AdminUsersStats | null>(null);
  const [gender, setGender] = useState<StatGender[]>([]);
  const [ageGroups, setAgeGroups] = useState<StatAgeGroup[]>([]);
  const [geography, setGeography] = useState<StatGeography[]>([]);
  const [health, setHealth] = useState<string>("—");
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function load() {
      try {
        const [usersStats, healthData, genderData, ageData, geoData] =
          await Promise.all([
            fetchAdminUsersStats(),
            fetchAdminHealth(),
            fetchAdminGenderStats(),
            fetchAdminAgeGroupStats(),
            fetchAdminGeographyStats(),
          ]);
        setStats(usersStats);
        setHealth(healthData.status ?? "unknown");
        setGender(genderData);
        setAgeGroups(ageData);
        setGeography(geoData.slice(0, 8));
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

  if (isLoading) return <AdminLoading />;
  if (error || !stats) return <AdminError message={error ?? "Erreur inconnue"} />;

  return (
    <div className="space-y-6">
      <AdminPageHeader
        title="Dashboard"
        description={`API ${health === "ok" ? "opérationnelle" : health} — stats via GET /admin/stats/*`}
      />

      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <AdminStatCard label="Utilisateurs" value={stats.totalUsers} />
        <AdminStatCard label="Actifs" value={stats.activeUsers} accent="like" />
        <AdminStatCard label="Matchs" value={stats.totalMatches} accent="primary" />
        <AdminStatCard label="Messages" value={stats.totalMessages} />
        <AdminStatCard
          label="Signalements ouverts"
          value={stats.openReports}
          accent="nope"
        />
        <AdminStatCard label="Photos en attente" value={stats.pendingPhotos} accent="primary" />
        <AdminStatCard label="Nouveaux (24h)" value={stats.newToday} accent="like" />
        <AdminStatCard label="Admins" value={stats.admins} />
      </div>

      <div className="grid gap-4 lg:grid-cols-3">
        <AdminCard className="p-4">
          <h2 className="mb-3 text-[13px] font-bold text-rdv-text">Genre</h2>
          <ul className="space-y-2 text-sm">
            {gender.map((g) => (
              <li key={g.gender} className="flex justify-between text-rdv-muted">
                <span>{g.gender}</span>
                <span className="font-semibold text-rdv-text">{g.count}</span>
              </li>
            ))}
          </ul>
        </AdminCard>
        <AdminCard className="p-4">
          <h2 className="mb-3 text-[13px] font-bold text-rdv-text">
            Tranches d&apos;âge
          </h2>
          <ul className="space-y-2 text-sm">
            {ageGroups.map((a) => (
              <li key={a.group} className="flex justify-between text-rdv-muted">
                <span>{a.group}</span>
                <span className="font-semibold text-rdv-text">{a.count}</span>
              </li>
            ))}
          </ul>
        </AdminCard>
        <AdminCard className="p-4">
          <h2 className="mb-3 text-[13px] font-bold text-rdv-text">Top villes</h2>
          <ul className="space-y-2 text-sm">
            {geography.map((g) => (
              <li key={g.city} className="flex justify-between text-rdv-muted">
                <span>{g.city}</span>
                <span className="font-semibold text-rdv-text">{g.count}</span>
              </li>
            ))}
          </ul>
        </AdminCard>
      </div>

      <div className="flex flex-wrap gap-3 text-sm font-semibold">
        <Link href="/admin/users" className="text-rdv-primary hover:underline">
          Utilisateurs →
        </Link>
        <Link href="/admin/reports" className="text-rdv-primary hover:underline">
          Signalements →
        </Link>
        <Link href="/admin/moderation" className="text-rdv-primary hover:underline">
          Modération →
        </Link>
      </div>
    </div>
  );
}
