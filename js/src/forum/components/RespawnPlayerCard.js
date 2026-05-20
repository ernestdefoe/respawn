import app from 'flarum/forum/app';
import Component from 'flarum/common/Component';
import avatar from 'flarum/common/helpers/avatar';

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
    const toNext = 100 - progress;

    return m('.RespawnPanel.RespawnPlayerCard', [
      m('.RespawnPlayerCard-avatar', avatar(user)),
      m('.RespawnPlayerCard-name', user.username()),
      m('.RespawnPlayerCard-lvl', `LVL ${level} · ${new Intl.NumberFormat().format(posts)} POSTS`),
      m('.RespawnPlayerCard-xpBar', m('.fill', { style: `width: ${progress}%` })),
      m('.RespawnPlayerCard-xpLabel', [
        m('span', `${progress} / 100`),
        m('span', `NEXT: LVL ${level + 1}`),
      ]),
    ]);
  }
}
