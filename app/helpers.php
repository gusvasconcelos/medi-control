<?php

if (! function_exists('cast')) {
    function cast()
    {
        return new class () {
            public function toJsonPretty(array $data): string
            {
                return json_encode($data, JSON_PRETTY_PRINT | JSON_UNESCAPED_UNICODE | JSON_UNESCAPED_SLASHES);
            }
        };
    }
}
