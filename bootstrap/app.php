<?php

use App\Http\Middleware\HandleInertiaRequests;
use Illuminate\Foundation\Application;
use Illuminate\Foundation\Configuration\Exceptions;
use Illuminate\Foundation\Configuration\Middleware;
use App\Http\Middleware\EnsureRole;
use App\Http\Middleware\IdleLogout;


return Application::configure(basePath: dirname(__DIR__))
    ->withRouting(
        web: __DIR__.'/../routes/web.php',
        api: __DIR__.'/../routes/api.php',
        commands: __DIR__.'/../routes/console.php',
        health: '/up',
    )
    ->withMiddleware(function (Middleware $middleware): void {
    $middleware->alias([
        // 'idle' => IdleLogout::class,
        'role'    => \App\Http\Middleware\EnsureRole::class,
        'nocache' => \App\Http\Middleware\PreventBackHistory::class,
    ]);

    // Web group middleware (append once)
    $middleware->web(append: [
        \App\Http\Middleware\HandleInertiaRequests::class,
        // IdleLogout::class,
    ]);
})

    ->withExceptions(function (Exceptions $exceptions): void {
        //
    })->create();
