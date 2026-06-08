import app from 'flarum/forum/app';
import Component from 'flarum/common/Component';
import extractText from 'flarum/common/utils/extractText';
import type Mithril from 'mithril';

/**
 * Header toggle that flips Flarum's native data-theme between dark
 * and light and persists the choice in localStorage. Sits alongside
 * the search / notifications icons in HeaderSecondary.
 */
export default class RespawnModeToggle extends Component {
  view(): Mithril.Children {
    const current = document.documentElement.getAttribute('data-theme') || 'dark';
    const isDark = current.startsWith('dark');
    const label = extractText(
      app.translator.trans(
        isDark ? 'ernestdefoe-respawn.forum.mode.to_light' : 'ernestdefoe-respawn.forum.mode.to_dark'
      )
    );

    return m(
      'button.RespawnModeToggle',
      {
        type: 'button',
        title: label,
        'aria-label': label,
        onclick: () => {
          const next = isDark ? 'light' : 'dark';
          document.documentElement.setAttribute('data-theme', next);
          try {
            localStorage.setItem('respawn-mode', next);
          } catch (e) {
            /* ignore */
          }
          m.redraw();
        },
      },
      isDark ? '☀' : '☾'
    );
  }
}
