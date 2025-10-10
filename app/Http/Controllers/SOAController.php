<?php

namespace App\Http\Controllers;

use App\Models\Soa; 
use Illuminate\Http\Request;
use Inertia\Inertia;

class SOAController extends Controller
{
    // Render page (Inertia)
    public function index(Request $request)
    {
        $merchant = $request->user()->merchant_name ?? 'Generika';

        return Inertia::render('Merchant/SOA', [
            'merchant'   => $merchant,
            'soaRecords' => [], // DataTables fetches via ajax
        ]);
    }

    // DataTables server-side JSON
    public function datatable(Request $request)
    {
        $draw   = (int) $request->input('draw', 1);
        $start  = (int) $request->input('start', 0);
        $length = (int) $request->input('length', 20);

        $query = Soa::query();

        // Global search
        $globalSearch = $request->input('search.value');
        if (!empty($globalSearch)) {
            $query->where(function ($q) use ($globalSearch) {
                $q->where('number', 'like', "%{$globalSearch}%")
                  ->orWhere('soa_date', 'like', "%{$globalSearch}%")
                  ->orWhere('cover_period', 'like', "%{$globalSearch}%")
                  ->orWhere('charge_slip', 'like', "%{$globalSearch}%")
                  ->orWhere('attachment', 'like', "%{$globalSearch}%")
                  ->orWhere('status', 'like', "%{$globalSearch}%");
            });
        }

        // (You can keep column-specific filters if you still send them; skipped here.)

        $recordsTotal = Soa::count();

        // Ordering
        $map = [
            0 => 'number',
            1 => 'soa_date',
            2 => 'cover_period',
            3 => 'charge_slip',
            4 => 'total_amount',
            5 => 'attachment',
            6 => 'status',
        ];
        $order = $request->input('order.0'); // first order instruction
        if ($order) {
            $orderColIdx = (int) ($order['column'] ?? 1);
            $dir         = $order['dir'] === 'desc' ? 'desc' : 'asc';
            $orderCol    = $map[$orderColIdx] ?? 'soa_date';
            $query->orderBy($orderCol, $dir);
        } else {
            $query->orderBy('soa_date', 'desc');
        }

        // Filtered count (clone before paging)
        $recordsFiltered = (clone $query)->count();

        // Pagination
        if ($length !== -1) {
            $query->skip($start)->take($length);
        }

        // Build rows for DataTables
        $rows = $query->get()->map(function (Soa $s) {
            // If you stored file in 'public' disk, link it
            $attachment = '—';
            if ($s->attachment) {
                $url = asset('storage/' . ltrim($s->attachment, '/'));
                $attachment = '<a href="'.$url.'" target="_blank" rel="noopener">View</a>';
            }

            return [
                'id'            => $s->id,
                'number'        => $s->number,
                'soa_date'      => optional($s->soa_date)->toDateString(),
                'cover_period'  => $s->cover_period,
                'charge_slip'   => $s->charge_slip,
                'total_amount'  => number_format((float)$s->total_amount, 2, '.', ','), // "1,234.56"
                'attachment'    => $attachment, // HTML link
                'status'        => $s->status,
            ];
        });

        return response()->json([
            'draw'            => $draw,
            'recordsTotal'    => $recordsTotal,
            'recordsFiltered' => $recordsFiltered,
            'data'            => $rows,
        ]);
    }

    // Create
    public function store(Request $request)
    {
        $val = $request->validate([
            // IMPORTANT: table name is 'soa' (singular), not 'soas'
            'number'        => ['required','string','max:100','unique:soa,number'],
            'soa_date'      => ['required','date'],
            'cover_period'  => ['nullable','string','max:255'],
            'charge_slip'   => ['nullable','string','max:255'],

            // numeric but may arrive with commas; we'll normalize below
            'total_amount'  => ['required'],

            // file only; 5MB limit; allowed types
            'attachment'    => ['nullable','file','mimes:png,jpeg,jpg,pdf','max:5120'],

            'status'        => ['required','string','max:50'],

        ]);

        // normalize amount (strip commas)
        $val['total_amount'] = (float) str_replace(',', '', (string) $request->input('total_amount', 0));

        // store file if provided (public disk)
        if ($request->hasFile('attachment')) {
            $path = $request->file('attachment')->store('soa_attachments', 'public');
            $val['attachment'] = $path; // save path in DB
        }

        Soa::create($val);

        return back(303)->with('success', 'SOA created.');
    }

    // Update
    public function update(Request $request, Soa $soa)
    {
        $val = $request->validate([
            // unique for same table; ignore current row id
            'number'        => ['required','string','max:100','unique:soa,number,'.$soa->id],
            'soa_date'      => ['required','date'],
            'cover_period'  => ['nullable','string','max:255'],
            'charge_slip'   => ['nullable','string','max:255'],
            'total_amount'  => ['required'],
            'attachment'    => ['nullable','file','mimes:png,jpeg,jpg,pdf','max:5120'],
            'status'        => ['required','string','max:50'],
            'merchant'      => ['nullable','string','max:255'],
            'department'    => ['nullable','string','max:255'],
        ]);

        $val['total_amount'] = (float) str_replace(',', '', (string) $request->input('total_amount', 0));

        if ($request->hasFile('attachment')) {
            $path = $request->file('attachment')->store('soa_attachments', 'public');
            $val['attachment'] = $path;
        }

        $soa->update($val);

        return back(303)->with('success', 'SOA updated.');
    }

    public function destroy(Soa $soa)
    {
        $soa->delete();
        return back(303)->with('success', 'SOA deleted.');
    }

    public function archive(Soa $soa)
    {
        $soa->delete();                    // soft delete
        return back(303)->with('success', 'SOA archived successfully.');
    }

    public function archived()
    {
        $records = Soa::onlyTrashed()
            ->orderBy('deleted_at', 'desc')
            ->get(['id','number','soa_date','cover_period','charge_slip','total_amount','deleted_at']);

        return response()->json($records);
    }

    public function restore($id)
    {
        $soa = Soa::onlyTrashed()->findOrFail($id);
        $soa->restore();
        return back(303)->with('success', 'SOA restored successfully.');
    }
}
