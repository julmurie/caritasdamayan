<?php

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;
use App\Http\Controllers\UserController;

// keep datatable/store/index public (as you already have)
Route::get('/users/datatable', [UserController::class, 'datatable']);
Route::post('/users', [UserController::class, 'store']);
Route::get('/users', [UserController::class, 'index']);

// TEMP: expose show/update/destroy WITHOUT auth
Route::get('/users/{user}', [UserController::class, 'show'])->withoutMiddleware('auth:sanctum');
Route::put('/users/{user}', [UserController::class, 'update'])->withoutMiddleware('auth:sanctum');
Route::delete('/users/{user}', [UserController::class, 'destroy'])->withoutMiddleware('auth:sanctum');

// If you added archive endpoints, also:
Route::patch('/users/{user}/archive', [UserController::class, 'archive'])->withoutMiddleware('auth:sanctum');
Route::patch('/users/{user}/unarchive', [UserController::class, 'unarchive'])->withoutMiddleware('auth:sanctum');
