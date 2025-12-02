<?php

if (! function_exists('cast')) {
    function cast()
    {
        return new class () {
            public function toJsonPretty(array $data): string
            {
                return json_encode($data, JSON_PRETTY_PRINT | JSON_UNESCAPED_UNICODE | JSON_UNESCAPED_SLASHES);
            }

            public function unaccent(string $value): string
            {
                return iconv('UTF-8', 'ASCII//TRANSLIT//IGNORE', $value);
            }
        };
    }
}
