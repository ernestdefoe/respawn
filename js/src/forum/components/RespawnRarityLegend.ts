import app from 'flarum/forum/app';
import Component from 'flarum/common/Component';

/**
 * Rarity Tiers legend — static panel mapping tag colors to tier names
 * so users learn the gold/magenta/cyan/grey vocabulary.
 */
export default class RespawnRarityLegend extends Component {
  view() {
    const t = (key: string) => app.translator.trans('ernestdefoe-respawn.forum.rarity.' + key);

    return m('.RespawnPanel.RespawnRarityLegend', [
      m('h3.RespawnPanel-title', [m('span.arrow', '▸'), ' ', t('title')]),
      m('ul.RespawnRarityLegend-list', [
        m('li', [m('span.pip.legendary'), t('legendary')]),
        m('li', [m('span.pip.epic'), t('epic')]),
        m('li', [m('span.pip.rare'), t('rare')]),
        m('li', [m('span.pip.common'), t('common')]),
      ]),
    ]);
  }
}
