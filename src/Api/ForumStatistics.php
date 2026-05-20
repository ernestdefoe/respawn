<?php

namespace ErnestDefoe\Respawn\Api;

use Carbon\Carbon;
use Flarum\Discussion\Discussion;
use Flarum\Post\Post;
use Flarum\User\User;
use Illuminate\Contracts\Cache\Repository as CacheRepository;
use Illuminate\Database\QueryException;
use Psr\Log\LoggerInterface;

/**
 * Aggregate counts for the Respawn stats footer.
 *
 * Cached at 60s — short enough that the "online" tile still feels
 * live, long enough that a traffic burst shares one DB hit instead
 * of thrashing the server. Every method returns nullable so a failed
 * query renders "—" client-side instead of a misleading 0.
 */
class ForumStatistics
{
    private const ONLINE_WINDOW_MINUTES = 5;
    private const CACHE_TTL = 60;

    public function __construct(
        private CacheRepository $cache,
        private LoggerInterface $log,
    ) {}

    public function postCount(): ?int
    {
        return $this->cache->remember('respawn.stats.posts', self::CACHE_TTL, function () {
            try {
                return Post::query()->whereNull('hidden_at')->count();
            } catch (QueryException $e) {
                $this->log->warning('[respawn] postCount failed', ['exception' => $e]);
                return null;
            }
        });
    }

    public function discussionCount(): ?int
    {
        return $this->cache->remember('respawn.stats.discussions', self::CACHE_TTL, function () {
            try {
                return Discussion::query()->whereNull('hidden_at')->count();
            } catch (QueryException $e) {
                $this->log->warning('[respawn] discussionCount failed', ['exception' => $e]);
                return null;
            }
        });
    }

    public function memberCount(): ?int
    {
        return $this->cache->remember('respawn.stats.members', self::CACHE_TTL, function () {
            try {
                return User::query()->count();
            } catch (QueryException $e) {
                $this->log->warning('[respawn] memberCount failed', ['exception' => $e]);
                return null;
            }
        });
    }

    public function onlineCount(): ?int
    {
        return $this->cache->remember('respawn.stats.online', self::CACHE_TTL, function () {
            try {
                return User::query()
                    ->where('last_seen_at', '>=', Carbon::now()->subMinutes(self::ONLINE_WINDOW_MINUTES))
                    ->count();
            } catch (QueryException $e) {
                $this->log->warning('[respawn] onlineCount failed', ['exception' => $e]);
                return null;
            }
        });
    }
}
