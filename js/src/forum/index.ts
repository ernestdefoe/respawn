import app from 'flarum/forum/app';
import { extend, override } from 'flarum/common/extend';
import IndexPage from 'flarum/forum/components/IndexPage';
import HeaderSecondary from 'flarum/forum/components/HeaderSecondary';
import type ItemList from 'flarum/common/utils/ItemList';
import type Mithril from 'mithril';

import RespawnHero from './components/RespawnHero';
import RespawnStats from './components/RespawnStats';
import RespawnPlayerCard from './components/RespawnPlayerCard';
import RespawnRarityLegend from './components/RespawnRarityLegend';
import RespawnModeToggle from './components/RespawnModeToggle';

import { respawnScheme, respawnResolving, setRespawnResolving, forgetToggle } from './mode';

/*
 * Respawn keys off Flarum 2's native `<html data-theme="...">` signal. Our
 * LESS defines dark tokens as the default and light tokens under
 * [data-theme^='light'].
 *
 * Applied once here, as the script loads, so a member who chose dark doesn't
 * see a flash of light while the forum boots. The initializer below is what
 * makes it stick.
 */
(function applySavedMode() {
  try {
    const saved = localStorage.getItem('respawn-mode');
    if (saved === 'light' || saved === 'dark') {
      document.documentElement.setAttribute('data-theme', saved);
    }
  } catch (e) {
    /* private mode */
  }
})();

app.initializers.add('ernestdefoe-respawn', () => {
  /* -----------------------------------------------------------
   * 🚨 Hook core's own colour-scheme resolution; don't race it.
   *
   * Core decides the scheme in initColorScheme(), which runs when the app
   * MOUNTS — after every initializer and after the early apply above — and it
   * overwrote whatever Respawn had set. So a member who picked dark got light
   * back on every refresh, and the admin's Theme Mode never applied at all,
   * because core always sets data-theme and the old "only if nothing set it"
   * check could never pass. (RESP-6)
   *
   * Core also re-runs it whenever the system scheme changes, which comes
   * back through this same override.
   * ----------------------------------------------------------- */
  override(app as any, 'initColorScheme', function (this: any, original: (...args: any[]) => void, ...args: any[]) {
    setRespawnResolving(true);
    try {
      original(...args);

      const scheme = respawnScheme();
      if (scheme) this.setColorScheme(scheme);
    } finally {
      setRespawnResolving(false);
    }
  });

  /*
   * A scheme chosen through Flarum's own settings or switcher is a newer,
   * explicit choice, so it replaces the toggle's remembered one.
   */
  override(app as any, 'setColorScheme', function (original: (scheme: string) => void, scheme: string) {
    if (!respawnResolving()) forgetToggle();
    original(scheme);
  });

  /* -----------------------------------------------------------
   * Replace the IndexPage hero with the Respawn hero.
   * ----------------------------------------------------------- */
  override(IndexPage.prototype, 'hero', function (): Mithril.Children {
    return [RespawnHero.component()];
  });

  /* -----------------------------------------------------------
   * Append the stats footer at the bottom of the index page.
   * ----------------------------------------------------------- */
  extend(IndexPage.prototype, 'contentItems', function (items: ItemList<Mithril.Children>) {
    items.add('respawn-stats', RespawnStats.component(), -100);
  });

  /* -----------------------------------------------------------
   * Header mode toggle (moon / sun).
   * ----------------------------------------------------------- */
  extend(HeaderSecondary.prototype, 'items', function (items: ItemList<Mithril.Children>) {
    items.add('respawn-mode-toggle', RespawnModeToggle.component(), 25);
  });

  /* -----------------------------------------------------------
   * Sidebar: Player Card + Rarity Legend below Flarum's nav.
   * ----------------------------------------------------------- */
  override(IndexPage.prototype, 'sidebar', function (original: () => Mithril.Children): Mithril.Children {
    return [original(), RespawnPlayerCard.component(), RespawnRarityLegend.component()];
  });
});
