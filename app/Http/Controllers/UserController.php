<?php

namespace App\Http\Controllers;

use App\Models\User;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Hash;
use Illuminate\Validation\Rule;

class UserController extends Controller
{
 
// For User Table
public function datatable(Request $request)
{
    $query = User::query();

     // Search (now includes merchant_type and date strings)
    if ($request->has('search') && !empty($request->search['value'])) {
        $search = $request->search['value'];
        $query->where(function ($q) use ($search) {
            $q->where('email', 'like', "%$search%")
              ->orWhere('firstname', 'like', "%$search%")
              ->orWhere('lastname', 'like', "%$search%")
              ->orWhere('role', 'like', "%$search%")
              ->orWhere('branch_name', 'like', "%$search%")
              ->orWhere('job_description', 'like', "%$search%")
              ->orWhere('merchant_type', 'like', "%$search%")
              ->orWhereRaw("DATE_FORMAT(created_at, '%Y-%m-%d %H:%i:%s') like ?", ["%$search%"])
              ->orWhereRaw("DATE_FORMAT(updated_at, '%Y-%m-%d %H:%i:%s') like ?", ["%$search%"]);
        });
    }

    // Get total count before pagination
    $total = $query->count();

    $columns = [
        'role',
        'firstname',
        'merchant_type',
        'branch_name',
        'job_description',
        'email',
        'is_active',
        'created_at',
        'updated_at',
    ];

    // Sorting
    if ($request->has('order') && isset($request->order[0]['column'])) {
            $idx = (int) $request->order[0]['column'];
            $orderColumn = $columns[$idx] ?? 'created_at';
            $orderDirection = $request->order[0]['dir'] ?? 'desc';
            $query->orderBy($orderColumn, $orderDirection);
        } else {
            // Default: newest first
            $query->orderBy('created_at', 'desc');
        }

    // Pagination
        $length = (int) $request->input('length', 10);
        $start  = (int) $request->input('start', 0);
        $users  = $query->skip($start)->take($length)->get();

    // Response
    return response()->json([
        'draw'            => (int) $request->input('draw'),
        'recordsTotal'    => User::count(),
        'recordsFiltered' => $total,
        'data' => $users->map(function ($user) {
            return [
                'id'              => $user->id,
                'role'            => $user->role ?? '-',
                'firstname'       => $user->firstname ?? '',
                'lastname'        => $user->lastname ?? '',
                'merchant_type'   => $user->merchant_type ?? null,  // "product" | "lab" | null
                'branch_name'     => $user->branch_name ?? '-',
                'job_description' => $user->job_description ?? '-',
                'email'           => $user->email ?? '-',
                'is_active'       => (bool) ($user->is_active ?? true),
                'created_at'      => optional($user->created_at)->toIso8601String(),
                'updated_at'      => optional($user->updated_at)->toIso8601String(),
            ];
        }),
    ]);
}


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

        
        $user = User::create([
            'email' => $validated['email'],
            'password' => Hash::make('DefaultPassword123!'),
            'role' => $validated['role'],
            'firstname' => $validated['firstName'] ?? null,  
            'lastname' => $validated['lastName'] ?? null,
            'job_description' => $validated['jobDescription'] ?? null,
            'branch_name' => $validated['branchName'] ?? null, 
            'merchant_type' => $validated['branchItem'] ?? null, 
        ]);

         return response()->json(['message' => 'User registered successfully.', 'user' => $user], 201);
    } catch (\Exception $e) {
        return response()->json(['error' => 'Something went wrong.'], 500);
    }
}

// Get single user
public function show(User $user)
{
    return response()->json($user);
}

// Update user
public function update(Request $request, User $user)
{
    $validated = $request->validate([
        'role' => 'sometimes|in:admin,volunteer,merchant,accounting,treasury',
        'email' => 'sometimes|email|unique:users,email,'.$user->id,
        'firstName' => 'sometimes|required_if:role,admin,volunteer,accounting,treasury',
        'lastName' => 'sometimes|required_if:role,admin,volunteer,accounting,treasury',
        'jobDescription' => 'sometimes|required_if:role,admin,volunteer,accounting,treasury',
        'branchName' => 'sometimes|required_if:role,merchant',
        'branchItem' => 'sometimes|required_if:role,merchant|in:product,lab'
    ]);

    $user->update([
        'email' => $validated['email'] ?? $user->email,
        'role' => $validated['role'] ?? $user->role,
        'firstname' => $validated['firstName'] ?? $user->firstname,
        'lastname' => $validated['lastName'] ?? $user->lastname,
        'job_description' => $validated['jobDescription'] ?? $user->job_description,
        'branch_name' => $validated['branchName'] ?? $user->branch_name,
        'merchant_type' => $validated['branchItem'] ?? $user->merchant_type
    ]);

    return response()->json($user);
}

// Delete user
public function destroy(User $user)
{
    $user->delete();
    return response()->json(['message' => 'User deleted successfully']);
}
}