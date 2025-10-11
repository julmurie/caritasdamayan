<?php

use App\Models\Document;
use Illuminate\Http\Request;

class DocumentController extends Controller
{
    public function store(Request $request)
    {
        $validated = $request->validate([
            'patient_id' => 'required|exists:patients,patient_id',
            'doc_type' => 'required|string|max:100',
            'file_path' => 'nullable|string|max:255',
        ]);

        $doc = Document::create([
            'patient_id' => $validated['patient_id'],
            'doc_type' => $validated['doc_type'],
            'file_path' => $validated['file_path'] ?? null,
            'status' => 'Pending',
        ]);

        return response()->json($doc, 201);
    }

    public function getByPatient($id)
    {
        $docs = Document::where('patient_id', $id)->latest()->get();
        return response()->json($docs);
    }
}
