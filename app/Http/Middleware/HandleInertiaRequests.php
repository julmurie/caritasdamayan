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
        'auth' => [
            'user' => fn () => $request->user(),
            'role' => fn () => optional($request->user())->role,
        ],

        'flash' => [
            'success' => session('success'),
            'error'   => session('error'),
            'info'    => session('info'),
            'warning' => session('warning'),
        ],

        
        'sessionExpired' => fn () => $request->session()->pull('sessionExpired', false),

    ]);
}

}
