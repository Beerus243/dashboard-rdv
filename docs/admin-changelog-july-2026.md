# Dashboard admin — dernières mises à jour (juillet 2026)

> Changelog API pour le front dashboard (Next.js).  
> Auth inchangée : `Authorization: Bearer <accessToken>` via `POST /admin/auth/login`.  
> Rôles lecture : `SUPER_ADMIN`, `ADMIN`, `MODERATOR`, `OBSERVER`.

**Voir aussi** : [`admin-endpoints.md`](./admin-endpoints.md) (liste complète), [`admin-api-backend.md`](./admin-api-backend.md) (setup & RBAC).

**Intégration Next.js** : `lib/api/admin.ts`, page `/admin`, `/admin/bugs`.

---

## Résumé des ajouts

| Route | Usage dashboard |
|-------|-----------------|
| `GET /admin/dashboard` | Page d'accueil — KPIs principaux |
| `GET /admin/stats/users` | Carte « Utilisateurs » (genre, vérifiés) |
| `GET /admin/stats/activity` | Carte « Activité » (online, 24 h, 7 j) |
| `GET /admin/stats/matches` | Carte « Matchs » |
| `GET /admin/stats/messages` | Carte « Messages » |
| `GET /admin/stats/swipes` | Carte « Swipes » |
| `GET /admin/stats/retention` | Graphique rétention J1 / J7 / J30 |
| `GET /admin/stats/overview` | Ancien KPI global (modération, admins…) |
| `GET /admin/users/online` | Widget utilisateurs connectés |
| `GET /admin/users/recent` | Widget derniers inscrits |
| `GET /admin/bugs` | Liste signalements bugs app |
| `POST /bugs` | Côté **app mobile** — créer un signalement |

**Migration requise** (prod Render) :

```bash
npx prisma migrate deploy
# 20260711150000_add_bug_reports
```

---

## 1. Vue d'ensemble — `GET /admin/dashboard`

Point d'entrée recommandé pour la page d'accueil du dashboard.

**Réponse 200**

```json
{
  "totalUsers": 51,
  "activeToday": 18,
  "activeThisWeek": 37,
  "newUsersToday": 4,
  "newUsersThisWeek": 15,
  "matches": 23,
  "messages": 157,
  "profilesCompleted": 42
}
```

---

## 2. Stats détaillées — `/admin/stats/*`

### `GET /admin/stats/users`

Répartition utilisateurs (remplace l'ancien format KPIs sur cette route).

```json
{
  "total": 51,
  "male": 31,
  "female": 20,
  "verified": 12,
  "premium": 0
}
```

### `GET /admin/stats/activity`

```json
{
  "onlineNow": 8,
  "active24h": 18,
  "active7d": 37,
  "inactive": 14
}
```

### `GET /admin/stats/matches` / `messages` / `swipes` / `retention`

Voir le changelog complet backend pour les payloads.

### Ancien format KPIs — `GET /admin/stats/overview`

Si le front utilisait l'**ancien** `GET /admin/stats/users`, il est désormais sur **`/admin/stats/overview`**.

---

## 3. Utilisateurs temps réel

- `GET /admin/users/online` — liste `{ data: [...] }`
- `GET /admin/users/recent?limit=20` — derniers inscrits

> **Ordre des routes** : `online` et `recent` sont déclarés **avant** `GET /admin/users/:id`.

---

## 4. Signalements bugs

- App : `POST /bugs` (utilisateur connecté)
- Admin : `GET /admin/bugs?page&limit&status`

Statuts : `OPEN`, `IN_PROGRESS`, `RESOLVED`, `CLOSED`.

---

## 5. Intégration front (implémentée)

1. `GET /admin/dashboard` — cartes principales
2. En parallèle : `activity`, `retention`, `swipes`, `users`, `overview`, `users/online`, `users/recent`
3. Rafraîchissement `online` toutes les **45 s**
4. Bouton **Actualiser** sur `/admin`
5. Page **`/admin/bugs`** avec filtres par statut

---

## Checklist déploiement

- [ ] `npx prisma migrate deploy` sur Render (`20260711150000_add_bug_reports`)
- [ ] Redéployer le service backend
- [x] Mettre à jour le front dashboard (nouvelles routes)
- [ ] Ajouter écran « Signaler un bug » dans Flutter (`POST /bugs`)
