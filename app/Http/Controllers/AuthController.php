<?php
// app/Http/Controllers/AuthController.php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Str;            // ⬅️ used for startsWith
use Inertia\Inertia;                  // ⬅️ used for hard redirects
use App\Models\User;

class AuthController extends Controller
{
    /**
     * API token login (JSON) — e.g. POST /api/login
     * Includes attempts_left logic and returns a Sanctum token.
     */
    public function login(Request $request)
    {
        $request->validate([
            'email'    => ['required','email'],
            'password' => ['required'],
        ]);

        $user = \App\Models\User::where('email', $request->email)->first();
        if (!$user) {
            return response()->json(['message' => 'Invalid credentials'], 401);
        }

        return \DB::transaction(function () use ($user, $request) {
            // lock the row
            $user = \App\Models\User::whereKey($user->id)->lockForUpdate()->first();

            // If a lock exists but is expired, auto-reset
            if ($user->locked_until && now()->greaterThanOrEqualTo($user->locked_until)) {
                $user->locked_until = null;
                $user->attempts_left = 5;
                $user->save();
            }

            // Still locked?
            if ($user->locked_until && now()->lessThan($user->locked_until)) {
                $seconds = now()->diffInSeconds($user->locked_until, false);
                return response()->json([
                    'message'       => 'Too many failed attempts. Try again later.',
                    'retry_after'   => $seconds,
                    'retry_at'      => $user->locked_until->toIso8601String(),
                    'attempts_left' => 0,
                ], 423);
            }

            // Check password
            if (!\Hash::check($request->password, $user->password)) {
                $user->attempts_left = max(0, (int)$user->attempts_left - 1);

                // Hit zero? start 15-minute lock
                if ($user->attempts_left <= 0) {
                    $user->locked_until = now()->addMinutes(15);
                }
                $user->save();

                return response()->json([
                    'message'       => 'Invalid credentials',
                    'attempts_left' => (int)$user->attempts_left,
                    'retry_after'   => $user->locked_until ? now()->diffInSeconds($user->locked_until, false) : null,
                    'retry_at'      => $user->locked_until ? $user->locked_until->toIso8601String() : null,
                ], 401);
            }

            // Success: reset and issue token
            $user->attempts_left = 5;
            $user->locked_until  = null;
            $user->save();

            $token = $user->createToken('web', ['*'])->plainTextToken;

            return response()->json([
                'token'         => $token,
                'user'          => $user,
                'attempts_left' => 5,
            ]);
        });
    }

    /**
     * Session (cookie) login — HTML form POST /session-login
     * Redirects to role dashboard with guarded intended URL (hard redirects).
     */
    public function sessionLogin(Request $request)
    {
        $credentials = $request->validate([
            'email'    => ['required','email'],
            'password' => ['required'],
        ]);

        $user = \App\Models\User::where('email', $credentials['email'])->first();
        if ($user) {
            // Reset if lock expired
            if ($user->locked_until && now()->greaterThanOrEqualTo($user->locked_until)) {
                $user->locked_until = null;
                $user->attempts_left = 5;
                $user->save();
            }

            if ($user->locked_until && now()->lessThan($user->locked_until)) {
                $wait = now()->diffInMinutes($user->locked_until, false);
                return back()
                    ->withErrors(['email' => "Account locked. Try again in ~{$wait} minute(s)."])
                    ->onlyInput('email');
            }
        }

        // Attempt auth
        if (!\Auth::attempt($credentials, true)) {
            if ($user) {
                $user->attempts_left = max(0, (int)$user->attempts_left - 1);
                if ($user->attempts_left <= 0) {
                    $user->locked_until = now()->addMinutes(15);
                }
                $user->save();

                $msg = $user->locked_until
                    ? 'Too many failed attempts. Try again in 15 minutes.'
                    : ('Invalid credentials. Attempts left: ' . $user->attempts_left);

                return back()->withErrors(['email' => $msg])->onlyInput('email');
            }

            return back()->withErrors(['email' => 'Invalid credentials'])->onlyInput('email');
        }

        // Success
        if ($user) {
            $user->attempts_left = 5;
            $user->locked_until  = null;
            $user->save();
        }

        $request->session()->regenerate();

        // ----- Guarded redirect logic -----
        $role = Auth::user()->role ?? 'admin';

        $to = match ($role) {
            'admin'                                   => route('admin.dashboard'),
            'clinic', 'volunteer', 'clinic_volunteer' => route('clinic.dashboard'),
            'merchant'                                => route('merchant.dashboard'),
            'accounting'                              => route('accounting.dashboard'),
            'treasury'                                => route('treasury.dashboard'),
            default                                   => route('admin.dashboard'),
        };

        // Pull (and remove) intended URL from session
        $intended = session()->pull('url.intended'); // string|null

        if ($intended) {
            $path = parse_url($intended, PHP_URL_PATH) ?? '/';
            $allowedPrefix = "/{$role}/";
            if (Str::startsWith($path, $allowedPrefix)) {
                // HARD redirect to ensure navigation
                return Inertia::location($intended);
            }
        }

        // Fallback: HARD redirect to the role dashboard
        return Inertia::location($to);
    }

    /**
     * Session logout — POST /logout
     */
    public function sessionLogout(Request $request)
    {
        Auth::logout();
        $request->session()->invalidate();
        $request->session()->regenerateToken();

        // Force a full reload so CSRF <meta> is refreshed
        return Inertia::location(route('login'));
    }
}
