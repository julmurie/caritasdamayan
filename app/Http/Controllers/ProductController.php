<?php

namespace App\Http\Controllers;

use App\Models\Product;
use Illuminate\Http\Request;
use Inertia\Inertia;

class ProductController extends Controller
{
    /** Inertia page with active (non‑archived) products */
    public function index(Request $request)
    {
        // SoftDeletes automatically excludes archived rows.
        $products = Product::query()
            ->orderBy('name')
            ->get(['id','name','standard_price','discounted_price']);

        return Inertia::render('PartnerMerchant/Prices', [
            'merchant' => 'Generika',
            'products' => $products,
        ]);
    }

    /** Create */
    public function store(Request $request)
    {
        $data = $request->validate([
            'name'             => ['required','string','max:255'],
            'standard_price'   => ['nullable','numeric','min:0'],
            'discounted_price' => ['nullable','numeric','min:0','lte:standard_price'],
        ]);

        Product::create([
            'name'             => $data['name'],
            'standard_price'   => $data['standard_price']   ?? 0,
            'discounted_price' => $data['discounted_price'] ?? 0,
        ]);

        return back()->with('success', 'Product created.');
    }

    /** Update */
    public function update(Request $request, Product $product)
    {
        $data = $request->validate([
            'name'             => ['required','string','max:255'],
            'standard_price'   => ['nullable','numeric','min:0'],
            'discounted_price' => ['nullable','numeric','min:0','lte:standard_price'],
        ]);

        $product->update([
            'name'             => $data['name'],
            'standard_price'   => $data['standard_price']   ?? 0,
            'discounted_price' => $data['discounted_price'] ?? 0,
        ]);

        return back()->with('success', 'Product updated.');
    }

    /** Archive (soft delete => sets archived_at) */
    public function archive(Request $request, Product $product)
    {
        $product->delete();
        return back()->with('success', 'Product archived.');
    }

    /** Restore (from archive) */
    public function restore(Request $request, int $id)
    {
        $product = Product::onlyTrashed()->findOrFail($id);
        $product->restore();

        return back()->with('success', 'Product restored.');
    }

    /** Archived list for your modal (JSON) */
    public function archived(Request $request)
    {
        $items = Product::onlyTrashed()
            ->orderByDesc(Product::DELETED_AT) // uses 'archived_at' from your model
            ->get([
                'id',
                'name',
                'standard_price',
                'discounted_price',
                Product::DELETED_AT . ' as archived_at', // expose as archived_at in JSON
            ]);

        return response()->json($items);
    }

    /** DataTables server-side JSON (active items only via SoftDeletes) */
    public function datatable(Request $request)
    {
        $draw   = (int) $request->input('draw', 1);
        $start  = (int) $request->input('start', 0);
        $length = (int) $request->input('length', 10);
        $search = $request->input('search.value', '');
        $order  = $request->input('order', []);

        // No whereNull('deleted_at') needed; SoftDeletes handles it.
        $base = Product::query();

        $recordsTotal = (clone $base)->count();

        if ($search !== '') {
            $base->where('name', 'like', "%{$search}%");
        }

        $recordsFiltered = (clone $base)->count();

        $columns = ['name','standard_price','discounted_price'];
        if (!empty($order)) {
            foreach ($order as $o) {
                $idx = (int) ($o['column'] ?? 0);
                $dir = ($o['dir'] ?? 'asc') === 'desc' ? 'desc' : 'asc';
                if (isset($columns[$idx])) {
                    $base->orderBy($columns[$idx], $dir);
                }
            }
        } else {
            $base->orderBy('name');
        }

        $data = $base->skip($start)->take($length)
            ->get(['id','name','standard_price','discounted_price'])
            ->map(fn ($p) => [
                'id'               => $p->id,
                'name'             => $p->name,
                'standard_price'   => number_format($p->standard_price, 2),
                'discounted_price' => number_format($p->discounted_price, 2),
            ]);

        return response()->json([
            'draw'            => $draw,
            'recordsTotal'    => $recordsTotal,
            'recordsFiltered' => $recordsFiltered,
            'data'            => $data,
        ]);
    }
}
