# Respawn

A gaming theme for **Flarum 2**: chamfered surfaces, neon accents, mono typography, hex-clipped avatars, hero with blinking cursor, level/XP sidebar widget, and a stats footer.

---

## Features

- **Dark + Light mode** — admin-configurable default, per-user toggle in the header (☾ / ☀)
- **Branded hero** — replaces the default `IndexPage` hero with a panel showing an eyebrow line, big mono headline ("Welcome to {forum}"), tagline, and an optional row of tag-shortcut chips
- **Server-status footer** — four chamfered stat cards (Posts · Discussions · Members · Online Now) rendered at the bottom of the index page, cached server-side at 60s
- **Player Card** — sidebar widget for the logged-in user with hex avatar, derived `LVL N · {posts} POSTS`, and a cyan→magenta XP bar
- **Rarity Legend** — sidebar panel mapping the four tag-color tiers (Legendary / Epic / Rare / Common) so newcomers learn the vocabulary
- **Post styling** — chamfered post cards, mono usernames in cyan, post-number pills, accent-bordered blockquotes, mono code blocks
- **Composer + Scrubber** — restyled to match the theme

The theme is a pure CSS/LESS skin layered on top of stock Flarum — no Mithril components replaced or routes added beyond the small components above. Anything that uses Flarum's CSS variables (`--primary-color`, `--secondary-color`, etc.) is remapped, so most extensions skin for free.

---

## Requirements

- Flarum 2.x
- PHP 8.3+

---

## Installation

```bash
composer require ernestdefoe/respawn
php flarum cache:clear
```

Then enable **Respawn** in **Admin → Extensions**.

---

## Configuration

All settings are in **Admin → Extensions → Respawn**.

| Setting | Description | Default |
|---|---|---|
| **Theme Mode** | Default colour mode for new visitors (`Dark` or `Light`). Users can toggle with the moon/sun button in the header. | `Dark` |
| **Hero Tagline** | Subtitle shown under the welcome headline. Leave blank to hide. | `Drop in, level up, and join the discussion.` |
| **Hero Eyebrow** | Small accent line above the headline. | `▸ Player Connected` |
| **Hero Tag Chips** | Comma-separated list of tag slugs to feature as quick-jump chips (e.g. `halo, elden-ring, deals`). Leave blank to hide. | *(blank)* |

The hero headline reads from Flarum's standard **Forum Title** setting (Admin → Basics).

---

## How the stats are computed

`ForumStatistics` queries the `posts`, `discussions`, `users`, and `users.last_seen_at` tables and caches each count for 60 seconds. The "Online Now" tile uses a 5-minute activity window matching Flarum's stock indicator. Any DB error renders the affected tile as `—` rather than a misleading `0`.

---

## Player Card level formula

Currently: **`level = floor(posts / 100) + 1`**, progress to next level = `posts % 100`.

It's a deliberately simple linear ramp. If you want a non-linear curve (exponential, custom thresholds, Bronze/Silver/Gold ranks instead of a number), open an issue.

---

## Customising

The theme exposes its tokens as CSS variables on `:root` (and `[data-respawn="light"]`), so an extension or custom CSS can override any of them without touching Respawn itself:

```css
:root {
  --r-accent:  #50ff8a;    /* lime instead of cyan */
  --r-magenta: #ff6b35;    /* orange instead of magenta */
}
```

Every component reads through these variables.

---

## Support

Questions, bug reports, and feature requests:

- **Support forum:** https://ernestdefoe.online
- **Issues:** https://github.com/ernestdefoe/respawn/issues

---

## License

Respawn is released under the [MIT License](LICENSE).

Copyright © ernestdefoe.
