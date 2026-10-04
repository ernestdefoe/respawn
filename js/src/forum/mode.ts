import app from 'flarum/forum/app';

/*
 * Which colour scheme Respawn wants, in order:
 *
 *   1. The member's own toggle (the moon/sun in the header).
 *   2. A choice they made through Flarum itself: their account's colour
 *      scheme preference, or a guest's pick from core's switcher. Core has
 *      already applied it, so Respawn stays out of the way.
 *   3. The admin's Theme Mode, while Admin → Appearance → Color Scheme is
 *      left on Auto. An admin who set that picker to Light or Dark has made
 *      the forum-wide choice explicitly, and it stands.
 *
 * Null means "leave core's answer alone".
 */
export function respawnScheme(): string | null {
  const toggle = savedToggle();
  if (toggle) return toggle;

  const forumDefault = app.forum.attribute<string>('colorScheme') || 'auto';
  if (forumDefault !== 'auto') return null;

  /*
   * 🚨 'auto' is not a choice. Core gives EVERY member a colorScheme
   * preference of 'auto' by default, so counting it made the admin's Theme
   * Mode apply to guests only.
   */
  const user = app.session.user;
  const ownChoice = user ? user.preferences()?.colorScheme : sessionGet('colorScheme');
  if (ownChoice && ownChoice !== 'auto') return null;

  return app.forum.attribute<string>('respawnMode') || 'dark';
}

/** Remembers the toggle, and keeps it on the member's account too, so it follows them to other devices. */
export function rememberToggle(scheme: 'light' | 'dark'): void {
  try {
    localStorage.setItem('respawn-mode', scheme);
  } catch (e) {
    /* private mode */
  }

  const user = app.session.user;
  if (user && (app as any).allowUserColorScheme) {
    user.savePreferences({ colorScheme: scheme }).catch(() => {});
  }
}

export function forgetToggle(): void {
  try {
    localStorage.removeItem('respawn-mode');
  } catch (e) {
    /* private mode */
  }
}

let resolving = false;

/** True while core is working out the scheme itself, as opposed to a member picking one. */
export function respawnResolving(): boolean {
  return resolving;
}

export function setRespawnResolving(value: boolean): void {
  resolving = value;
}

function savedToggle(): 'light' | 'dark' | null {
  try {
    const saved = localStorage.getItem('respawn-mode');
    return saved === 'light' || saved === 'dark' ? saved : null;
  } catch (e) {
    return null;
  }
}

function sessionGet(key: string): string | null {
  try {
    return sessionStorage.getItem(key);
  } catch (e) {
    return null;
  }
}
