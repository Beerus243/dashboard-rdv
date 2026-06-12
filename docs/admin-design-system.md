# RDV — Design system & thème (dashboard)

Référence visuelle alignée sur l'app Flutter (`lib/theme/`). Utilisé pour le **dashboard web / admin** afin de garder la même identité que l'application mobile.

**Implémentation Next.js** : variables dans `app/globals.css`, composants dans `components/admin/admin-ui.tsx`, classe `.admin-root` pour la typo système.

Sources Flutter : `lib/theme/app_colors.dart`, `lib/theme/app_theme.dart`, `lib/theme/app_dimens.dart`, `lib/widgets/app_ui_primitives.dart`, `lib/widgets/app_explorer_layout.dart`.

---

## Identité

| Élément | Valeur |
|---------|--------|
| Nom produit | **RDV** |
| Style | Dating / social — proche Tinder + touches WhatsApp (dark mode) |
| Accent principal | Rose / magenta |
| Ton UI | Cartes arrondies, ombres légères, badges rose, actions swipe colorées |

---

## Palette — couleurs de marque

| Token | Hex | Usage |
|-------|-----|--------|
| `primary` | `#E73162` | CTA, AppBar (light), badges, liens, focus |
| `secondary` | `#FF4081` | Accent secondaire Material |
| `exploreGradientEnd` | `#F56B8A` | Fin dégradé hero Explorer |

**Dégradé hero** (bannières, onboarding, login admin) :

```css
background: linear-gradient(135deg, #E73162 0%, #F56B8A 100%);
```

Classe utilitaire : `.rdv-gradient-hero`

---

## Mode clair (Light)

| Token | Hex | Usage |
|-------|-----|--------|
| `bgLight` | `#F5F5F5` | Fond page / scaffold |
| `surfaceLight` | `#FFFFFF` | Cartes, inputs, modales |
| `appBarLight` | `#E73162` | Barre supérieure |
| `textDark` | `#212121` | Texte principal |
| `textMutedLight` | `#6B6B6B` | Sous-titres, labels secondaires |
| `textLight` | `#FFFFFF` | Texte sur fond primary |
| `dividerLight` | `#E0E0E0` | Séparateurs, bordures |
| `messageSurface` | `#FFF1F5` | Hover table, chips sélectionnés |

---

## Mode sombre (Dark)

Inspiration WhatsApp. Bascule via `ThemeProvider` (icône soleil/lune dans la barre admin).

| Token | Hex | Usage |
|-------|-----|--------|
| `bgDark` | `#0B141A` | Fond page |
| `surfaceDark` | `#202C33` | Cartes, listes |
| `appBarDark` | `#1F2C33` | AppBar |
| `textPrimaryDark` | `#E9EDEF` | Texte principal |
| `textMutedDark` | `#8696A0` | Texte secondaire |
| `dividerDark` | `#313D45` | Séparateurs |
| `chipSurfaceDark` | `#2A3942` | Chips / hover listes |

---

## Actions swipe & feedback

| Token | Hex | Surface | Usage |
|-------|-----|---------|--------|
| `likeGreen` | `#4CD964` | `#E8F7ED` | Like / succès |
| `nopeRed` | `#FF3B30` | `#FFECE9` | Pass / erreur |
| `superLikeBlue` | `#007AFF` | `#EAF2FF` | Super Like / warning |
| `rewindAmber` | `#F5B301` | — | Retour swipe |

---

## Composants admin (Next.js)

| Composant | Fichier | Rôle |
|-----------|---------|------|
| `AdminCard` | `admin-ui.tsx` | Carte `.rdv-card` — radius 18px, ombre légère |
| `AdminButton` | `admin-ui.tsx` | Primary / secondary / ghost / danger |
| `AdminInput` | `admin-ui.tsx` | Champs radius 18px, focus rose |
| `AdminBadge` | `admin-ui.tsx` | Badges sémantiques (like, nope, primary…) |
| `AdminTable` | `admin-ui.tsx` | Tables avec hover `#FFF1F5` / `#2A3942` |
| `AdminStatCard` | `admin-ui.tsx` | KPI dashboard avec accent optionnel |
| `AdminPillChip` | `admin-ui.tsx` | Filtres pill |
| `AdminShell` | `admin-shell.tsx` | Layout sidebar + header + toggle thème |

---

## Variables CSS

Définies dans `app/globals.css` :

```css
:root {
  --rdv-primary: #E73162;
  --rdv-bg: #F5F5F5;
  --rdv-surface: #FFFFFF;
  --rdv-text: #212121;
  --rdv-text-muted: #6B6B6B;
  --rdv-divider: #E0E0E0;
  --rdv-message-surface: #FFF1F5;
  --rdv-radius-card: 18px;
  --rdv-shadow-card: 0 5px 12px rgba(0, 0, 0, 0.08);
}

.dark {
  --rdv-bg: #0B141A;
  --rdv-surface: #202C33;
  --rdv-text: #E9EDEF;
  /* … */
}
```

Classes Tailwind : `bg-rdv-bg`, `text-rdv-text`, `text-rdv-muted`, `border-rdv-divider`, `bg-rdv-message`, etc.

---

## Typographie dashboard

Police **system-ui** via `.admin-root` (différente de Nunito sur l'app utilisateur).

| Style | Taille | Poids |
|-------|--------|-------|
| Titre page | 22px | 800 |
| Section | 13px | 700 |
| Corps | 14–15px | 400 |
| Label / badge | 11–13px | 600 |

---

## Checklist dashboard

- [x] `#E73162` comme couleur primaire unique
- [x] Fond light `#F5F5F5`, cartes blanches radius 18px
- [x] Tables : séparateurs `#E0E0E0`, hover `#FFF1F5`
- [x] Boutons primaires flat (sans ombre forte)
- [x] Dark mode : fond `#0B141A`, surfaces `#202C33`
- [x] Stats match / like : vert `#4CD964`, refus `#FF3B30`
- [x] Icônes Lucide, stroke cohérent

---

## Fichiers Flutter (référence)

| Fichier | Contenu |
|---------|---------|
| `lib/theme/app_colors.dart` | Palette complète |
| `lib/theme/app_theme.dart` | `ThemeData` light / dark |
| `lib/theme/app_dimens.dart` | Rayons boutons |
| `lib/widgets/app_explorer_layout.dart` | `AppLayout`, sections |
| `lib/widgets/app_ui_primitives.dart` | Card, Chip, Capsule |

---

*Dernière mise à jour : extrait du repo Flutter RDV 2025 — intégré dashboard Next.js.*
