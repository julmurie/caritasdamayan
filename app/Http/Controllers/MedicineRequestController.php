<?php

namespace App\Http\Controllers;

use App\Models\MedicineRequest;
use App\Models\MedicineRequestItem;
use App\Models\Document;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;



class MedicineRequestController extends Controller
{
    /**
     * Store a newly created medicine request.
     */
    public function store(Request $request)
    {
        $validated = $request->validate([
            'date' => 'required|date',
            'all_is_well' => 'nullable|string|max:255',
            'partner_institution_branch' => 'nullable|string|max:255',
            'clinic_name' => 'nullable|string|max:255',
            'partner_institution_name' => 'nullable|string|max:255',
            'parish_name' => 'nullable|string|max:255',
            'parish_address' => 'nullable|string|max:255',
            'partner_type' => 'required|string|in:Family Partner,Non-Family Partner',

            'patient_id' => 'required|exists:patients,id', // ✅ correct usage
            'patient_surname' => 'required|string|max:255',
            'patient_firstname' => 'required|string|max:255',
            'patient_mi' => 'nullable|string|max:10',
            'patient_age' => 'nullable|integer|min:0',
            'patient_address' => 'nullable|string|max:255',
            'patient_contact_number' => 'nullable|string|max:50',
            'patient_government_id' => 'nullable|string|max:100',
            'patient_diagnosis' => 'nullable|string|max:255',

            'subtotal_a' => 'nullable|numeric',
            'subtotal_b' => 'nullable|numeric',
            'grand_total' => 'nullable|numeric',
            'total_amount_words' => 'nullable|string|max:255',

            'items' => 'required|array|min:1',
            'items.*.unitCost' => 'nullable|string|max:50',
            'items.*.qty' => 'nullable|string|max:50',
            'items.*.packaging' => 'nullable|string|max:100',
            'items.*.name' => 'required|string|max:255',
            'items.*.dosage' => 'nullable|string|max:100',
            'items.*.amount' => 'nullable|string|max:50',
            'items.*.remarks' => 'nullable|string|max:255',
        ]);

        $medicineRequest = MedicineRequest::create([
            'patient_id' => $validated['patient_id'], // ✅ add this
            'date' => $validated['date'],
            'all_is_well' => $validated['all_is_well'] ?? null,
            'partner_institution_branch' => $validated['partner_institution_branch'] ?? null,
            'clinic_name' => $validated['clinic_name'] ?? null,
            'partner_institution_name' => $validated['partner_institution_name'] ?? null,
            'parish_name' => $validated['parish_name'] ?? null,
            'parish_address' => $validated['parish_address'] ?? null,
            'partner_type' => $validated['partner_type'],

            'patient_surname' => $validated['patient_surname'],
            'patient_firstname' => $validated['patient_firstname'],
            'patient_mi' => $validated['patient_mi'] ?? null,
            'patient_age' => $validated['patient_age'] ?? null,
            'patient_address' => $validated['patient_address'] ?? null,
            'patient_contact_number' => $validated['patient_contact_number'] ?? null,
            'patient_government_id' => $validated['patient_government_id'] ?? null,
            'patient_diagnosis' => $validated['patient_diagnosis'] ?? null,

            'subtotal_a' => $validated['subtotal_a'] ?? 0,
            'subtotal_b' => $validated['subtotal_b'] ?? 0,
            'grand_total' => $validated['grand_total'] ?? 0,
            'total_amount_words' => $validated['total_amount_words'] ?? null,

            'user_id' => Auth::id(), 
        ]);

        
        foreach ($validated['items'] as $item) {
            MedicineRequestItem::create([
                'medicine_request_id' => $medicineRequest->id,
                'unit_cost' => $item['unitCost'] ?? null,
                'qty' => $item['qty'] ?? null,
                'packaging' => $item['packaging'] ?? null,
                'name' => $item['name'],
                'dosage' => $item['dosage'] ?? null,
                'amount' => $item['amount'] ?? null,
                'remarks' => $item['remarks'] ?? null,
            ]);
        }

            // 3️⃣ 🔥 NEW: Automatically create document record
    \App\Models\Document::create([
        'patient_id' => $medicineRequest->patient_id,
        'doc_type' => 'Medicine Request',
        'file_path' => null,
        'status' => 'Pending',
    ]);

        // 4. Redirect or respond
        return redirect()
            ->route('volunteer.documents.medicine')
            ->with('success', 'Medicine request created successfully!');
    }
}
