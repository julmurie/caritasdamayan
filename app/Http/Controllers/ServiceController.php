<?php

namespace App\Http\Controllers;

use App\Models\Service;
use Illuminate\Http\Request;

class ServiceController extends Controller
{
    /** Create */
    public function store(Request $request)
    {
        $data = $request->validate([
            'name'            => ['required','string','max:255'],
            'standard_rate'   => ['nullable','numeric','min:0'],
            'discounted_rate' => ['nullable','numeric','min:0','lte:standard_rate'],
        ]);

        Service::create([
            'name'            => $data['name'],
            'standard_rate'   => $data['standard_rate']   ?? 0,
            'discounted_rate' => $data['discounted_rate'] ?? 0,
        ]);

        return back()->with('success', 'Service created.');
    }

    /** Update */
    public function update(Request $request, Service $service)
    {
        $data = $request->validate([
            'name'            => ['required','string','max:255'],
            'standard_rate'   => ['nullable','numeric','min:0'],
            'discounted_rate' => ['nullable','numeric','min:0','lte:standard_rate'],
        ]);

        $service->update([
            'name'            => $data['name'],
            'standard_rate'   => $data['standard_rate']   ?? 0,
            'discounted_rate' => $data['discounted_rate'] ?? 0,
        ]);

        return back()->with('success', 'Service updated.');
    }

    /** Archive (soft delete => sets archived_at) */
    public function archive(Request $request, Service $service)
    {
        $service->delete();
        return back()->with('success', 'Service archived.');
    }

    /** Restore (from archive) */
    public function restore(Request $request, int $id)
    {
        $service = Service::onlyTrashed()->findOrFail($id);
        $service->restore();

        return back()->with('success', 'Service restored.');
    }

    /** Archived list (JSON) */
    public function archived(Request $request)
    {
        $items = Service::onlyTrashed()
            ->orderByDesc(Service::DELETED_AT)
            ->get([
                'id',
                'name',
                'standard_rate',
                'discounted_rate',
                Service::DELETED_AT . ' as archived_at',
            ]);

        return response()->json($items);
    }

    /** DataTables server-side JSON */
    public function datatable(Request $request)
    {
        $draw   = (int) $request->input('draw', 1);
        $start  = (int) $request->input('start', 0);
        $length = (int) $request->input('length', 10);
        $search = $request->input('search.value', '');
        $order  = $request->input('order', []);

        $base = Service::query();

        $recordsTotal = (clone $base)->count();

        if ($search !== '') {
            $base->where('name', 'like', "%{$search}%");
        }

        $recordsFiltered = (clone $base)->count();

        $columns = ['id','name','standard_rate','discounted_rate'];
        if (!empty($order)) {
            foreach ($order as $o) {
                $idx = (int) ($o['column'] ?? 0);
                $dir = ($o['dir'] ?? 'asc') === 'desc' ? 'desc' : 'asc';
                if (isset($columns[$idx])) {
                    $base->orderBy($columns[$idx], $dir);
                }
            }
        }
        if (empty($order)) {
                $base->orderByDesc('id'); // ✅ moved outside
            }

        $data = $base->skip($start)->take($length)
            ->get(['id','name','standard_rate','discounted_rate'])
            ->map(fn ($s) => [
                'id'               => $s->id,
                'name'             => $s->name,
                'standard_rate'    => number_format($s->standard_rate, 2),
                'discounted_rate'  => number_format($s->discounted_rate, 2),
            ]);

        return response()->json([
            'draw'            => $draw,
            'recordsTotal'    => $recordsTotal,
            'recordsFiltered' => $recordsFiltered,
            'data'            => $data,
        ]);
    }
}
