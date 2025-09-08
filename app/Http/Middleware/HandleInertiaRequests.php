<?php

namespace App\Http\Middleware;

use Illuminate\Http\Request;
use Inertia\Middleware;
use Illuminate\Support\Facades\Auth;

class HandleInertiaRequests extends Middleware
{
    /**
     * The root template that's loaded on the first page visit.
     */
    protected $rootView = 'app';

    /**
     * Determines the current asset version.
     */
    public function version(Request $request): ?string
    {
        return parent::version($request);
    }

    /**
     * Shared props available to every Inertia page.
     */
    public function share(Request $request): array
    {
        return array_merge(parent::share($request), [
            // Minimal, lazy-evaluated auth info
            'auth' => [
                'user' => fn () => $request->user(),                 // null when guest
                'role' => fn () => optional($request->user())->role, // e.g., admin/merchant/...
            ],

            // Flash messages for Tailwind alerts
            'flash' => [
            'success' => session('success'),
            'error'   => session('error'),
            'info'    => session('info'),
            'warning' => session('warning'),
        ],

            // Optional: handy if you prefer reading CSRF from props
            // 'csrf_token' => fn () => csrf_token(),
        ]);
    }
}
