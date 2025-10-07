<?php

namespace App\Http\Controllers;

use App\Models\User;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Hash;
use Illuminate\Validation\Rule;
use Illuminate\Validation\ValidationException;

class UserController extends Controller
{
    /* -----------------------------------------------------------------
     | DataTable for Users
     -----------------------------------------------------------------*/
    public function datatable(Request $request)
    {
        $query = User::query();

        if ($request->has('search') && !empty($request->search['value'])) {
            $search = $request->search['value'];
            $query->where(function ($q) use ($search) {
                $q->where('email', 'like', "%$search%")
                    ->orWhere('firstname', 'like', "%$search%")
                    ->orWhere('lastname', 'like', "%$search%")
                    ->orWhere('role', 'like', "%$search%")
                    ->orWhere('branch_name', 'like', "%$search%")
                    ->orWhere('job_description', 'like', "%$search%")
                    ->orWhere('merchant_type', 'like', "%$search%");
            });
        }

        $total = $query->count();
        $length = (int) $request->input('length', 10);
        $start = (int) $request->input('start', 0);

        $users = $query->skip($start)->take($length)->get();

        return response()->json([
            'draw' => (int) $request->input('draw'),
            'recordsTotal' => User::count(),
            'recordsFiltered' => $total,
            'data' => $users,
        ]);
    }

    /* -----------------------------------------------------------------
     | Store a new user
     -----------------------------------------------------------------*/
public function store(Request $request)
{
    try {
        $validated = $request->validate([
            'role' => ['required', Rule::in(['admin', 'volunteer', 'merchant', 'accounting', 'treasury'])],
            'email' => ['required', 'email', 'unique:users,email'],
            'firstName' => ['nullable', 'string'],
            'lastName' => ['nullable', 'string'],
            'jobDescription' => ['nullable', 'string'],
            'branchName' => ['nullable', 'string'],
            'branchItem' => ['nullable', 'string'],
        ]);

        $user = User::create([
            'role' => $validated['role'],
            'email' => $validated['email'],
            'password' => Hash::make('DefaultPassword123!'),
            'firstname' => $validated['firstName'] ?? null,
            'lastname' => $validated['lastName'] ?? null,
            'job_description' => $validated['jobDescription'] ?? null,
            'branch_name' => $validated['branchName'] ?? null,
            'merchant_type' => $validated['branchItem'] ?? null,
        ]);

        return response()->json(['message' => 'User created', 'user' => $user], 201);

    } catch (ValidationException $e) {
        // ✅ Return Laravel-style 422 response with validation details
        return response()->json([
            'message' => $e->getMessage(),
            'errors'  => $e->errors(),
        ], 422);

    } catch (\Throwable $e) {
        // Handle unexpected errors
        return response()->json([
            'message' => 'Error creating user',
            'error'   => $e->getMessage(),
        ], 500);
    }
}
    /* -----------------------------------------------------------------
     | Show single user
     -----------------------------------------------------------------*/
    public function show(User $user)
    {
        return response()->json($user);
    }

    /* -----------------------------------------------------------------
     | Update user
     -----------------------------------------------------------------*/
public function update(Request $request, User $user)
{
    try {
        $validated = $request->validate([
            'role' => 'sometimes|in:admin,volunteer,merchant,accounting,treasury',
            'email' => 'sometimes|email|unique:users,email,' . $user->id,
            'firstName' => 'nullable|string',
            'lastName' => 'nullable|string',
            'jobDescription' => 'nullable|string',
            'branchName' => 'nullable|string',
            'branchItem' => 'nullable|string',
            'is_active' => 'boolean', // ✅ include validation
        ]);

        $user->update([
            'role' => $validated['role'] ?? $user->role,
            'email' => $validated['email'] ?? $user->email,
            'firstname' => $validated['firstName'] ?? $user->firstname,
            'lastname' => $validated['lastName'] ?? $user->lastname,
            'job_description' => $validated['jobDescription'] ?? $user->job_description,
            'branch_name' => $validated['branchName'] ?? $user->branch_name,
            'merchant_type' => $validated['branchItem'] ?? $user->merchant_type,
            'is_active' => array_key_exists('is_active', $validated)
                ? $validated['is_active']
                : $user->is_active, // ✅ properly update status
        ]);

        return response()->json(['message' => 'User updated', 'user' => $user]);
    } catch (\Throwable $e) {
        return response()->json([
            'message' => 'Error updating user',
            'error' => $e->getMessage(),
        ], 500);
    }
}
    /* -----------------------------------------------------------------
     | Archive (soft delete)
     -----------------------------------------------------------------*/
    public function archive(User $user)
    {
        try {
            $user->is_active = false; // ✅ deactivate
            $user->save();
            $user->delete(); // soft delete
            return response()->json(['message' => 'User archived and deactivated']);
        } catch (\Throwable $e) {
            return response()->json(['message' => 'Error archiving user', 'error' => $e->getMessage()], 500);
        }
    }

    /* -----------------------------------------------------------------
     | Restore archived user
     -----------------------------------------------------------------*/
    public function restore($id)
    {
        try {
            $user = User::withTrashed()->findOrFail($id);
            $user->restore();
            $user->update(['is_active' => true]); // ✅ re-enable account
            return response()->json(['message' => 'User restored and reactivated']);
        } catch (\Throwable $e) {
            return response()->json(['message' => 'Error restoring user', 'error' => $e->getMessage()], 500);
        }
    }

    /* -----------------------------------------------------------------
     | List archived users
     -----------------------------------------------------------------*/
    public function archived()
    {
        $archivedUsers = User::onlyTrashed()->get();
        return response()->json($archivedUsers);
    }

    /* -----------------------------------------------------------------
     | Hard delete (optional, not used by frontend)
     -----------------------------------------------------------------*/
    public function destroy(User $user)
  {
      if ($user->trashed()) {
          return response()->json(['message' => 'User already archived.'], 400);
      }

      $user->delete(); // this sets deleted_at
      return response()->json(['message' => 'User archived successfully.']);
  }

}
