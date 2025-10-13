<?php

namespace App\Packages\DiscordLogger\Converters;

use MarvinLabs\DiscordLogger\Discord\Message;
use MarvinLabs\DiscordLogger\Contracts\DiscordWebHook;
use GusVasconcelos\MarkdownConverter\MarkdownConverter;
use MarvinLabs\DiscordLogger\Converters\AbstractRecordConverter;

class CustomRecordConverter extends AbstractRecordConverter
{
    /**
     * @throws \MarvinLabs\DiscordLogger\Discord\Exceptions\ConfigurationIssue
     */
    public function buildMessages(array $record): array
    {
        $message = Message::make();

        $emoji = $this->getRecordEmoji($record);

        $timestamp = $record['datetime']->format('d/m/Y - H:i:s');

        $channel = $record['channel'];

        $levelName = $record['level_name'];

        $contextPretty = cast()->toJsonPretty($record['context']);

        $content = (new MarkdownConverter())
            ->heading("{$emoji} - **[{$timestamp}] {$channel}.{$levelName}**", 1)
            ->paragraph($record['message'])
            ->heading('📄 Response', 2)
            ->codeBlock($contextPretty, 'json');

        if (strlen($content) <= DiscordWebHook::MAX_CONTENT_LENGTH) {
            $message->content($content);

            return [$message];
        }

        $content->removeAt($content->count() - 1);

        $stackTraceMessage = Message::make()->file($contextPretty, 'json', $this->getStacktraceFilename($record));

        $this->addGenericMessageFrom($stackTraceMessage);

        $message->content($content);

        return [$message, $stackTraceMessage];
    }
}
