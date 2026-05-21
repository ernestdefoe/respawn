// @ts-nocheck — TODO: declare class properties + parameter types
// Transitional marker from the audit-driven TS conversion. The
// underlying JS uses Flarum's `this.foo = ...` initialiser pattern
// which TypeScript strict mode rejects. Remove once a follow-up pass
// adds explicit property declarations and vnode/callback types.
import app from 'flarum/forum/app';
import Component from 'flarum/common/Component';

/**
 * Stats footer rendered at the bottom of the index page. Reads counts
 * from the forum payload (respawnPostCount, respawnDiscussionCount,
 * respawnMemberCount, respawnOnlineCount) which ForumStatistics
 * computes server-side at a 60s cache.
 *
 * Null values render as "—" rather than a misleading 0 — the cached
 * computation can fail (DB blip) and we'd rather show that than lie.
 */
export default class RespawnStats extends Component {
  view() {
    const t = (k, fallback) => fallback;  // locales wired later

    const fmt = (n) => {
      if (n == null) return '—';
      return new Intl.NumberFormat().format(n);
    };

    const posts       = app.forum.attribute('respawnPostCount');
    const discussions = app.forum.attribute('respawnDiscussionCount');
    const members     = app.forum.attribute('respawnMemberCount');
    const online      = app.forum.attribute('respawnOnlineCount');

    return m('section.RespawnStats', [
      m('h3.RespawnStats-title', [
        m('span.arrow', '▸'),
        ' Server Status',
      ]),
      m('.RespawnStats-grid', [
        this.card('◆', 'Posts',       fmt(posts)),
        this.card('◇', 'Discussions', fmt(discussions)),
        this.card('⬢', 'Members',     fmt(members)),
        this.card('▶', 'Online Now',  fmt(online), true),
      ]),
    ]);
  }

  card(glyph, label, value, live = false) {
    return m('.RespawnStats-card', [
      m('.RespawnStats-label', [m('span.glyph', glyph), ' ', label]),
      m('.RespawnStats-value', value),
      live
        ? m('.RespawnStats-delta.live', 'LIVE')
        : null,
    ]);
  }
}
