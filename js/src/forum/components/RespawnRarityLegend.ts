import Component from 'flarum/common/Component';

/**
 * Rarity Tiers legend — static panel mapping tag colors to tier names
 * so users learn the gold/magenta/cyan/grey vocabulary.
 */
export default class RespawnRarityLegend extends Component {
  view() {
    return m('.RespawnPanel.RespawnRarityLegend', [
      m('h3.RespawnPanel-title', [m('span.arrow', '▸'), ' Rarity Tiers']),
      m('ul.RespawnRarityLegend-list', [
        m('li', [m('span.pip.legendary'), 'Legendary']),
        m('li', [m('span.pip.epic'),      'Epic']),
        m('li', [m('span.pip.rare'),      'Rare']),
        m('li', [m('span.pip.common'),    'Common']),
      ]),
    ]);
  }
}
