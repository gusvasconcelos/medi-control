<?php

namespace App\Http\Middleware;

use Illuminate\Http\Request;
use Inertia\Middleware;

class HandleInertiaRequests extends Middleware
{
    /**
     * The root template that's loaded on the first page visit.
     *
     * @see https://inertiajs.com/server-side-setup#root-template
     *
     * @var string
     */
    protected $rootView = 'app';

    /**
     * Determines the current asset version.
     *
     * @see https://inertiajs.com/asset-versioning
     */
    public function version(Request $request): ?string
    {
        return parent::version($request);
    }

    /**
     * Define the props that are shared by default.
     *
     * @see https://inertiajs.com/shared-data
     *
     * @return array<string, mixed>
     */
    public function share(Request $request): array
    {
        $user = $request->user();

        return [
            ...parent::share($request),
            'auth' => [
                'user' => $user ? [
                    ...$user->load('roles')->toArray(),
                    'roles' => $user->roles,
                ] : null,
            ],
            'flash' => [
                'success' => $request->session()->get('success'),
                'error' => $request->session()->get('error'),
                'warning' => $request->session()->get('warning'),
                'info' => $request->session()->get('info'),
            ],
        ];
    }

    /**
     * Filter routes based on user role and authentication status.
     *
     * This prevents exposing admin/sensitive routes to regular users.
     */
    private function getFilteredRoutes(Request $request): array
    {
        $user = $request->user();

        if (! $user) {
            return $this->filterRoutesByGroup(['auth']);
        }

        $isSuperAdmin = $user->hasRole('super-admin');

        if ($isSuperAdmin) {
            return $this->filterRoutesByGroup(['auth', 'common', 'api', 'admin']);
        }

        return $this->filterRoutesByGroup(['auth', 'common', 'api']);
    }

    /**
     * Filter routes by group patterns defined in config/ziggy.php
     *
     * @param array<string> $groups
     * @return array<string>
     */
    private function filterRoutesByGroup(array $groups): array
    {
        $patterns = [];
        $groupConfig = config('ziggy.groups', []);

        foreach ($groups as $group) {
            if (isset($groupConfig[$group])) {
                $patterns = array_merge($patterns, $groupConfig[$group]);
            }
        }

        return $patterns;
    }
}
