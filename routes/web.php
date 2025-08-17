<?php

use Illuminate\Support\Facades\Route;
use Illuminate\Support\Facades\Auth;
use Illuminate\Http\Request;
use Inertia\Inertia;
use App\Http\Controllers\AuthController;

// ---------- Public ----------
Route::get('/', function (Request $request) {
    // If logged in and not explicitly switching, go to the role dashboard
    if (Auth::check() && !$request->boolean('switch')) {
        $role = Auth::user()->role ?? 'admin';

        $to = match ($role) {
            'admin'      => route('admin.dashboard'),
            'clinic'     => route('clinic.dashboard'),
            'merchant'   => route('merchant.dashboard'),
            'accounting' => route('accounting.dashboard'),
            'treasury'   => route('treasury.dashboard'),
            default      => route('admin.dashboard'),
        };

        return redirect($to);
    }

    // Render login with no-store headers (prevents cached page on back nav)
    $resp = Inertia::render('Login')->toResponse($request);
    return $resp->header('Cache-Control', 'no-store, no-cache, must-revalidate, max-age=0')
                ->header('Pragma', 'no-cache')
                ->header('Expires', '0');
})->name('login');

// Optional back-compat
Route::redirect('/login', '/');

// Session (cookie) login POST — only for guests
Route::middleware('guest')->group(function () {
    Route::post('/session-login', [AuthController::class, 'sessionLogin']);
});

// ---------- Protected (must be logged in) ----------
Route::middleware('auth')->group(function () {
    // Admin
    Route::prefix('admin')->group(function () {
        Route::inertia('/dashboard', 'Admin/Dashboard')->name('admin.dashboard');
        Route::inertia('/patients', 'Admin/Patients')->name('admin.patients');
        Route::inertia('/approvals', 'Admin/Approvals')->name('admin.approvals');
        Route::inertia('/prices', 'Admin/Prices')->name('admin.prices');
        Route::inertia('/charge-slips', 'Admin/ChargeSlips')->name('admin.charge_slips');
        Route::inertia('/soa', 'Admin/SOA')->name('admin.soa');
        Route::inertia('/users', 'Admin/Users')->name('admin.users');
        Route::inertia('/logs', 'Admin/Logs')->name('admin.logs');
    });

    // Clinic
    Route::prefix('clinic')->group(function () {
        Route::inertia('/dashboard', 'ClinicVolunteer/Dashboard')->name('clinic.dashboard');
        Route::inertia('/patients', 'ClinicVolunteer/Patients')->name('clinic.patients');
        Route::inertia('/charge-slips', 'ClinicVolunteer/ChargeSlips')->name('clinic.charge_slips');
        Route::inertia('/prices', 'ClinicVolunteer/Prices')->name('clinic.prices');
    });

    // Merchant
    Route::prefix('merchant')->group(function () {
        Route::inertia('/dashboard', 'PartnerMerchant/Dashboard')->name('merchant.dashboard');
        Route::inertia('/prices', 'PartnerMerchant/Prices')->name('merchant.prices');
        Route::inertia('/charge-slips', 'PartnerMerchant/ChargeSlips')->name('merchant.charge_slips');
        Route::inertia('/soa', 'PartnerMerchant/SOA')->name('merchant.soa');
    });

    // Accounting
    Route::prefix('accounting')->group(function () {
        Route::inertia('/dashboard', 'Accounting/Dashboard')->name('accounting.dashboard');
        Route::inertia('/soa', 'Accounting/SOA')->name('accounting.soa');
    });

    // Treasury
    Route::prefix('treasury')->group(function () {
        Route::inertia('/dashboard', 'Treasury/Dashboard')->name('treasury.dashboard');
        Route::inertia('/soa', 'Treasury/SOA')->name('treasury.soa');
    });

    // Logout (session)
    Route::post('/logout', [AuthController::class, 'sessionLogout'])->name('logout');
});
