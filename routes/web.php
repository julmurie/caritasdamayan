<?php

use Illuminate\Support\Facades\Route;
use App\Http\Controllers\Auth\LoginController;

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

// Clinic Volunteer Dashboard
Route::get('/clinic/dashboard', function () {
    return inertia('Clinic/Dashboard');
});

// Merchant Dashboard 
Route::get('/merchant/dashboard', function () {
    return inertia('Merchant/Dashboard');
});