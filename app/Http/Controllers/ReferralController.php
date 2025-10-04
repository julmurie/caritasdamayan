<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Validation\ValidationException;

use App\Models\Referral;
use App\Models\ReferralAssistance;
use App\Models\ReferralDocument;

class ReferralController extends Controller
{
    /**
     * Store a newly created referral.
     *
     * Expected payload from ReferralForm.jsx:
     * {
     *   meta: {
     *     date, ref_control_no, issuing_program_cia(bool), issuing_program_gen129(bool),
     *     all_is_well, other_programs, referred_to
     *   },
     *   client: {
     *     name, diagnosis, contact_no, address, parish_name, diocese,
     *     partner_type ("Family Partner" | "Non Family Partner"),
     *     fp_booklet_no, valid_id_presented
     *   },
     *   assistance: [{ name, note }],
     *   initial_provided: string,
     *   documents: [string, ...],
     *   documents_other: string
     * }
     */
    public function store(Request $request)
    {
        $validated = $request->validate([
            // META
            'meta.date'                       => 'required|date',
            'meta.ref_control_no'             => 'nullable|string|max:100',
            'meta.issuing_program_cia'        => 'nullable|boolean',
            'meta.issuing_program_gen129'     => 'nullable|boolean',
            'meta.all_is_well'                => 'nullable|string|max:255',
            'meta.other_programs'             => 'nullable|string|max:255',
            'meta.referred_to'                => 'nullable|string|max:255',

            // CLIENT
            'client.name'               => 'required|string|max:255',
            'client.diagnosis'          => 'nullable|string|max:255',
            'client.contact_no'         => 'nullable|string|max:50',
            'client.address'            => 'nullable|string|max:255',
            'client.parish_name'        => 'nullable|string|max:255',
            'client.diocese'            => 'nullable|string|max:255',
            'client.partner_type'       => 'required|string|in:Family Partner,Non Family Partner',
            'client.fp_booklet_no'      => 'nullable|string|max:100',
            'client.valid_id_presented' => 'nullable|string|max:255',

            // ASSISTANCE + DOCS
            'assistance'            => 'array',
            'assistance.*.name'     => 'required_with:assistance|string|max:255',
            'assistance.*.note'     => 'nullable|string|max:500',
            'initial_provided'      => 'nullable|string|max:2000',

            'documents'             => 'array',
            'documents.*'           => 'string|max:255',
            'documents_other'       => 'nullable|string|max:500',
        ]);

        // (Optional) Require at least one assistance OR one document
        if (empty($validated['assistance']) && empty($validated['documents'])) {
            throw ValidationException::withMessages([
                'assistance' => 'Please select at least one assistance or one supporting document.',
            ]);
        }

        // Parent
        $ref = Referral::create([
            'date'                   => $validated['meta']['date'],
            'ref_control_no'         => $validated['meta']['ref_control_no'] ?? null,
            'issuing_program_cia'    => (bool)($validated['meta']['issuing_program_cia'] ?? false),
            'issuing_program_gen129' => (bool)($validated['meta']['issuing_program_gen129'] ?? false),
            'all_is_well'            => $validated['meta']['all_is_well'] ?? null,
            'other_programs'         => $validated['meta']['other_programs'] ?? null,
            'referred_to'            => $validated['meta']['referred_to'] ?? null,

            'client_name'            => $validated['client']['name'],
            'client_diagnosis'       => $validated['client']['diagnosis'] ?? null,
            'client_contact_no'      => $validated['client']['contact_no'] ?? null,
            'client_address'         => $validated['client']['address'] ?? null,
            'client_parish_name'     => $validated['client']['parish_name'] ?? null,
            'client_diocese'         => $validated['client']['diocese'] ?? null,
            'partner_type'           => $validated['client']['partner_type'],
            'fp_booklet_no'          => $validated['client']['fp_booklet_no'] ?? null,
            'valid_id_presented'     => $validated['client']['valid_id_presented'] ?? null,

            'initial_provided'       => $validated['initial_provided'] ?? null,
            'documents_other'        => $validated['documents_other'] ?? null,

            'user_id'                => Auth::id(),
        ]);

        // Child rows: Assistance
        foreach (($validated['assistance'] ?? []) as $item) {
            ReferralAssistance::create([
                'referral_id' => $ref->id,
                'name'        => $item['name'],
                'note'        => $item['note'] ?? null,
            ]);
        }

        // Child rows: Documents
        foreach (($validated['documents'] ?? []) as $docName) {
            ReferralDocument::create([
                'referral_id' => $ref->id,
                'name'        => $docName,
            ]);
        }

        return redirect()
            // add this page route when you register it:
            ->route('volunteer.documents.referral')
            ->with('success', 'Referral saved successfully!');
    }
}
