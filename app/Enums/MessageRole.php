<?php

namespace App\Enums;

enum MessageRole: string
{
    case USER = 'user';
    case ASSISTANT = 'assistant';
    case SYSTEM = 'system';

    public function label(): string
    {
        return match ($this) {
            self::USER => 'User',
            self::ASSISTANT => 'Assistant',
            self::SYSTEM => 'System',
        };
    }

    public function value(): string
    {
        return match ($this) {
            self::USER => 'user',
            self::ASSISTANT => 'assistant',
            self::SYSTEM => 'system',
        };
    }
}
