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
    public function index(Request $request): JsonResponse
    {
        $query = Patient::query();

        if ($request->has('archived')) {
            $archived = filter_var($request->archived, FILTER_VALIDATE_BOOLEAN);
            $query->where('archived', $archived);
        } else {
            // default: only active patients
            $query->where('archived', false);
        }

        $patients = $query->orderBy('patient_lname')
            ->orderBy('patient_fname')
            ->get([
                'patient_id',
                'patient_no',
                'patient_code',
                'patient_fname',
                'patient_lname',
                'patient_mname',
                'archived',
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
            'patient_fname'   => ['required', 'string', 'max:100'],
            'patient_lname'   => ['required', 'string', 'max:100'],
            'patient_mname'   => ['nullable', 'string', 'max:50'],
            'gender'          => ['nullable', 'in:Male,Female,Others'],
            'birthday'        => ['nullable', 'date'],
            'contact_no'      => ['nullable', 'string', 'max:50'],
            'address'         => ['nullable', 'string', 'max:255'],
            'clinic'          => ['nullable', 'string', 'max:255'],
            'parish'          => ['nullable', 'string', 'max:255'],
            'classification_cm' => ['nullable', 'in:FP,NFP'],
            'category'        => ['nullable', 'string', 'max:255'],

            'booklet_no'      => ['nullable', 'string', 'max:50'],
            'is_head_family'  => ['nullable', 'boolean'],

            'valid_id_no'     => ['nullable', 'string', 'max:100'],
            'endorsed_as_fp'  => ['nullable', 'boolean'],
            'first_time_visit'=> ['nullable', 'boolean'],

            'has_philhealth'  => ['required', 'boolean'],
            'philhealth_no'   => ['nullable', 'string', 'max:50'],
        ]);

        $lastNo = Patient::max('patient_no');
        $nextNo = $lastNo ? intval($lastNo) + 1 : 1000; // start from 1000
        $validated['patient_no'] = str_pad($nextNo, 6, '0', STR_PAD_LEFT);

        $initials = strtoupper(substr($validated['patient_fname'], 0, 1) . substr($validated['patient_lname'], 0, 1));
        $validated['patient_code'] = $initials . '-' . strtoupper(uniqid());

        $patient = Patient::create($validated);

        return response()->json($patient, 201);
    }
}