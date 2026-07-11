# Dashboard admin — API backend (RDV)

Base URL : `https://backendrdv-jf71.onrender.com`  
Auth admin : `Authorization: Bearer <accessToken>` (token obtenu via `POST /admin/auth/login`)

Spec produit complète (PRD + UX Next.js) : [`admin-dashboard-prd.md`](./admin-dashboard-prd.md)

**Liste complète des routes** : [`admin-endpoints.md`](./admin-endpoints.md)

**Changelog juillet 2026** : [`admin-changelog-july-2026.md`](./admin-changelog-july-2026.md) (dashboard, stats, bugs, online/recent)

---

## Bootstrap — premier super admin

Après migration `20260612120000_add_admin_panel` :

```sql
UPDATE "User"
SET "adminRole" = 'SUPER_ADMIN'
WHERE email = 'ton-email@example.com';
```

L'utilisateur doit déjà exister (inscription email ou Google) **avec un mot de passe** pour `POST /admin/auth/login`.

Alternative sans SQL : `POST /admin/auth/bootstrap` avec `ADMIN_BOOTSTRAP_SECRET` (voir [`admin-endpoints.md`](./admin-endpoints.md)).

---

## Rôles (`AdminRole`)

| Rôle | Description |
|------|-------------|
| `SUPER_ADMIN` | Tout + gestion des rôles admin |
| `ADMIN` | Users, stats, notifs, infra |
| `MODERATOR` | Signalements, modération photos/messages |
| `OBSERVER` | Lecture stats / users / reports |

`SUPER_ADMIN` bypass toutes les restrictions `@AdminRoles()`.

---

## Auth

| Méthode | Route | Description |
|---------|-------|-------------|
| POST | `/admin/auth/login` | `{ email, password }` → tokens + `user.adminRole` |
| POST | `/admin/auth/bootstrap` | Promotion initiale (secret serveur) |
| GET | `/admin/auth/me` | Profil admin connecté |

Réponse login :

```json
{
  "user": {
    "id": "...",
    "email": "...",
    "name": "...",
    "adminRole": "SUPER_ADMIN",
    "avatarUrl": "..."
  },
  "accessToken": "...",
  "refreshToken": "..."
}
```

---

## Utilisateurs

| Méthode | Route | Rôles | Description |
|---------|-------|-------|-------------|
| GET | `/admin/users?page&limit&search&active&adminRole` | read | Liste paginée |
| GET | `/admin/users/:id` | read | Détail + profil + stats |
| PUT | `/admin/users/:id` | admin+ | `{ name?, isActive?, banReason?, adminRole? }` |
| DELETE | `/admin/users/:id` | admin+ | Ban (soft) |

`adminRole` : modifiable **uniquement par SUPER_ADMIN**.

---

## Signalements

| Méthode | Route | Description |
|---------|-------|-------------|
| GET | `/admin/reports?status=OPEN\|CLOSED` | Liste |
| GET | `/admin/reports/:id` | Détail |
| POST | `/admin/reports/:id/close` | `{ resolution? }` |

---

## Modération

| Méthode | Route | Description |
|---------|-------|-------------|
| GET | `/admin/moderation/photos?status=PENDING` | File photos |
| POST | `/admin/moderation/photos/:id` | `{ action: "approve"\|"reject", reason? }` |
| GET | `/admin/moderation/messages` | Messages des users signalés |

---

## Matchs & chat

| Méthode | Route | Description |
|---------|-------|-------------|
| GET | `/admin/matches` | Liste matchs paginée |
| GET | `/admin/chat/conversations` | Conversations + dernier message |
| GET | `/admin/chat/conversations/:id` | Messages paginés |

---

## Notifications (admin)

| Méthode | Route | Description |
|---------|-------|-------------|
| GET | `/admin/notifications?type&userId` | Historique in-app |
| POST | `/admin/notifications` | `{ userIds[], title, body, type? }` |

---

## Statistiques

| Route | Contenu |
|-------|---------|
| `GET /admin/stats/users` | KPIs |
| `GET /admin/stats/gender` | Répartition genre |
| `GET /admin/stats/age-groups` | Tranches d'âge |
| `GET /admin/stats/geography` | Top villes |
| `GET /admin/stats/revenue` | Placeholder MVP |

---

## Infrastructure & audit

| Route | Description |
|-------|-------------|
| `GET /admin/health` | Santé DB / Cloudinary / SMTP |
| `GET /admin/audit/logs` | Journal actions admin |

---

## Intégration Next.js (ce repo)

- Client API : `lib/api/admin.ts`
- Types : `lib/types/admin.ts`
- Proxy CORS : `app/api/backend/[...path]/route.ts`
- Pages : `app/admin/(protected)/*`

Variables frontend (`.env.local`) :

```env
NEXT_PUBLIC_API_URL=https://backendrdv-jf71.onrender.com
```

---

## Migration Render

```bash
npx prisma migrate deploy
# 20260612120000_add_admin_panel
```

Variables optionnelles backend :

```env
ADMIN_BOOTSTRAP_SECRET=change-me-long-random-secret
ADMIN_ACCESS_TOKEN_EXPIRES_IN=8h
ADMIN_REFRESH_TOKEN_EXPIRES_IN=7d
CORS_ORIGIN=http://localhost:3000,https://ton-domaine.vercel.app
```
