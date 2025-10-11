<?php
// app/Http/Controllers/AuthController.php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Cookie;
use Illuminate\Support\Str;            
use Inertia\Inertia;                  
use App\Models\User;
use App\Models\AccountLog; 

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

        $user = User::where('email', $request->email)->first();
        if (!$user) {
            return response()->json(['message' => 'Invalid credentials'], 401);
        }

        if ($user->is_active === 0) {
            return response()->json([
                'message' => 'Your account is inactive. Please contact the system administrator to reactivate it.'
            ], 401);
        }

        return DB::transaction(function () use ($user, $request) {
            $user = User::whereKey($user->id)->lockForUpdate()->first();

            if ($user->locked_until && now()->greaterThanOrEqualTo($user->locked_until)) {
                $user->locked_until = null;
                $user->attempts_left = 5;
                $user->save();
            }

            if ($user->locked_until && now()->lessThan($user->locked_until)) {
                $seconds = now()->diffInSeconds($user->locked_until, false);
                return response()->json([
                    'message'       => 'Too many failed attempts. Try again later.',
                    'retry_after'   => $seconds,
                    'retry_at'      => $user->locked_until->toIso8601String(),
                    'attempts_left' => 0,
                ], 423);
            }

            if (!Hash::check($request->password, $user->password)) {
                $user->attempts_left = max(0, (int)$user->attempts_left - 1);
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

            // ✅ success
            $user->attempts_left = 5;
            $user->locked_until  = null;
            $user->save();

            // 🪵 Account Log: record login
            AccountLog::create([
                'user_id'    => $user->id,
                'action'     => 'login',
                'ip'         => $request->ip(),
                'user_agent' => $request->userAgent(),
            ]);

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
    $request->validate([
        'email'    => ['required','email'],
        'password' => ['required'],
        'remember' => ['nullable','boolean'],
    ]);

    // Only these two go to attempt()
    $creds = $request->only('email', 'password');
    $remember = $request->boolean('remember');

    $user = \App\Models\User::where('email', $creds['email'])->first();
    if ($user) {

        // 🚫 Block inactive accounts BEFORE Auth::attempt()
        if ((int) $user->is_active === 0) {
            $inactiveMsg = 'Your account is inactive. Please contact the system administrator to reactivate it.';

            return back()
                ->withErrors(['email' => $inactiveMsg])
                ->with('error', $inactiveMsg)
                ->onlyInput('email');
        }


        // auto-unlock if expired
        if ($user->locked_until && now()->greaterThanOrEqualTo($user->locked_until)) {
            $user->locked_until = null;
            $user->attempts_left = 5;
            $user->save();
        }

        // still locked?
        if ($user->locked_until && now()->lessThan($user->locked_until)) {
            $wait = now()->diffInMinutes($user->locked_until, false);
            return back()
                ->withErrors(['email' => "Account locked. Try again in ~{$wait} minute(s)."])
                ->with('error', 'Too many failed attempts. Please wait before trying again.')
                ->with('retry_at', $user->locked_until->toIso8601String())
                ->onlyInput('email');
        }
    }

    // Attempt with remember flag
    if (!Auth::attempt(array_merge($creds, ['is_active' => 1]), $remember)) {
        if ($user) {
            $user->attempts_left = max(0, (int) $user->attempts_left - 1);
            if ($user->attempts_left <= 0) {
                $user->locked_until = now()->addMinutes(15);
            }
            $user->save();

            $msg = $user->locked_until
                ? 'Too many failed attempts. Try again in 15 minutes.'
                : ('Invalid credentials. Attempts left: ' . $user->attempts_left);

            $response = back()
                ->withErrors(['email' => $msg])
                ->with('error', $msg)
                ->onlyInput('email');

            if ($user->locked_until) {
                $response->with('retry_at', $user->locked_until->toIso8601String());
            }

            return $response;
        }

        return back()
            ->withErrors(['email' => 'Invalid credentials'])
            ->with('error', 'Invalid credentials')
            ->onlyInput('email');
    }

    // success: reset lock state
    if ($user) {
        $user->attempts_left = 5;
        $user->locked_until  = null;
        $user->save();
    }

    $request->session()->regenerate();

    // ✅ clear any expired-session flag before redirect
    $request->session()->forget('sessionExpired');

    $role = Auth::user()->role ?? 'admin';
    $to = match ($role) {
        'admin'     => route('admin.dashboard'),
        'volunteer' => route('volunteer.dashboard'),
        'merchant'  => route('merchant.dashboard'),
        'accounting'=> route('accounting.dashboard'),
        'treasury'  => route('treasury.dashboard'),
        default     => route('admin.dashboard'),
    };

    $request->session()->flash('success', 'Signed in!');

    $intended = session()->pull('url.intended');
    if ($intended) {
        $path = parse_url($intended, PHP_URL_PATH) ?? '/';
        $allowedPrefix = "/{$role}/";
        if (Str::startsWith($path, $allowedPrefix)) {
            return \Inertia\Inertia::location($intended);
        }
    }

    return \Inertia\Inertia::location($to);
}

public function sessionLogout(Request $request)
{
    $guard = Auth::guard();
    $guard->logout();

    // ensure the "remember me" cookie is cleared
    if (method_exists($guard, 'getRecallerName')) {
        Cookie::queue(Cookie::forget($guard->getRecallerName())); // remember_web_*
    }

    $request->session()->invalidate();
    $request->session()->regenerateToken();

    session()->flash('success', 'You have been logged out.');
    return \Inertia\Inertia::location(route('login'));
}
}