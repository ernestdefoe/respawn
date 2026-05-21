// @ts-nocheck — TODO: declare class properties + parameter types
// Transitional marker from the audit-driven TS conversion. The
// underlying JS uses Flarum's `this.foo = ...` initialiser pattern
// which TypeScript strict mode rejects. Remove once a follow-up pass
// adds explicit property declarations and vnode/callback types.
import app from 'flarum/forum/app';
import Component from 'flarum/common/Component';

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
  view() {
    const forumTitle = app.forum.attribute('title') || 'Respawn';
    const tagline    = (app.forum.attribute('respawnTagline') || '').trim();
    const eyebrow    = (app.forum.attribute('respawnEyebrow') || '').trim();
    const chipsRaw   = (app.forum.attribute('respawnChips')   || '').trim();
    const chips      = chipsRaw ? chipsRaw.split(',').map((s) => s.trim()).filter(Boolean) : [];

    return m('section.RespawnHero', [
      eyebrow ? m('.RespawnHero-eyebrow', eyebrow) : null,

      m('h1.RespawnHero-title', [
        'Welcome to ',
        m('span.accent', forumTitle),
        m('span.cursor'),
      ]),

      tagline ? m('p.RespawnHero-tagline', tagline) : null,

      chips.length
        ? m('.RespawnHero-chips',
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
