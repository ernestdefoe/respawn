import app from 'flarum/forum/app';
import { extend, override } from 'flarum/common/extend';
import IndexPage from 'flarum/forum/components/IndexPage';

import RespawnHero from './components/RespawnHero';
import RespawnStats from './components/RespawnStats';

/*
 * Apply the user's saved theme mode immediately at module-load time so
 * the page doesn't flash the wrong palette. We can't read the admin
 * default (app.forum.attribute) here — app.forum isn't populated until
 * Flarum finishes booting — so we use localStorage if present, dark
 * otherwise, and reconcile with the admin default inside the initializer.
 */
try {
  const saved = localStorage.getItem('respawn-mode');
  document.documentElement.setAttribute('data-respawn', saved || 'dark');
} catch (e) {
  document.documentElement.setAttribute('data-respawn', 'dark');
}

app.initializers.add('ernestdefoe-respawn', () => {
  /* -----------------------------------------------------------
   * Reconcile theme mode with the admin default
   * -----------------------------------------------------------
   * If the user hasn't explicitly chosen a mode (no localStorage
   * entry), honour the admin's configured default. If they have,
   * leave their choice alone.
   */
  try {
    if (!localStorage.getItem('respawn-mode') && app.forum) {
      const adminMode = app.forum.attribute('respawnMode') || 'dark';
      document.documentElement.setAttribute('data-respawn', adminMode);
    }
  } catch (e) { /* private-mode browsers can't read localStorage */ }

  window.respawnToggleMode = () => {
    const next = document.documentElement.getAttribute('data-respawn') === 'dark' ? 'light' : 'dark';
    document.documentElement.setAttribute('data-respawn', next);
    try { localStorage.setItem('respawn-mode', next); } catch (e) { /* ignore */ }
  };

  /* -----------------------------------------------------------
   * Replace the IndexPage hero with the Respawn hero.
   * Returning an array matches the working Mosaic pattern — the
   * stock hero slot expects iterable children, and a bare component
   * vnode misbehaves in some render passes.
   * ----------------------------------------------------------- */
  override(IndexPage.prototype, 'hero', function () {
    return [RespawnHero.component()];
  });

  /* -----------------------------------------------------------
   * Append the stats footer at the bottom of the index page.
   * ----------------------------------------------------------- */
  extend(IndexPage.prototype, 'contentItems', function (items) {
    items.add('respawn-stats', RespawnStats.component(), -100);
  });
});
