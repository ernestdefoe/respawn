import Component from 'flarum/common/Component';

/**
 * Header toggle that flips Flarum's native data-theme between dark
 * and light and persists the choice in localStorage. Sits alongside
 * the search / notifications icons in HeaderSecondary.
 *
 * Note: we read/write the canonical `data-theme` attribute Flarum
 * itself sets — so the Color Scheme picker in Admin → Appearance and
 * this toggle drive the same switch.
 */
export default class RespawnModeToggle extends Component {
  view() {
    const current = document.documentElement.getAttribute('data-theme') || 'dark';
    const isDark = current.startsWith('dark');

    return m('button.Button.Button--icon.RespawnModeToggle', {
      type:    'button',
      title:   isDark ? 'Switch to light mode' : 'Switch to dark mode',
      onclick: () => {
        const next = isDark ? 'light' : 'dark';
        document.documentElement.setAttribute('data-theme', next);
        try { localStorage.setItem('respawn-mode', next); } catch (e) { /* ignore */ }
        m.redraw();
      },
    }, m('span.Button-label', isDark ? '☀' : '☾'));
  }
}
