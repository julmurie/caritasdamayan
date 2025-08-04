<?php

namespace App\Http\Controllers;

use App\Models\User;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Hash;
use Illuminate\Validation\Rule;

class UserController extends Controller
{
 public function store(Request $request)
{
    try {
        $validated = $request->validate([
            'role' => ['required', Rule::in(['admin', 'volunteer', 'merchant', 'accounting', 'treasury'])],
            'email' => ['required', 'email', 'unique:users,email'],
            'firstName' => ['required_unless:role,merchant', 'string'],
            'lastName' => ['required_unless:role,merchant', 'string'],
            'jobDescription' => ['required_unless:role,merchant', 'string'],
            'branchName' => ['required_if:role,merchant', 'string'],
            'branchItem' => ['required_if:role,merchant', Rule::in(['product', 'lab'])],
        ]);

        // Safely handle missing fields with null coalescing (??)
        $user = User::create([
            'email' => $validated['email'],
            'password' => Hash::make('DefaultPassword123!'),
            'role' => $validated['role'],
            'firstname' => $validated['firstName'] ?? null,  // Fallback to null if not provided
            'lastname' => $validated['lastName'] ?? null,
            'job_description' => $validated['jobDescription'] ?? null,
            'branch_name' => $validated['branchName'] ?? null,  // Merchant-only field
            'merchant_type' => $validated['branchItem'] ?? null, // Merchant-only field
        ]);

        return response()->json([
                'message' => 'User registered successfully.',
                'user' => $user
            ], 201);

    } catch (\Exception $e) {
        // Always return JSON, even for errors
        return response()->json([
            'error' => $e->getMessage(),
            'trace' => $e->getTraceAsString() // Optional: for debugging
        ], 500);
    }
}
}
