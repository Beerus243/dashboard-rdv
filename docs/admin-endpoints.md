# Endpoints admin — liste complète

Base URL prod : `https://backendrdv-jf71.onrender.com`  
Base URL local : `http://localhost:3001`

**Auth** (sauf login et bootstrap) :

```http
Authorization: Bearer <accessToken>
```

Token obtenu via `POST /admin/auth/login`.

---

## Rôles

| Rôle | Code |
|------|------|
| Super admin | `SUPER_ADMIN` |
| Admin | `ADMIN` |
| Modérateur | `MODERATOR` |
| Observateur | `OBSERVER` |

`SUPER_ADMIN` a accès à toutes les routes protégées.

---

## Pagination (commune)

Query params sur la plupart des listes :

| Param | Défaut | Max | Description |
|-------|--------|-----|-------------|
| `page` | 1 | — | Page |
| `limit` | 20–50 | 100 | Éléments par page |
| `search` | — | — | Recherche texte |

Réponse type :

```json
{
  "data": [],
  "meta": { "total": 0, "page": 1, "limit": 20, "hasMore": false }
}
```

---

## 1. Auth — `/admin/auth`

| Méthode | Route | Auth | Rôles | Description |
|---------|-------|------|-------|-------------|
| POST | `/admin/auth/login` | Non | — | Connexion dashboard |
| POST | `/admin/auth/bootstrap` | Non | — | Promouvoir le 1er admin (secret serveur) |
| GET | `/admin/auth/me` | Oui | admin* | Profil admin connecté |

### POST `/admin/auth/login`

```json
{
  "email": "admin@example.com",
  "password": "Password123!"
}
```

**Réponse 200**

```json
{
  "user": {
    "id": "clxxx",
    "email": "admin@example.com",
    "name": "Admin",
    "adminRole": "SUPER_ADMIN",
    "avatarUrl": null
  },
  "accessToken": "...",
  "refreshToken": "..."
}
```

**Erreurs** : `401` identifiants invalides ou pas de rôle admin · `403` compte désactivé

---

### POST `/admin/auth/bootstrap`

Promotion initiale sans SQL. Nécessite `ADMIN_BOOTSTRAP_SECRET` sur Render.

```json
{
  "email": "admin@example.com",
  "secret": "ton-secret-bootstrap",
  "adminRole": "SUPER_ADMIN"
}
```

`adminRole` optionnel (défaut `SUPER_ADMIN`).

Le compte doit exister (`POST /auth/register`) **avec mot de passe** (pas Google seul).

**Réponse 200**

```json
{
  "message": "Compte promu en SUPER_ADMIN.",
  "user": {
    "email": "admin@example.com",
    "name": "Admin",
    "adminRole": "SUPER_ADMIN"
  }
}
```

---

### GET `/admin/auth/me`

**Réponse 200**

```json
{
  "id": "clxxx",
  "email": "admin@example.com",
  "name": "Admin",
  "adminRole": "SUPER_ADMIN",
  "avatarUrl": null
}
```

---

## 2. Utilisateurs — `/admin/users`

| Méthode | Route | Rôles | Description |
|---------|-------|-------|-------------|
| GET | `/admin/users` | read* | Liste paginée |
| GET | `/admin/users/:id` | read* | Détail utilisateur |
| PUT | `/admin/users/:id` | ADMIN+ | Modifier / bannir / rôle |
| DELETE | `/admin/users/:id` | ADMIN+ | Ban (soft) |

\* `SUPER_ADMIN`, `ADMIN`, `MODERATOR`, `OBSERVER`

### GET `/admin/users`

Query :

| Param | Description |
|-------|-------------|
| `page`, `limit`, `search` | Pagination + recherche nom/email |
| `active` | `true` ou `false` |
| `adminRole` | `SUPER_ADMIN`, `ADMIN`, `MODERATOR`, `OBSERVER` |

---

### GET `/admin/users/:id`

Profil complet : user, profile, photos, comptes OAuth, stats (swipes, matchs, reports, blocks).

---

### PUT `/admin/users/:id`

```json
{
  "name": "Nouveau nom",
  "isActive": false,
  "banReason": "Spam",
  "adminRole": "MODERATOR"
}
```

Tous les champs optionnels.  
`adminRole` : **SUPER_ADMIN uniquement** pour attribuer/retirer un rôle (`null` pour retirer).

---

### DELETE `/admin/users/:id`

Équivalent ban : `isActive: false`, `banReason` par défaut.  
Impossible de bannir un `SUPER_ADMIN` ou soi-même.

---

## 3. Signalements — `/admin/reports`

| Méthode | Route | Rôles | Description |
|---------|-------|-------|-------------|
| GET | `/admin/reports` | modération + read | Liste |
| GET | `/admin/reports/:id` | modération + read | Détail |
| POST | `/admin/reports/:id/close` | modération | Clôturer |

Rôles modération : `SUPER_ADMIN`, `ADMIN`, `MODERATOR`

### GET `/admin/reports`

Query : `page`, `limit`, `search`, `status` = `OPEN` | `CLOSED`

---

### POST `/admin/reports/:id/close`

```json
{
  "resolution": "Profil suspendu après vérification"
}
```

---

## 4. Modération — `/admin/moderation`

| Méthode | Route | Rôles | Description |
|---------|-------|-------|-------------|
| GET | `/admin/moderation/photos` | modération | File photos |
| POST | `/admin/moderation/photos/:id` | modération | Approuver / refuser |
| GET | `/admin/moderation/messages` | modération | Messages users signalés |

### GET `/admin/moderation/photos`

Query : `status` = `PENDING` (défaut) | `APPROVED` | `REJECTED`

---

### POST `/admin/moderation/photos/:id`

```json
{
  "action": "approve",
  "reason": "Optionnel si reject"
}
```

`action` : `"approve"` | `"reject"`

---

### GET `/admin/moderation/messages`

Messages récents des utilisateurs ayant au moins un signalement `OPEN`.

---

## 5. Matchs — `/admin/matches`

| Méthode | Route | Rôles | Description |
|---------|-------|-------|-------------|
| GET | `/admin/matches` | read* | Liste matchs paginée |

Inclut `user1`, `user2` avec profil (avatar, ville).

---

## 6. Chat — `/admin/chat`

| Méthode | Route | Rôles | Description |
|---------|-------|-------|-------------|
| GET | `/admin/chat/conversations` | modération + read | Liste conversations |
| GET | `/admin/chat/conversations/:id` | modération + read | Messages d'une conversation |

### GET `/admin/chat/conversations`

Participants, dernier message, `messageCount`.

### GET `/admin/chat/conversations/:id`

Query : `page`, `limit` (défaut 50). Messages avec `sender` (`id`, `name`, `avatarUrl`).

---

## 7. Notifications — `/admin/notifications`

| Méthode | Route | Rôles | Description |
|---------|-------|-------|-------------|
| GET | `/admin/notifications` | read* | Historique in-app |
| POST | `/admin/notifications` | ADMIN+ | Envoyer notif + push FCM |

### GET `/admin/notifications`

Query : `page`, `limit`, `search`, `type` (`MATCH`|`MESSAGE`|`LIKE`|`SYSTEM`), `userId`

---

### POST `/admin/notifications`

```json
{
  "userIds": ["clxxx", "clyyy"],
  "title": "Annonce RDV",
  "body": "Message aux utilisateurs",
  "type": "SYSTEM"
}
```

`type` optionnel (défaut `SYSTEM`).

---

## 8. Statistiques — `/admin/stats`

| Méthode | Route | Rôles | Description |
|---------|-------|-------|-------------|
| GET | `/admin/dashboard` | read* | Vue d'ensemble page d'accueil |
| GET | `/admin/stats/overview` | read* | Ancien KPI global (modération, admins…) |
| GET | `/admin/stats/users` | read* | Répartition genre / vérifiés |
| GET | `/admin/stats/activity` | read* | Online, actifs 24 h / 7 j |
| GET | `/admin/stats/matches` | read* | Matchs total / today / week |
| GET | `/admin/stats/messages` | read* | Messages total / today / moyenne |
| GET | `/admin/stats/swipes` | read* | Likes / passes / super likes |
| GET | `/admin/stats/retention` | read* | Rétention J1 / J7 / J30 (%) |
| GET | `/admin/stats/gender` | read* | Répartition genre (legacy) |
| GET | `/admin/stats/age-groups` | read* | Tranches d'âge |
| GET | `/admin/stats/geography` | read* | Top 50 villes |
| GET | `/admin/stats/revenue` | infra | Placeholder MVP |

> **Juillet 2026** : l'ancien payload KPI sur `GET /admin/stats/users` est sur **`/admin/stats/overview`**. Voir [`admin-changelog-july-2026.md`](./admin-changelog-july-2026.md).

### GET `/admin/stats/overview` — exemple réponse

```json
{
  "totalUsers": 1200,
  "activeUsers": 1150,
  "bannedUsers": 50,
  "verifiedUsers": 980,
  "admins": 3,
  "newToday": 12,
  "newWeek": 85,
  "newMonth": 320,
  "totalMatches": 450,
  "totalMessages": 8900,
  "openReports": 7,
  "pendingPhotos": 4
}
```

---

## 8b. Utilisateurs temps réel — `/admin/users`

| Méthode | Route | Rôles | Description |
|---------|-------|-------|-------------|
| GET | `/admin/users/online` | read* | Utilisateurs connectés |
| GET | `/admin/users/recent` | read* | Derniers inscrits (`limit` 1–100) |

---

## 8c. Bugs app — `/admin/bugs`

| Méthode | Route | Rôles | Description |
|---------|-------|-------|-------------|
| GET | `/admin/bugs` | read* | Liste signalements bugs (`status`, pagination) |

Côté app mobile : `POST /bugs` (utilisateur connecté).

---

## 9. Infrastructure — `/admin`

| Méthode | Route | Rôles | Description |
|---------|-------|-------|-------------|
| GET | `/admin/health` | read* + infra | Santé DB, Cloudinary, SMTP |

Même payload que `GET /health` public :

```json
{
  "status": "ok",
  "timestamp": "...",
  "services": {
    "database": "up",
    "cloudinary": "up",
    "smtp": "up"
  }
}
```

---

## 10. Audit — `/admin/audit`

| Méthode | Route | Rôles | Description |
|---------|-------|-------|-------------|
| GET | `/admin/audit/logs` | infra | Journal actions admin |

Query : `page`, `limit`, `search`

Actions loguées : `user.update`, `user.ban`, `report.close`, `photo.approve`, `photo.reject`, `notification.send`

---

## 11. Non implémenté (404)

| Méthode | Route | Message |
|---------|-------|---------|
| GET | `/admin/communities` | Communities module not implemented |
| GET | `/admin/events` | Events module not implemented |

Pas de modèle Communautés / Événements en base pour l'instant.

---

## Récapitulatif — routes actives

| # | Méthode | Route |
|---|---------|-------|
| 1 | POST | `/admin/auth/login` |
| 2 | POST | `/admin/auth/bootstrap` |
| 3 | GET | `/admin/auth/me` |
| 4 | GET | `/admin/dashboard` |
| 5 | GET | `/admin/users` |
| 6 | GET | `/admin/users/online` |
| 7 | GET | `/admin/users/recent` |
| 8 | GET | `/admin/users/:id` |
| 9 | PUT | `/admin/users/:id` |
| 10 | DELETE | `/admin/users/:id` |
| 11 | GET | `/admin/reports` |
| 12 | GET | `/admin/reports/:id` |
| 13 | POST | `/admin/reports/:id/close` |
| 14 | GET | `/admin/bugs` |
| 15 | GET | `/admin/moderation/photos` |
| 16 | POST | `/admin/moderation/photos/:id` |
| 17 | GET | `/admin/moderation/messages` |
| 18 | GET | `/admin/matches` |
| 19 | GET | `/admin/chat/conversations` |
| 20 | GET | `/admin/chat/conversations/:id` |
| 21 | GET | `/admin/notifications` |
| 22 | POST | `/admin/notifications` |
| 23 | GET | `/admin/stats/overview` |
| 24 | GET | `/admin/stats/users` |
| 25 | GET | `/admin/stats/activity` |
| 26 | GET | `/admin/stats/matches` |
| 27 | GET | `/admin/stats/messages` |
| 28 | GET | `/admin/stats/swipes` |
| 29 | GET | `/admin/stats/retention` |
| 30 | GET | `/admin/stats/gender` |
| 31 | GET | `/admin/stats/age-groups` |
| 32 | GET | `/admin/stats/geography` |
| 33 | GET | `/admin/stats/revenue` |
| 34 | GET | `/admin/health` |
| 35 | GET | `/admin/audit/logs` |
| — | GET | `/admin/communities` *(404)* |
| — | GET | `/admin/events` *(404)* |

---

## Variables d'environnement

```env
ADMIN_BOOTSTRAP_SECRET=change-me-long-random-secret
ADMIN_ACCESS_TOKEN_EXPIRES_IN=8h
ADMIN_REFRESH_TOKEN_EXPIRES_IN=7d
```

---

## Migration requise

```bash
npx prisma migrate deploy
# 20260612120000_add_admin_panel
```

---

## Liens

- [`admin-api-backend.md`](./admin-api-backend.md) — guide setup & RBAC
- [`admin-dashboard-prd.md`](./admin-dashboard-prd.md) — spec produit
