<?php

namespace App\Http\Controllers;

use App\Models\Patient;
use Illuminate\Http\Request;

class PatientController extends Controller
{
    // GET /api/patients  (for the sidebar list)
    public function index()
    {
        // return newest first; keep it light for sidebar
        return Patient::orderBy('patient_lname')->orderBy('patient_fname')->get([
            'patient_id','patient_lname','patient_fname','patient_mname'
        ]);
    }

    // POST /api/patients  (from the modal)
    public function store(Request $request)
    {
        $data = $request->validate([
            'patient_lname' => 'required|string|max:100',
            'patient_fname' => 'required|string|max:100',
            'patient_mname' => 'nullable|string|max:100',
            'address'       => 'nullable|string|max:255',
            'birthday'      => 'nullable|date',
            'gender'        => 'nullable|in:Male,Female',
            'contact_no'    => 'nullable|string|max:20',

            // keep these optional
            'cb_by'       => 'nullable|integer',
            'pb_id'       => 'nullable|integer',
            'assessed_by' => 'nullable|integer',
            'class_id'    => 'nullable|integer',
            'assist_id'   => 'nullable|integer',
        ]);

        // If you want to auto-fill system fields, do it here:
        // $data['cb_by'] = auth()->id();

        $patient = Patient::create($data);
        return response()->json($patient, 201);
    }
}
