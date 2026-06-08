import app from 'flarum/forum/app';
import Component from 'flarum/common/Component';
import type Mithril from 'mithril';

/**
 * Replaces the IndexPage hero with Respawn's branded panel: eyebrow,
 * big mono headline with blinking cursor, tagline, and an optional row
 * of tag-shortcut chips driven by an admin-set comma-separated slug
 * list.
 *
 * Tagline and eyebrow are admin-configurable via app.forum.attribute;
 * the empty string hides the relevant element.
 */
export default class RespawnHero extends Component {
  view(): Mithril.Children {
    const forumTitle = (app.forum.attribute('title') as string) || 'Respawn';
    const tagline = ((app.forum.attribute('respawnTagline') as string) || '').trim();
    const eyebrow = ((app.forum.attribute('respawnEyebrow') as string) || '').trim();
    const chipsRaw = ((app.forum.attribute('respawnChips') as string) || '').trim();
    const chips = chipsRaw ? chipsRaw.split(',').map((s) => s.trim()).filter(Boolean) : [];

    return m('section.RespawnHero', [
      eyebrow ? m('.RespawnHero-eyebrow', eyebrow) : null,

      m('h1.RespawnHero-title', [
        app.translator.trans('ernestdefoe-respawn.forum.hero.welcome', {
          forum: m('span.accent', forumTitle),
        }),
        m('span.cursor'),
      ]),

      tagline ? m('p.RespawnHero-tagline', tagline) : null,

      chips.length
        ? m(
            '.RespawnHero-chips',
            chips.map((slug) =>
              m('a.RespawnHero-chip', { href: app.route('tag', { tags: slug }) }, [
                m('span.glyph', '◢'),
                slug.replace(/-/g, ' '),
              ])
            )
          )
        : null,
    ]);
  }
}
