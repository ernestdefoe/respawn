import app from 'flarum/forum/app';
import Component from 'flarum/common/Component';
import Avatar from 'flarum/common/components/Avatar';

/**
 * Player card — shows the logged-in user as a "player" with derived
 * level + XP progress. Hidden for guests.
 *
 * Level formula: floor(posts / 100) + 1. Progress = posts % 100.
 * Simple and gameable but no one's grinding for a forum level, so
 * that's fine.
 */
export default class RespawnPlayerCard extends Component {
  view() {
    const user = app.session.user;
    if (!user) return null;

    const posts = user.commentCount?.() || 0;
    const level = Math.floor(posts / 100) + 1;
    const progress = posts % 100;
    const t = (key: string, args?: Record<string, unknown>) =>
      app.translator.trans('ernestdefoe-respawn.forum.player.' + key, args);

    return m('.RespawnPanel.RespawnPlayerCard', [
      m('.RespawnPlayerCard-avatar', Avatar.component({ user })),
      m('.RespawnPlayerCard-name', user.username()),
      m('.RespawnPlayerCard-lvl', t('level', { level, posts: new Intl.NumberFormat().format(posts) })),
      m('.RespawnPlayerCard-xpBar', m('.fill', { style: `width: ${progress}%` })),
      m('.RespawnPlayerCard-xpLabel', [
        m('span', t('progress', { progress })),
        m('span', t('next', { level: level + 1 })),
      ]),
    ]);
  }
}
