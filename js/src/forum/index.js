import app from 'flarum/forum/app';
import { extend, override } from 'flarum/common/extend';
import IndexPage from 'flarum/forum/components/IndexPage';

import RespawnHero from './components/RespawnHero';
import RespawnStats from './components/RespawnStats';

app.initializers.add('ernestdefoe-respawn', () => {
  /* -----------------------------------------------------------
   * Theme mode — apply admin default + listen for user toggle
   * ----------------------------------------------------------- */
  const adminMode = app.forum.attribute('respawnMode') || 'dark';
  const saved = (typeof localStorage !== 'undefined' && localStorage.getItem('respawn-mode')) || adminMode;
  document.documentElement.setAttribute('data-respawn', saved);

  // Expose a global toggle helper users (or any future header button) can call.
  window.respawnToggleMode = () => {
    const next = document.documentElement.getAttribute('data-respawn') === 'dark' ? 'light' : 'dark';
    document.documentElement.setAttribute('data-respawn', next);
    try { localStorage.setItem('respawn-mode', next); } catch (e) { /* private mode */ }
  };

  /* -----------------------------------------------------------
   * Replace the IndexPage hero with the Respawn hero
   * ----------------------------------------------------------- */
  override(IndexPage.prototype, 'hero', function () {
    return RespawnHero.component();
  });

  /* -----------------------------------------------------------
   * Append the stats footer to the bottom of the index page
   * ----------------------------------------------------------- */
  extend(IndexPage.prototype, 'contentItems', function (items) {
    items.add('respawn-stats', RespawnStats.component(), -100);
  });
});
