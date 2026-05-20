import app from 'flarum/forum/app';
import { extend, override } from 'flarum/common/extend';
import IndexPage from 'flarum/forum/components/IndexPage';
import HeaderSecondary from 'flarum/forum/components/HeaderSecondary';

import RespawnHero from './components/RespawnHero';
import RespawnStats from './components/RespawnStats';
import RespawnPlayerCard from './components/RespawnPlayerCard';
import RespawnRarityLegend from './components/RespawnRarityLegend';
import RespawnModeToggle from './components/RespawnModeToggle';

/*
 * Respawn keys off Flarum 2's native `<html data-theme="...">` signal
 * (set server-side from Admin → Appearance → Color Scheme). Our LESS
 * defines dark tokens as the default and light tokens under
 * [data-theme^='light'].
 *
 * Per-user override: if the user clicked the moon/sun toggle we honour
 * their localStorage choice and overwrite the server-side data-theme
 * value on each page boot. The Respawn admin setting (Theme Mode) is
 * the default when neither localStorage nor the Color Scheme picker
 * has been set.
 */
(function applySavedMode() {
  try {
    const saved = localStorage.getItem('respawn-mode');
    if (saved === 'light' || saved === 'dark') {
      document.documentElement.setAttribute('data-theme', saved);
    }
  } catch (e) { /* private mode */ }
})();

app.initializers.add('ernestdefoe-respawn', () => {
  /* -----------------------------------------------------------
   * Reconcile with the admin's Theme Mode default if neither the
   * Color Scheme picker nor a user toggle has explicitly set one.
   * ----------------------------------------------------------- */
  try {
    const localChoice = localStorage.getItem('respawn-mode');
    const flarumScheme = document.documentElement.getAttribute('data-theme');
    if (!localChoice && !flarumScheme && app.forum) {
      const adminDefault = app.forum.attribute('respawnMode') || 'dark';
      document.documentElement.setAttribute('data-theme', adminDefault);
    }
  } catch (e) { /* ignore */ }

  window.respawnToggleMode = () => {
    const current = document.documentElement.getAttribute('data-theme') || 'dark';
    const next = current.startsWith('dark') ? 'light' : 'dark';
    document.documentElement.setAttribute('data-theme', next);
    try { localStorage.setItem('respawn-mode', next); } catch (e) { /* ignore */ }
  };

  /* -----------------------------------------------------------
   * Replace the IndexPage hero with the Respawn hero.
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

  /* -----------------------------------------------------------
   * Header mode toggle (moon / sun).
   * ----------------------------------------------------------- */
  extend(HeaderSecondary.prototype, 'items', function (items) {
    items.add('respawn-mode-toggle', RespawnModeToggle.component(), 25);
  });

  /* -----------------------------------------------------------
   * Sidebar: Player Card + Rarity Legend below Flarum's nav.
   * ----------------------------------------------------------- */
  override(IndexPage.prototype, 'sidebar', function (original) {
    return [
      original(),
      RespawnPlayerCard.component(),
      RespawnRarityLegend.component(),
    ];
  });
});
