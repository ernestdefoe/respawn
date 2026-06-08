import app from 'flarum/admin/app';
import Admin from 'flarum/common/extenders/Admin';
import extractText from 'flarum/common/utils/extractText';

const t = (key: string): string => extractText(app.translator.trans('ernestdefoe-respawn.admin.settings.' + key));

export default [
  new Admin()
    .setting(() => ({
      setting: 'ernestdefoe-respawn.mode',
      label: t('mode_label'),
      help: t('mode_help'),
      type: 'select',
      options: { dark: t('mode_option_dark'), light: t('mode_option_light') },
      default: 'dark',
    }))
    .setting(() => ({
      setting: 'ernestdefoe-respawn.tagline',
      label: t('tagline_label'),
      help: t('tagline_help'),
      type: 'text',
      placeholder: t('tagline_placeholder'),
    }))
    .setting(() => ({
      setting: 'ernestdefoe-respawn.eyebrow',
      label: t('eyebrow_label'),
      help: t('eyebrow_help'),
      type: 'text',
      placeholder: t('eyebrow_placeholder'),
    }))
    .setting(() => ({
      setting: 'ernestdefoe-respawn.chips',
      label: t('chips_label'),
      help: t('chips_help'),
      type: 'text',
      placeholder: t('chips_placeholder'),
    })),
];
