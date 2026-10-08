<?php

namespace ErnestDefoe\Respawn\Tests\integration\api;

use Carbon\Carbon;
use Flarum\Discussion\Discussion;
use Flarum\Post\Post;
use Flarum\Testing\integration\RetrievesAuthorizedUsers;
use Flarum\Testing\integration\TestCase;
use Flarum\User\User;
use PHPUnit\Framework\Attributes\Test;

class ForumAttributesTest extends TestCase
{
    use RetrievesAuthorizedUsers;

    protected function setUp(): void
    {
        parent::setUp();

        $this->extension('ernestdefoe-respawn');

        $this->prepareDatabase([
            User::class => [
                // The admin from the install, plus these three; one is online.
                $this->normalUser(),
                ['id' => 3, 'username' => 'online', 'email' => 'online@machine.local', 'is_email_confirmed' => 1, 'last_seen_at' => Carbon::now()->subMinutes(2)],
                ['id' => 4, 'username' => 'away', 'email' => 'away@machine.local', 'is_email_confirmed' => 1, 'last_seen_at' => Carbon::now()->subHour()],
            ],
            Discussion::class => [
                ['id' => 1, 'title' => 'Open', 'created_at' => Carbon::now(), 'user_id' => 2, 'first_post_id' => 1, 'comment_count' => 2],
                ['id' => 2, 'title' => 'Hidden', 'created_at' => Carbon::now(), 'user_id' => 2, 'first_post_id' => 3, 'comment_count' => 1, 'hidden_at' => Carbon::now()],
            ],
            Post::class => [
                ['id' => 1, 'discussion_id' => 1, 'number' => 1, 'created_at' => Carbon::now(), 'user_id' => 2, 'type' => 'comment', 'content' => '<t><p>One</p></t>'],
                ['id' => 2, 'discussion_id' => 1, 'number' => 2, 'created_at' => Carbon::now(), 'user_id' => 2, 'type' => 'comment', 'content' => '<t><p>Two</p></t>', 'hidden_at' => Carbon::now()],
                ['id' => 3, 'discussion_id' => 2, 'number' => 1, 'created_at' => Carbon::now(), 'user_id' => 2, 'type' => 'comment', 'content' => '<t><p>Three</p></t>'],
            ],
        ]);
    }

    private function forum(): array
    {
        $response = $this->send($this->request('GET', '/api'));
        $this->assertSame(200, $response->getStatusCode());

        return json_decode((string) $response->getBody(), true)['data']['attributes'];
    }

    #[Test]
    public function the_stats_footer_counts_what_is_not_hidden()
    {
        $forum = $this->forum();

        $this->assertSame(2, $forum['respawnPostCount'], 'A hidden post is not counted');
        $this->assertSame(1, $forum['respawnDiscussionCount'], 'A hidden discussion is not counted');
        $this->assertSame(4, $forum['respawnMemberCount']);
        $this->assertSame(1, $forum['respawnOnlineCount'], 'Seen in the last five minutes');
    }

    #[Test]
    public function the_theme_settings_reach_the_forum_with_their_defaults()
    {
        $forum = $this->forum();

        $this->assertSame('dark', $forum['respawnMode']);
        $this->assertSame('Drop in, level up, and join the discussion.', $forum['respawnTagline']);
        $this->assertSame('▸ Player Connected', $forum['respawnEyebrow']);
    }

    #[Test]
    public function a_changed_setting_reaches_the_forum()
    {
        $this->setting('ernestdefoe-respawn.mode', 'light');
        $this->setting('ernestdefoe-respawn.chips', 'FPS,RPG');

        $forum = $this->forum();

        $this->assertSame('light', $forum['respawnMode']);
        $this->assertSame('FPS,RPG', $forum['respawnChips']);
    }
}
