<?php

use Illuminate\Support\Facades\Route;
use Illuminate\Support\Facades\Auth;
use Illuminate\Http\Request;
use Inertia\Inertia;
use App\Http\Controllers\AuthController;
use App\Http\Controllers\Auth\LoginController;
use App\Http\Controllers\ProductController;
use App\Http\Controllers\ServiceController;

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

//shortcut to the code above
Route::inertia('/', 'Login');




// Admin Dashboard
Route::get('/admin/dashboard', function () {
    return inertia('Admin/Dashboard'); // Matches file structure
});

// Admin Users
Route::get('/admin/users', function () {
    return inertia('Admin/Users'); // Matches file structure
});

// Clinic Volunteer Dashboard
Route::get('/clinic/dashboard', function () {
    return inertia('Clinic/Dashboard');
});

// --- Partner Merchant (Inertia only, EXCEPT prices which is controller) ---
Route::inertia('/merchant/dashboard', 'PartnerMerchant/Dashboard')->name('merchant.dashboard');
// REMOVE the duplicate inertia route for /merchant/prices
// Route::inertia('/merchant/prices', 'PartnerMerchant/Prices');
Route::inertia('/merchant/services', 'PartnerMerchant/Services')->name('merchant.services');
Route::inertia('/merchant/soa', 'PartnerMerchant/SOA')->name('merchant.soa');
Route::inertia('/merchant/chargeslips', 'PartnerMerchant/ChargeSlips')->name('merchant.chargeslips');

// ---Partner Merchant Products (DB-connected) ---
// Page that renders PartnerMerchant/Prices via the controller (DB-connected)
Route::get('/merchant/prices', [ProductController::class, 'index'])->name('products.index');

// DataTables + CRUD (no auth middleware for now)
Route::get('/merchant/products/datatable', [ProductController::class, 'datatable'])->name('products.datatable');

Route::post('/merchant/products', [ProductController::class, 'store'])->name('products.store');
Route::patch('/merchant/products/{product}', [ProductController::class, 'update'])->name('products.update');

Route::delete('/merchant/products/{product}/archive', [ProductController::class, 'archive'])->name('products.archive');
Route::post('/merchant/products/{id}/restore', [ProductController::class, 'restore'])->name('products.restore');

Route::get('/merchant/products/archived', [ProductController::class, 'archived'])->name('products.archived.index');

//Partner Merchant Services JSON/Data routes (mirror products)
Route::get('/merchant/services/datatable', [ServiceController::class, 'datatable'])->name('services.datatable');

Route::post('/merchant/services', [ServiceController::class, 'store'])->name('services.store');
Route::patch('/merchant/services/{service}', [ServiceController::class, 'update'])->name('services.update');

Route::delete('/merchant/services/{service}/archive', [ServiceController::class, 'archive'])->name('services.archive');
Route::post('/merchant/services/{id}/restore', [ServiceController::class, 'restore'])->name('services.restore');

Route::get('/merchant/services/archived', [ServiceController::class, 'archived'])->name('services.archived.index');
