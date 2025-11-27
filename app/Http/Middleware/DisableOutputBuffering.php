<?php

namespace App\Http\Middleware;

use Closure;
use Illuminate\Http\Request;
use Symfony\Component\HttpFoundation\Response;

class DisableOutputBuffering
{
    /**
     * Handle an incoming request.
     *
     * @param  \Closure(\Illuminate\Http\Request): (\Symfony\Component\HttpFoundation\Response)  $next
     */
    public function handle(Request $request, Closure $next): Response
    {
        // Disable Apache's mod_deflate
        if (function_exists('apache_setenv')) {
            apache_setenv('no-gzip', '1');
        }

        // Disable PHP output buffering
        ini_set('output_buffering', 'off');
        ini_set('zlib.output_compression', 'off');
        ini_set('implicit_flush', '1');

        // Disable all existing output buffers
        while (ob_get_level() > 0) {
            ob_end_clean();
        }

        $response = $next($request);

        // For streamed responses, add anti-buffering headers
        if ($response instanceof \Symfony\Component\HttpFoundation\StreamedResponse) {
            $response->headers->set('X-Accel-Buffering', 'no');
            $response->headers->set('Cache-Control', 'no-cache, no-store, must-revalidate');
        }

        return $response;
    }
}
