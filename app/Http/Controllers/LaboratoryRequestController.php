<?php

namespace App\Http\Controllers;

use App\Models\LaboratoryRequest;
use App\Models\LaboratoryRequestItem;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Validation\ValidationException;

class LaboratoryRequestController extends Controller
{
    /**
     * Store a newly created laboratory chargeslip.
     */
    public function store(Request $request)
    {
        $validated = $request->validate([
            // META
            'meta.date'                       => 'required|date',
            'meta.clinic_print_name'          => 'nullable|string|max:255',
            'meta.issuing_program'            => 'nullable|string|max:255',
            'meta.partner_institution_branch' => 'nullable|string|max:255',
            'meta.parish_name'                => 'nullable|string|max:255',
            'meta.parish_address'             => 'nullable|string|max:255',
            'meta.partner_type'               => 'required|string|in:Family Partner,Non-Family Partner',
            'meta.fp_booklet_no'              => 'nullable|string|max:100',
            'meta.valid_govt_id_presented'    => 'nullable|string|max:255',
            'meta.ref_control'                => 'nullable|string|max:100',

            // PATIENT
            'patient.surname'     => 'required|string|max:255',
            'patient.firstname'   => 'required|string|max:255',
            'patient.mi'          => 'nullable|string|max:10',
            'patient.age'         => 'nullable|integer|min:0|max:120',
            'patient.sex'         => 'nullable|string|in:M,F',
            'patient.contact_no'  => 'nullable|string|max:50',
            'patient.diagnosis'   => 'nullable|string|max:255',
            'patient.address'     => 'nullable|string|max:255',
            'patient.senior_citizen' => 'nullable|boolean',
            'patient.pwd'            => 'nullable|boolean',

            // TABLES
            'hema'                 => 'array',
            'hema.*.name'          => 'required_with:hema|string|max:255',
            'hema.*.price'         => 'nullable|numeric|min:0',

            'radiology'            => 'array',
            'radiology.*.name'     => 'required_with:radiology|string|max:255',
            'radiology.*.specific' => 'nullable|string|max:255',
            'radiology.*.price'    => 'nullable|numeric|min:0',

            // OTHERS + TOTALS
            'others'                    => 'nullable|string|max:500',
            'totals.subtotal_hema'      => 'nullable|numeric|min:0',
            'totals.subtotal_radiology' => 'nullable|numeric|min:0',
            'totals.grand_total'        => 'nullable|numeric|min:0',
            'totals.amount_in_words'    => 'nullable|string|max:255',
        ]);

        // Require at least one selected test overall
        $hemaItems = collect($validated['hema'] ?? [])->filter(fn ($i) => !empty($i['name']))->values();
        $radioItems = collect($validated['radiology'] ?? [])->filter(fn ($i) => !empty($i['name']))->values();

        if ($hemaItems->isEmpty() && $radioItems->isEmpty()) {
            throw ValidationException::withMessages([
                'hema'      => 'Please select at least one test.',
                'radiology' => 'Please select at least one test.',
            ]);
        }

        // Create parent
        $req = LaboratoryRequest::create([
            'date'                       => $validated['meta']['date'],
            'clinic_print_name'          => $validated['meta']['clinic_print_name'] ?? null,
            'issuing_program'            => $validated['meta']['issuing_program'] ?? null,
            'partner_institution_branch' => $validated['meta']['partner_institution_branch'] ?? null,
            'parish_name'                => $validated['meta']['parish_name'] ?? null,
            'parish_address'             => $validated['meta']['parish_address'] ?? null,
            'partner_type'               => $validated['meta']['partner_type'],
            'fp_booklet_no'              => $validated['meta']['fp_booklet_no'] ?? null,
            'valid_govt_id_presented'    => $validated['meta']['valid_govt_id_presented'] ?? null,
            'ref_control'                => $validated['meta']['ref_control'] ?? null,

            'patient_surname'            => $validated['patient']['surname'],
            'patient_firstname'          => $validated['patient']['firstname'],
            'patient_mi'                 => $validated['patient']['mi'] ?? null,
            'patient_age'                => $validated['patient']['age'] ?? null,
            'patient_sex'                => $validated['patient']['sex'] ?? null,
            'patient_contact_no'         => $validated['patient']['contact_no'] ?? null,
            'patient_diagnosis'          => $validated['patient']['diagnosis'] ?? null,
            'patient_address'            => $validated['patient']['address'] ?? null,
            'patient_senior_citizen'     => (bool)($validated['patient']['senior_citizen'] ?? false),
            'patient_pwd'                => (bool)($validated['patient']['pwd'] ?? false),

            'others'                     => $validated['others'] ?? null,

            'subtotal_hema'              => $validated['totals']['subtotal_hema'] ?? 0,
            'subtotal_radiology'         => $validated['totals']['subtotal_radiology'] ?? 0,
            'grand_total'                => $validated['totals']['grand_total'] ?? 0,
            'amount_in_words'            => $validated['totals']['amount_in_words'] ?? null,

            'user_id'                    => Auth::id(),
        ]);

        // Create child items (hema)
        foreach ($hemaItems as $item) {
            LaboratoryRequestItem::create([
                'laboratory_request_id' => $req->id,
                'type'    => 'hema',
                'name'    => $item['name'],
                'specific'=> null,
                'price'   => $item['price'] ?? 0,
            ]);
        }

        // Create child items (radiology)
        foreach ($radioItems as $item) {
            LaboratoryRequestItem::create([
                'laboratory_request_id' => $req->id,
                'type'    => 'radiology',
                'name'    => $item['name'],
                'specific'=> $item['specific'] ?? null,
                'price'   => $item['price'] ?? 0,
            ]);
        }

        return redirect()
            ->route('volunteer.documents.referral')   // ← back to the page you already routed
            ->with('success', 'Referral saved successfully!');

    }
}
