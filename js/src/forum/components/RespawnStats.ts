import app from 'flarum/forum/app';
import Component from 'flarum/common/Component';
import type Mithril from 'mithril';

/**
 * Stats footer rendered at the bottom of the index page. Reads counts
 * from the forum payload (respawnPostCount, respawnDiscussionCount,
 * respawnMemberCount, respawnOnlineCount) which ForumStatistics
 * computes server-side at a 60s cache.
 *
 * Null values render as the "empty" glyph rather than a misleading 0 — the
 * cached computation can fail (DB blip) and we'd rather show that than lie.
 */
export default class RespawnStats extends Component {
  view(): Mithril.Children {
    const fmt = (n: number | null): Mithril.Children => {
      if (n == null) return app.translator.trans('ernestdefoe-respawn.forum.stats.empty');
      return new Intl.NumberFormat().format(n);
    };

    const posts = app.forum.attribute('respawnPostCount') as number | null;
    const discussions = app.forum.attribute('respawnDiscussionCount') as number | null;
    const members = app.forum.attribute('respawnMemberCount') as number | null;
    const online = app.forum.attribute('respawnOnlineCount') as number | null;

    return m('section.RespawnStats', [
      m('h3.RespawnStats-title', [
        m('span.arrow', '▸'),
        ' ',
        app.translator.trans('ernestdefoe-respawn.forum.stats.title'),
      ]),
      m('.RespawnStats-grid', [
        this.card('◆', app.translator.trans('ernestdefoe-respawn.forum.stats.posts'), fmt(posts)),
        this.card('◇', app.translator.trans('ernestdefoe-respawn.forum.stats.discussions'), fmt(discussions)),
        this.card('⬢', app.translator.trans('ernestdefoe-respawn.forum.stats.members'), fmt(members)),
        this.card('▶', app.translator.trans('ernestdefoe-respawn.forum.stats.online'), fmt(online), true),
      ]),
    ]);
  }

  card(glyph: string, label: Mithril.Children, value: Mithril.Children, live = false): Mithril.Children {
    return m('.RespawnStats-card', [
      m('.RespawnStats-label', [m('span.glyph', glyph), ' ', label]),
      m('.RespawnStats-value', value),
      live ? m('.RespawnStats-delta.live', app.translator.trans('ernestdefoe-respawn.forum.stats.live')) : null,
    ]);
  }
}
