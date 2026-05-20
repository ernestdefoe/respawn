import Component from 'flarum/common/Component';

/**
 * Header toggle that flips data-respawn between dark + light and
 * persists the choice in localStorage. Slots into the header's
 * primary controls ItemList so it sits alongside the search / nav
 * icons rather than inside the user dropdown.
 */
export default class RespawnModeToggle extends Component {
  view() {
    const mode = document.documentElement.getAttribute('data-respawn') || 'dark';
    const isDark = mode === 'dark';

    return m('button.Button.Button--icon.RespawnModeToggle', {
      type:    'button',
      title:   isDark ? 'Switch to light mode' : 'Switch to dark mode',
      onclick: () => {
        const next = isDark ? 'light' : 'dark';
        document.documentElement.setAttribute('data-respawn', next);
        try { localStorage.setItem('respawn-mode', next); } catch (e) { /* ignore */ }
        m.redraw();
      },
    }, m('span.Button-label', isDark ? '☀' : '☾'));
  }
}
