<?php

return [
    'api_key' => env('OPENAI_API_KEY'),
    'model' => env('OPENAI_MODEL', 'gpt-5'),

    'check_interactions' => [
        'model' => 'gpt-5-nano',
        'temperature' => 1,
    ],

    'health_assistant' => [
        'model' => env('OPENAI_CHAT_MODEL', 'gpt-5'),
        'temperature' => 1,
        'max_tokens' => 1000,
        'conversation_history_limit' => 20,
    ],
];
