<?php

namespace App\Http\Controllers;

use App\Models\Patient;
use Illuminate\Http\Request;
use Illuminate\Http\JsonResponse;

class PatientController extends Controller
{
    /**
     * GET /api/patients
     */
    public function index(): JsonResponse
    {
        // Return a lightweight list for the sidebar
        $patients = Patient::query()
            ->orderBy('patient_lname')
            ->orderBy('patient_fname')
            ->get([
                'patient_id',
                'patient_fname',
                'patient_lname',
                'patient_mname',
            ]);

        return response()->json($patients);
    }

    /**
     * GET /api/patients/{id}
     */
    public function show(int $id): JsonResponse
    {
        $patient = Patient::findOrFail($id);

        // You can compute any derived fields here, or do it on the client
        // e.g. age (if you want)
        if ($patient->birthday) {
            $patient->age = $patient->birthday->age;
        }

        return response()->json($patient);
    }

    /**
     * POST /api/patients
     */
    public function store(Request $request): JsonResponse
    {
        $validated = $request->validate([
            'patient_fname'   => ['required', 'string', 'max:255'],
            'patient_lname'   => ['required', 'string', 'max:255'],
            'patient_mname'   => ['nullable', 'string', 'max:255'],
            'gender'          => ['nullable', 'in:Male,Female,Others'],
            'birthday'        => ['nullable', 'date'],
            'contact_no'      => ['nullable', 'string', 'max:50'],
            'address'         => ['nullable', 'string', 'max:500'],
            'clinic'          => ['nullable', 'string', 'max:255'],
            'parish'          => ['nullable', 'string', 'max:255'],
            'classification_cm' => ['nullable', 'string', 'max:50'], // FP/NFP
            'category'        => ['nullable', 'string', 'max:255'],
            'booklet_no'      => ['nullable', 'string', 'max:50'],
            'is_head_family'  => ['nullable', 'boolean'],
            'valid_id_no'     => ['nullable', 'string', 'max:100'],
            'endorsed_as_fp'  => ['nullable', 'boolean'],
            'first_time_visit'=> ['nullable', 'boolean'],
        ]);

        $patient = Patient::create($validated);

        return response()->json($patient, 201);
    }

}
