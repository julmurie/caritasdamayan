<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\DB;
use App\Models\Referral;
use Illuminate\Validation\ValidationException;

class ReferralController extends Controller
{
    public function store(Request $request)
    {
        $validated = $request->validate([
            // META
            'meta.date' => 'required|date',
            'meta.ref_control_no' => 'nullable|string|max:100',
            'meta.issuing_program_cia' => 'nullable|boolean',
            'meta.issuing_program_gen129' => 'nullable|boolean',
            'meta.issuing_program_alliswell' => 'nullable|boolean',
            'meta.all_is_well' => 'nullable|string|max:255',
            'meta.other_programs' => 'nullable|string|max:255',
            'meta.referred_to' => 'nullable|string|max:255',

            // CLIENT
            'client.name' => 'required|string|max:255',
            'client.diagnosis' => 'nullable|string|max:255',
            'client.contact_no' => 'nullable|string|max:50',
            'client.address' => 'nullable|string|max:255',
            'client.parish_name' => 'nullable|string|max:255',
            'client.diocese' => 'nullable|string|max:255',
            'client.partner_type' => 'required|string|in:Family Partner,Non Family Partner',
            'client.fp_booklet_no' => 'nullable|string|max:100',
            'client.valid_id_presented' => 'nullable|string|max:255',

            // ASSISTANCE & DOCS
            'assistance' => 'array',
            'assistance.*.name' => 'required_with:assistance|string|max:255',
            'assistance.*.note' => 'nullable|string|max:500',
            'initial_provided' => 'nullable|string|max:2000',

            'documents' => 'array',
            'documents.*' => 'string|max:255',
            'documents_other' => 'nullable|string|max:500',
        ]);

        if (empty($validated['assistance']) && empty($validated['documents'])) {
            throw ValidationException::withMessages([
                'assistance' => 'Please select at least one assistance or one supporting document.',
            ]);
        }

        DB::transaction(function () use ($validated) {
            $meta = $validated['meta'];
            $client = $validated['client'];

            Referral::create([
                'user_id' => Auth::id(),
                'date' => $meta['date'],
                'ref_control_no' => $meta['ref_control_no'] ?? null,
                'issuing_program_cia' => (bool)($meta['issuing_program_cia'] ?? false),
                'issuing_program_gen129' => (bool)($meta['issuing_program_gen129'] ?? false),
                'issuing_program_alliswell' => (bool)($meta['issuing_program_alliswell'] ?? false),
                'all_is_well' => $meta['all_is_well'] ?? null,
                'other_programs' => $meta['other_programs'] ?? null,
                'referred_to' => $meta['referred_to'] ?? null,

                'client_name' => $client['name'],
                'diagnosis' => $client['diagnosis'] ?? null,
                'contact_no' => $client['contact_no'] ?? null,
                'address' => $client['address'] ?? null,
                'parish_name' => $client['parish_name'] ?? null,
                'diocese' => $client['diocese'] ?? null,
                'partner_type' => $client['partner_type'],
                'fp_booklet_no' => $client['fp_booklet_no'] ?? null,
                'valid_id_presented' => $client['valid_id_presented'] ?? null,

                'initial_provided' => $validated['initial_provided'] ?? null,
                'documents_other' => $validated['documents_other'] ?? null,

                // store as JSON
                'assistance' => $validated['assistance'] ?? [],
                'documents' => $validated['documents'] ?? [],
            ]);
        });

        return back()->with('success', 'Referral saved successfully!');
    }
}
