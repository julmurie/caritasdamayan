<?php

use Illuminate\Support\Facades\Route;
use Illuminate\Support\Facades\Auth;
use Illuminate\Http\Request;
use Inertia\Inertia;

use App\Http\Controllers\AuthController;
use App\Http\Controllers\ProductController;
use App\Http\Controllers\ServiceController;

/*
|--------------------------------------------------------------------------
| Public (Login)
|--------------------------------------------------------------------------
*/
Route::get('/', function (Request $request) {
    // Clear any stale intended URL (prevents cross-role redirects after logout)
    $request->session()->forget('url.intended');

    if (Auth::check() && !$request->boolean('switch')) {
            $role = Auth::user()->role ?? 'admin';

        $to = match ($role) {
            'admin'      => route('admin.dashboard'),
            'volunteer'     => route('clinic.dashboard'),
            'merchant'   => route('merchant.dashboard'),
            'accounting' => route('accounting.dashboard'),
            'treasury'   => route('treasury.dashboard'),
            default      => route('admin.dashboard'),
        };

        return redirect($to);
    }

    $resp = Inertia::render('Login')->toResponse($request);
    return $resp->header('Cache-Control', 'no-store, no-cache, must-revalidate, max-age=0')
                ->header('Pragma', 'no-cache')
                ->header('Expires', '0');
})->name('login');


// Back-compat: /login -> /
Route::redirect('/login', '/');

// Session (cookie) login — only for guests
Route::middleware('guest')->group(function () {
    Route::post('/session-login', [AuthController::class, 'sessionLogin'])->name('session.login');
});

/*
|--------------------------------------------------------------------------
| Protected (must be logged in)
|--------------------------------------------------------------------------
*/
Route::middleware('auth')->group(function () {

    /* ---------------- Admin ---------------- */
    Route::prefix('admin')->middleware('role:admin')->group(function () {
        Route::inertia('/dashboard', 'Admin/Dashboard')->name('admin.dashboard');
        Route::inertia('/patients', 'Admin/Patients')->name('admin.patients');
        Route::inertia('/approvals', 'Admin/Approvals')->name('admin.approvals');
        Route::inertia('/prices', 'Admin/Prices')->name('admin.prices');
        Route::inertia('/charge-slips', 'Admin/ChargeSlips')->name('admin.charge_slips');
        Route::inertia('/soa', 'Admin/SOA')->name('admin.soa');
        Route::inertia('/users', 'Admin/Users')->name('admin.users');
        Route::inertia('/logs', 'Admin/Logs')->name('admin.logs');
    });

    /* ---------------- Clinic ---------------- */
    Route::prefix('volunteer')->middleware('role:volunteer')->group(function () {
        // Adjust to "ClinicVolunteer" if that matches your folder structure
        Route::inertia('/dashboard', 'ClinicVolunteer/Dashboard')->name('volunteer.dashboard');
        // Uncomment if these pages exist
        Route::inertia('/patients', 'ClinicVolunteer/Patients')->name('volunteer.patients');
        Route::inertia('/charge-slips', 'ClinicVolunteer/ChargeSlips')->name('volunteer.charge_slips');
        Route::inertia('/prices', 'ClinicVolunteer/Prices')->name('volunteer.prices');

        Route::inertia('/scorecard', 'components/ScoreCard')->name('volunteer.scorecard');
    });

    /* ---------------- Partner Merchant ---------------- */
    Route::prefix('merchant')->middleware('role:merchant')->group(function () {
        Route::inertia('/dashboard', 'PartnerMerchant/Dashboard')->name('merchant.dashboard');
        Route::inertia('/services',  'PartnerMerchant/Services')->name('merchant.services');
        Route::inertia('/soa',       'PartnerMerchant/SOA')->name('merchant.soa');
        Route::inertia('/charge-slips', 'PartnerMerchant/ChargeSlips')->name('merchant.charge_slips');

        // Prices page is DB-driven (controller) — avoids duplicate Inertia route
        Route::get('/prices', [ProductController::class, 'index'])->name('products.index');

        // -------- Products (DB / DataTables / CRUD) --------
        Route::get('/products/datatable', [ProductController::class, 'datatable'])->name('products.datatable');
        Route::post('/products',          [ProductController::class, 'store'])->name('products.store');
        Route::patch('/products/{product}', [ProductController::class, 'update'])->name('products.update');
        Route::delete('/products/{product}/archive', [ProductController::class, 'archive'])->name('products.archive');
        Route::post('/products/{id}/restore', [ProductController::class, 'restore'])->name('products.restore');
        Route::get('/products/archived',  [ProductController::class, 'archived'])->name('products.archived.index');

        // -------- Services (DB / DataTables / CRUD) --------
        Route::get('/services/datatable', [ServiceController::class, 'datatable'])->name('services.datatable');
        Route::post('/services',          [ServiceController::class, 'store'])->name('services.store');
        Route::patch('/services/{service}', [ServiceController::class, 'update'])->name('services.update');
        Route::delete('/services/{service}/archive', [ServiceController::class, 'archive'])->name('services.archive');
        Route::post('/services/{id}/restore', [ServiceController::class, 'restore'])->name('services.restore');
        Route::get('/services/archived',  [ServiceController::class, 'archived'])->name('services.archived.index');
    });

    /* ---------------- Accounting ---------------- */
    Route::prefix('accounting')->middleware('role:accounting')->group(function () {
        Route::inertia('/dashboard', 'Accounting/Dashboard')->name('accounting.dashboard');
        Route::inertia('/soa', 'Accounting/SOA')->name('accounting.soa');
    });

    /* ---------------- Treasury ---------------- */
    Route::prefix('treasury')->middleware('role:treasury')->group(function () {
        Route::inertia('/dashboard', 'Treasury/Dashboard')->name('treasury.dashboard');
        Route::inertia('/soa', 'Treasury/SOA')->name('treasury.soa');
    });

    /* ---------------- Logout ---------------- */
    Route::post('/logout', [AuthController::class, 'sessionLogout'])->name('logout');
});