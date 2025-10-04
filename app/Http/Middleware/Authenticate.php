<?php

namespace App\Http\Middleware;

use Closure;
use Illuminate\Http\Request;
use Symfony\Component\HttpFoundation\Response;

class Authenticate
{
    public function handle(Request $request, Closure $next, ...$guards): Response
    {
        if (!auth()->check()) {
            // Let login and session-login routes pass without redirect
            if ($request->routeIs('login') || $request->routeIs('session.login')) {
                return $next($request);
            }

            // Invalidate old session + regenerate CSRF token
            $request->session()->invalidate();
            $request->session()->regenerateToken();

            if ($request->expectsJson() || $request->header('X-Inertia')) {
                // Return inertia response with expired flag
                return inertia('Login', [
                    'sessionExpired' => true,
                ])->toResponse($request)->setStatusCode(401);
            }

            // Flash flag for blade/redirect flows
            $request->session()->flash('sessionExpired', true);

            return redirect()->route('login');
        }

        return $next($request);
    }
}
