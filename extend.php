<?php

use ErnestDefoe\Respawn\Api\ForumStatistics;
use Flarum\Api\Resource\ForumResource;
use Flarum\Api\Schema;
use Flarum\Extend;

return [
    (new Extend\Frontend('forum'))
        ->js(__DIR__.'/js/dist/forum.js')
        ->css(__DIR__.'/less/forum.less'),

    (new Extend\Frontend('admin'))
        ->js(__DIR__.'/js/dist/admin.js')
        ->css(__DIR__.'/less/admin.less'),

    new Extend\Locales(__DIR__.'/locale'),

    /*
     * Surface admin settings to forum.attribute() so the JS can read
     * them at boot — theme mode (dark/light), tagline copy, eyebrow
     * copy, and the chip list for the hero are all admin-configurable.
     */
    (new Extend\Settings())
        ->serializeToForum('respawnMode',     'ernestdefoe-respawn.mode')
        ->serializeToForum('respawnTagline',  'ernestdefoe-respawn.tagline')
        ->serializeToForum('respawnEyebrow',  'ernestdefoe-respawn.eyebrow')
        ->serializeToForum('respawnChips',    'ernestdefoe-respawn.chips')
        ->default('ernestdefoe-respawn.mode',    'dark')
        ->default('ernestdefoe-respawn.tagline', 'Drop in, level up, and join the discussion.')
        ->default('ernestdefoe-respawn.eyebrow', '▸ Player Connected')
        ->default('ernestdefoe-respawn.chips',   ''),

    /*
     * Stat counts attached to the Forum resource so the JS stats
     * footer reads them via app.forum.attribute('respawn...').
     * Nullable on purpose — failed DB queries render "—" instead
     * of 0.
     */
    (new Extend\ApiResource(ForumResource::class))
        ->fields(function () {
            /** @var ForumStatistics $stats */
            $stats = resolve(ForumStatistics::class);

            return [
                Schema\Integer::make('respawnPostCount')
                    ->nullable()
                    ->get(fn () => $stats->postCount()),

                Schema\Integer::make('respawnDiscussionCount')
                    ->nullable()
                    ->get(fn () => $stats->discussionCount()),

                Schema\Integer::make('respawnMemberCount')
                    ->nullable()
                    ->get(fn () => $stats->memberCount()),

                Schema\Integer::make('respawnOnlineCount')
                    ->nullable()
                    ->get(fn () => $stats->onlineCount()),
            ];
        }),
];
