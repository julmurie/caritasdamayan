<?php

namespace App\Http\Controllers;

use App\Models\SOA;
use Illuminate\Http\Request;
use Inertia\Inertia;

class SOAController extends Controller
{
    // Render page (Inertia)
    public function index(Request $request)
    {
        // You can pull merchant from auth/profile if you have that
        $merchant = $request->user()->merchant_name ?? 'Generika';

        return Inertia::render('Merchant/SOA', [
            'merchant'   => $merchant,
            // Optional: preload nothing; DataTables will fetch via ajax
            'soaRecords' => [], 
        ]);
    }

    // DataTables server-side JSON
    public function datatable(Request $request)
    {
        // Basic DataTables params
        $draw   = (int) $request->input('draw', 1);
        $start  = (int) $request->input('start', 0);
        $length = (int) $request->input('length', 20);

        // Base query
        $query = Soa::query();

        // Global search
        $globalSearch = $request->input('search.value');
        if (!empty($globalSearch)) {
            $query->where(function ($q) use ($globalSearch) {
                $q->where('number', 'like', "%{$globalSearch}%")
                  ->orWhere('cover_period', 'like', "%{$globalSearch}%")
                  ->orWhere('charge_slip', 'like', "%{$globalSearch}%")
                  ->orWhere('status', 'like', "%{$globalSearch}%");
            });
        }

        // Column-specific filters (from header inputs)
        // DataTables sends columns[i][search][value]
        $columns = $request->input('columns', []);
        $map = [
            0 => 'number',
            1 => 'soa_date',
            2 => 'cover_period',
            3 => 'charge_slip',
            4 => 'total_amount',
            5 => 'attachment',
            6 => 'status',
            // 7 => 'action' (virtual)
        ];
        foreach ($columns as $idx => $col) {
            $val = trim($col['search']['value'] ?? '');
            if ($val === '' || !isset($map[$idx])) continue;

            $field = $map[$idx];

            if ($field === 'soa_date') {
                // Allow yyyy-mm-dd or a range "2025-01-01|2025-01-31"
                if (str_contains($val, '|')) {
                    [$from, $to] = array_map('trim', explode('|', $val, 2));
                    if ($from) $query->whereDate('soa_date', '>=', $from);
                    if ($to)   $query->whereDate('soa_date', '<=', $to);
                } else {
                    $query->whereDate('soa_date', $val);
                }
            } elseif ($field === 'total_amount') {
                // Allow ranges "100|5000"
                if (str_contains($val, '|')) {
                    [$min, $max] = array_map('trim', explode('|', $val, 2));
                    if ($min !== '') $query->where('total_amount', '>=', (float) $min);
                    if ($max !== '') $query->where('total_amount', '<=', (float) $max);
                } else {
                    $query->where('total_amount', (float) $val);
                }
            } else {
                $query->where($field, 'like', "%{$val}%");
            }
        }

        // Total counts
        $recordsTotal    = Soa::count();
        $recordsFiltered = (clone $query)->count();

        // Ordering
        $order = $request->input('order.0'); // first order instruction
        if ($order) {
            $orderColIdx = (int) ($order['column'] ?? 0);
            $dir         = $order['dir'] === 'desc' ? 'desc' : 'asc';
            $orderCol    = $map[$orderColIdx] ?? 'number';
            if ($orderCol !== 'action') {
                $query->orderBy($orderCol, $dir);
            }
        } else {
            $query->orderBy('soa_date', 'desc');
        }

        // Pagination
        if ($length !== -1) {
            $query->skip($start)->take($length);
        }

        // Build rows for DataTables
        $rows = $query->get()->map(function (Soa $s) {
            return [
                'number'       => $s->number,
                'soa_date'     => optional($s->soa_date)->toDateString(),
                'cover_period' => $s->cover_period,
                'charge_slip'  => $s->charge_slip,
                'total_amount' => number_format($s->total_amount, 2),
                'attachment'   => $s->attachment,  // or linkify here
                'status'       => $s->status,
                'action'       => '',               // front-end renders buttons
                'id'           => $s->id,           // handy for actions
            ];
        });

        return response()->json([
            'draw'            => $draw,
            'recordsTotal'    => $recordsTotal,
            'recordsFiltered' => $recordsFiltered,
            'data'            => $rows,
        ]);
    }

    // --- CRUD (minimal) ---
    public function store(Request $request)
    {
        $validated = $request->validate([
            'number'       => ['required','string','max:100','unique:soas,number'],
            'soa_date'     => ['required','date'],
            'cover_period' => ['nullable','string','max:255'],
            'charge_slip'  => ['nullable','string','max:255'],
            'total_amount' => ['required','numeric','min:0'],
            'attachment'   => ['nullable','string','max:255'],
            'status'       => ['required','string','max:50'],
        ]);

        Soa::create($validated);
        return back()->with('success', 'SOA created.');
    }

    public function update(Request $request, Soa $soa)
    {
        $validated = $request->validate([
            'number'       => ['required','string','max:100','unique:soas,number,'.$soa->id],
            'soa_date'     => ['required','date'],
            'cover_period' => ['nullable','string','max:255'],
            'charge_slip'  => ['nullable','string','max:255'],
            'total_amount' => ['required','numeric','min:0'],
            'attachment'   => ['nullable','string','max:255'],
            'status'       => ['required','string','max:50'],
        ]);

        $soa->update($validated);
        return back()->with('success', 'SOA updated.');
    }

    public function destroy(Soa $soa)
    {
        $soa->delete();
        return back()->with('success', 'SOA deleted.');
    }

    public function restore($id)
    {
        Soa::withTrashed()->findOrFail($id)->restore();
        return back()->with('success', 'SOA restored.');
    }
}
