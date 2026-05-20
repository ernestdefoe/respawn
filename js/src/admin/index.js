import { Admin } from 'flarum/common/extenders';

export default [
  new Admin()
    .setting(() => ({
      setting:     'ernestdefoe-respawn.mode',
      label:       'Theme Mode',
      help:        'Default colour mode. Users can toggle with the moon/sun icon in the header.',
      type:        'select',
      options:     { dark: 'Dark', light: 'Light' },
      default:     'dark',
    }))
    .setting(() => ({
      setting:     'ernestdefoe-respawn.tagline',
      label:       'Hero Tagline',
      help:        'Subtitle shown under the welcome line. Leave blank to hide.',
      type:        'text',
      placeholder: 'Drop in, level up, and join the discussion.',
    }))
    .setting(() => ({
      setting:     'ernestdefoe-respawn.eyebrow',
      label:       'Hero Eyebrow',
      help:        'Small accent line above the headline.',
      type:        'text',
      placeholder: '▸ Player Connected',
    }))
    .setting(() => ({
      setting:     'ernestdefoe-respawn.chips',
      label:       'Hero Tag Chips',
      help:        'Comma-separated list of tag slugs to feature as quick-jump chips. Leave blank to hide.',
      type:        'text',
      placeholder: 'halo, elden-ring, deals',
    })),
];
