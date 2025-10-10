<?php

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;
use App\Http\Controllers\UserController;
use App\Http\Controllers\AuthController;
use App\Http\Controllers\PatientController;

Route::post('/login', [AuthController::class, 'login'])->middleware('throttle:10,1');

Route::middleware('auth:sanctum')->patch('/users/{user}/reset-attempts', function (User $user) {
    $user->update(['attempts_left' => 5]);
    return response()->json(['message' => 'Attempts reset to 5']);
});

// keep datatable/store/index public (as you already have)
Route::get('/users/datatable', [UserController::class, 'datatable']);
Route::post('/users', [UserController::class, 'store']);
Route::get('/users', [UserController::class, 'index']);

// ✅ Archives & restore routes should come BEFORE the /users/{user} route
Route::get('/users/archived', [UserController::class, 'archived'])->withoutMiddleware('auth:sanctum');
Route::patch('/users/{id}/unarchive', [UserController::class, 'restore'])->withoutMiddleware('auth:sanctum');

// TEMP: expose show/update/destroy WITHOUT auth
Route::get('/users/{user}', [UserController::class, 'show'])->withoutMiddleware('auth:sanctum');
Route::put('/users/{user}', [UserController::class, 'update'])->withoutMiddleware('auth:sanctum');
Route::delete('/users/{user}', [UserController::class, 'destroy'])->withoutMiddleware('auth:sanctum');

// archive toggle routes (optional, can come after)
Route::patch('/users/{user}/archive', [UserController::class, 'archive'])->withoutMiddleware('auth:sanctum');

Route::get('/patients', [PatientController::class, 'index']);
Route::get('/patients/{id}', [PatientController::class, 'show']);
Route::post('/patients', [PatientController::class, 'store']);
Route::put('/patients/{id}', [PatientController::class, 'update']);
