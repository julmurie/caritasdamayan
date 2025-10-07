<?php

use Illuminate\Support\Facades\Route;
use Illuminate\Support\Facades\Auth;
use Illuminate\Http\Request;
use Inertia\Inertia;

use App\Http\Controllers\AuthController;
use App\Http\Controllers\ProductController;
use App\Http\Controllers\ServiceController;
use App\Http\Controllers\SOAController;
use App\Http\Controllers\PatientController;

use App\Http\Controllers\MedicineRequestController;
use App\Http\Controllers\LaboratoryRequestController;
use App\Http\Controllers\ReferralController;


/*
|--------------------------------------------------------------------------
| Public (Login)
|--------------------------------------------------------------------------
*/
Route::get('/', function (Request $request) {
    $request->session()->forget('url.intended');

    if (Auth::check() && !$request->boolean('switch')) {
        $role = Auth::user()->role ?? 'admin';
        $to = match ($role) {
            'admin'      => route('admin.dashboard'),
            'volunteer'     => route('volunteer.dashboard'),
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

Route::redirect('/login', '/');

Route::middleware('guest')->group(function () {
    Route::post('/session-login', [AuthController::class, 'sessionLogin'])->name('session.login');
});

/*
|--------------------------------------------------------------------------
| Protected (must be logged in)
|--------------------------------------------------------------------------
*/
Route::middleware('auth', 'nocache')->group(function () {

  

    /* ---------------- Admin ---------------- */
    Route::prefix('admin')->middleware('role:admin')->group(function () {
        Route::inertia('/dashboard', 'Admin/Dashboard')->name('admin.dashboard');
        Route::inertia('/patients', 'Admin/Patients')->name('admin.patients');
        Route::inertia('/approvals', 'Admin/Approvals')->name('admin.approvals');

        Route::get('/prices', function () {
        return Inertia::render('PartnerMerchant/Prices', [
            'merchant'    => 'Generika',
            'permissions' => ['canManage' => false],
            'endpoints'   => [
                'productsDatatable' => route('products.datatable'),
                'servicesDatatable' => route('services.datatable'),
            ],
        ]);
    })->name('admin.prices');
        
        Route::inertia('/charge-slips', 'Admin/ChargeSlips')->name('admin.charge_slips');
        Route::inertia('/soa', 'Admin/SOA')->name('admin.soa');   // PAGE ONLY
        Route::inertia('/users', 'Admin/Users')->name('admin.users');
        Route::inertia('/logs', 'Admin/Logs')->name('admin.logs');

        // SOA API
        Route::get   ('/soa/datatable',    [SOAController::class, 'datatable'])->name('admin.soa.datatable');
        Route::post  ('/soa',              [SOAController::class, 'store'])->name('admin.soa.store');
        Route::patch ('/soa/{soa}',        [SOAController::class, 'update'])->name('admin.soa.update');
        Route::delete('/soa/{soa}',        [SOAController::class, 'destroy'])->name('admin.soa.destroy');
        Route::post  ('/soa/{id}/restore', [SOAController::class, 'restore'])->name('admin.soa.restore');
    });

    /* ---------------- Clinic Volunteer ---------------- */
Route::prefix('volunteer')->middleware('role:volunteer')->group(function () {
    Route::inertia('/dashboard', 'ClinicVolunteer/Dashboard')->name('volunteer.dashboard');
    Route::inertia('/patients', 'ClinicVolunteer/Patients')->name('volunteer.patients');
    Route::inertia('/charge-slips', 'ClinicVolunteer/ChargeSlips')->name('volunteer.charge_slips');

    Route::get('/prices', function () {
        return Inertia::render('PartnerMerchant/Prices', [
            'merchant'    => 'Generika',
            'permissions' => ['canManage' => false],
            'endpoints'   => [
                'productsDatatable' => route('products.datatable'),
                'servicesDatatable' => route('services.datatable'),
            ],
        ]);
    })->name('volunteer.prices');

    Route::inertia('/soa', 'ClinicVolunteer/SOA')->name('volunteer.soa'); // PAGE ONLY

    // SOA API
    Route::get   ('/soa/datatable',    [SOAController::class, 'datatable'])->name('volunteer.soa.datatable');
    Route::post  ('/soa',              [SOAController::class, 'store'])->name('volunteer.soa.store');
    Route::patch ('/soa/{soa}',        [SOAController::class, 'update'])->name('volunteer.soa.update');
    Route::delete('/soa/{soa}',        [SOAController::class, 'destroy'])->name('volunteer.soa.destroy');
    Route::post  ('/soa/{id}/restore', [SOAController::class, 'restore'])->name('volunteer.soa.restore');

    // Documents
    Route::inertia('/documents/score-card', 'ClinicVolunteer/Documents/ScoreCard')->name('volunteer.documents.scorecard');
    Route::inertia('/documents/medicine-request', 'ClinicVolunteer/Documents/MedicineRequest')->name('volunteer.documents.medicine');
    Route::inertia('/documents/laboratory-request', 'ClinicVolunteer/Documents/LaboratoryRequest')->name('volunteer.documents.laboratory');

    Route::post('/medicine-requests', [MedicineRequestController::class, 'store'])->name('volunteer.medicine_requests.store');
    Route::post('/laboratory-requests', [LaboratoryRequestController::class, 'store'])->name('volunteer.laboratory_requests.store');
    
    Route::delete('/patients/{patient}/archive', [PatientController::class, 'archive'])
    ->name('volunteer.patients.archive');
    Route::post('/patients/{id}/restore', [PatientController::class, 'restore'])
      ->name('volunteer.patients.restore');


    // Appointments
    Route::inertia('/appointments/donated-item', 'ClinicVolunteer/Appointments/DonatedItem')->name('volunteer.appointments.donated');
    Route::inertia('/appointments/referral', 'ClinicVolunteer/Appointments/Referral')->name('volunteer.appointments.referral');
    Route::inertia('/appointments/initial-assessment', 'ClinicVolunteer/Appointments/InitialAssessment')->name('volunteer.appointments.initial');
    Route::inertia('/appointments/consultation', 'ClinicVolunteer/Appointments/Consultation')->name('volunteer.appointments.consultation');

    Route::post('/referrals', [ReferralController::class, 'store'])
    ->name('volunteer.referrals.store');
});


    Route::get('/merchant/products/datatable', [ProductController::class, 'datatable'])
    ->name('products.datatable');

    Route::get('/merchant/services/datatable', [ServiceController::class, 'datatable'])
    ->name('services.datatable');

    /* ---------------- Partner Merchant ---------------- */
    Route::prefix('merchant')->middleware('role:merchant')->group(function () {
        Route::inertia('/dashboard', 'PartnerMerchant/Dashboard')->name('merchant.dashboard');
        Route::inertia('/services',  'PartnerMerchant/Services')->name('merchant.services');
        Route::inertia('/charge-slips', 'PartnerMerchant/ChargeSlips')->name('merchant.charge_slips');
        Route::inertia('/soa',       'PartnerMerchant/SOA')->name('merchant.soa'); // PAGE ONLY

         // Prices page (shared page but still accessible to merchants)
        Route::get('/prices', [ProductController::class, 'index'])->name('merchant.prices');

        // Products (mutations stay merchant-only)
        Route::post  ('/products',                 [ProductController::class, 'store'])->name('products.store');
        Route::patch ('/products/{product}',       [ProductController::class, 'update'])->name('products.update');
        Route::delete('/products/{product}/archive',[ProductController::class, 'archive'])->name('products.archive');
        Route::post  ('/products/{id}/restore',    [ProductController::class, 'restore'])->name('products.restore');
        Route::get   ('/products/archived',        [ProductController::class, 'archived'])->name('products.archived.index');

        // Services (mutations stay merchant-only)
        Route::post  ('/services',                 [ServiceController::class, 'store'])->name('services.store');
        Route::patch ('/services/{service}',       [ServiceController::class, 'update'])->name('services.update');
        Route::delete('/services/{service}/archive',[ServiceController::class, 'archive'])->name('services.archive');
        Route::post  ('/services/{id}/restore',    [ServiceController::class, 'restore'])->name('services.restore');
        Route::get   ('/services/archived',        [ServiceController::class, 'archived'])->name('services.archived.index');


        // SOA API
        Route::get   ('/soa/datatable',    [SOAController::class, 'datatable'])->name('merchant.soa.datatable');
        Route::post  ('/soa',              [SOAController::class, 'store'])->name('merchant.soa.store');
        Route::patch ('/soa/{soa}',        [SOAController::class, 'update'])->name('merchant.soa.update');

        // ✅ Soft-delete (“archive”) instead of force delete
        Route::delete('/soa/{soa}/archive', [SOAController::class, 'archive'])->name('merchant.soa.archive');

        // ✅ List and restore archived SOAs
        Route::get   ('/soa/archived',  [SOAController::class, 'archived'])->name('merchant.soa.archived.index');
        Route::post  ('/soa/{id}/restore', [SOAController::class, 'restore'])->name('merchant.soa.restore');    
      });

    /* ---------------- Accounting ---------------- */
    Route::prefix('accounting')->middleware('role:accounting')->group(function () {
        Route::inertia('/dashboard', 'Accounting/Dashboard')->name('accounting.dashboard');
        Route::inertia('/soa',       'Accounting/SOA')->name('accounting.soa'); // PAGE ONLY

        // SOA API
        Route::get   ('/soa/datatable',    [SOAController::class, 'datatable'])->name('accounting.soa.datatable');
        Route::post  ('/soa',              [SOAController::class, 'store'])->name('accounting.soa.store');
        Route::patch ('/soa/{soa}',        [SOAController::class, 'update'])->name('accounting.soa.update');
        Route::delete('/soa/{soa}',        [SOAController::class, 'destroy'])->name('accounting.soa.destroy');
        Route::post  ('/soa/{id}/restore', [SOAController::class, 'restore'])->name('accounting.soa.restore');
    });

    /* ---------------- Treasury ---------------- */
    Route::prefix('treasury')->middleware('role:treasury')->group(function () {
        Route::inertia('/dashboard', 'Treasury/Dashboard')->name('treasury.dashboard');
        Route::inertia('/soa',       'Treasury/SOA')->name('treasury.soa'); // PAGE ONLY

        // SOA API
        Route::get   ('/soa/datatable',    [SOAController::class, 'datatable'])->name('treasury.soa.datatable');
        Route::post  ('/soa',              [SOAController::class, 'store'])->name('treasury.soa.store');
        Route::patch ('/soa/{soa}',        [SOAController::class, 'update'])->name('treasury.soa.update');
        Route::delete('/soa/{soa}',        [SOAController::class, 'destroy'])->name('treasury.soa.destroy');
        Route::post  ('/soa/{id}/restore', [SOAController::class, 'restore'])->name('treasury.soa.restore');
    });

    /* ---------------- Logout ---------------- */
    Route::post('/logout', [AuthController::class, 'sessionLogout'])->name('logout');

    // archives (general)
    Route::inertia('/archives', 'Archives')->name('archives');

});