<?php

return [
    'api_key' => env('OPENAI_API_KEY'),

    'check_interactions' => [
        'model' => 'gpt-5-nano',
        'temperature' => 1,
    ],
];
