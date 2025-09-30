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
            'patient_fname'   => ['required', 'string', 'max:255'],
            'patient_lname'   => ['required', 'string', 'max:255'],
            'patient_mname'   => ['nullable', 'string', 'max:255'],
            'gender'          => ['nullable', 'in:Male,Female,Others'],
            'birthday'        => ['nullable', 'date'],
            'contact_no'      => ['nullable', 'string', 'max:50'],
            'address'         => ['nullable', 'string', 'max:500'],
            'clinic'          => ['nullable', 'string', 'max:255'],
            'parish'          => ['nullable', 'string', 'max:255'],
            'classification_cm' => ['nullable', 'in:FP,NFP'],
            'category'        => ['nullable', 'string', 'max:255'],
            'booklet_no'      => ['nullable', 'string', 'max:50'],
            'is_head_family'  => ['required', 'boolean'],
            'valid_id_no'     => ['nullable', 'string', 'max:100'],
            'endorsed_as_fp'  => ['required', 'boolean'],
            'first_time_visit'=> ['required', 'boolean'],
            'has_philhealth'  => ['required', 'boolean'],
            'philhealth_no'   => ['nullable', 'string', 'max:50'],
        ]);


        // create patient first
        $patient = Patient::create($validated);

        // generate patient_no (e.g. padded ID: 00001) if not set
        $patient->patient_no = str_pad($patient->patient_id, 5, '0', STR_PAD_LEFT);

        // generate patient_code (e.g. first 3 letters of lname + ID)
        $prefix = strtoupper(substr($patient->patient_lname, 0, 3));
        $patient->patient_code = $prefix . $patient->patient_id;

        $patient->save();

        return response()->json($patient, 201);
    }
}
