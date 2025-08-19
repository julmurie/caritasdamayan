<?php

use Illuminate\Support\Facades\Route;
use App\Http\Controllers\Auth\LoginController;
use App\Http\Controllers\ProductController;
use App\Http\Controllers\ServiceController;

// Login Page (entry point)
// Route::get('/', function () {
//     return inertia::render('Login', ['name' => 'Mike']); 
// second argument is props
// });

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
