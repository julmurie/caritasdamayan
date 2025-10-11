<?php

namespace App\Http\Controllers;

use App\Models\Product;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Inertia\Inertia;

class ProductController extends Controller
{
    /**
     * Shared Prices page.
     * - Admin & Volunteer: view-only
     * - Merchant: can manage (add/edit/archive/restore)
     */
    public function index(Request $request)
    {
        $role      = Auth::user()?->role ?? '';
        $canManage = $role === 'merchant';

        return Inertia::render('PartnerMerchant/Prices', [
            'merchant'    => 'Generika',
            'permissions' => ['canManage' => $canManage],
            'endpoints'   => [
                'productsDatatable' => route('products.datatable'),
                'servicesDatatable' => route('services.datatable'),
                'productsArchived'  => route('products.archived.index'),
            ],
        ]);
    }

    /** Create (merchant only) */
    public function store(Request $request)
    {
        $this->authorizeManage();

        // Bridge: accept legacy 'name' payloads for now
        $payload = $request->all();
        $payload['generic_name'] = $payload['generic_name'] ?? $payload['name'] ?? null;

        $data = validator($payload, [
            'generic_name'     => ['required','string','min:2','max:100'],
            'brand_name'       => ['nullable','string','max:100'],
            'standard_price'   => ['nullable','numeric','min:0'],
            'discounted_price' => ['nullable','numeric','min:0','lte:standard_price'],
        ])->validate();

        Product::create([
            'generic_name'     => $data['generic_name'],
            'brand_name'       => $data['brand_name']       ?? null,
            'standard_price'   => $data['standard_price']   ?? 0,
            'discounted_price' => $data['discounted_price'] ?? 0,
        ]);

        return back()->with('success', 'Product created.');
    }

    /** Update (merchant only) */
    public function update(Request $request, Product $product)
    {
        $this->authorizeManage();

        $payload = $request->all();
        $payload['generic_name'] = $payload['generic_name'] ?? $payload['name'] ?? null;

        $data = validator($payload, [
            'generic_name'     => ['required','string','min:2','max:100'],
            'brand_name'       => ['nullable','string','max:100'],
            'standard_price'   => ['nullable','numeric','min:0'],
            'discounted_price' => ['nullable','numeric','min:0','lte:standard_price'],
        ])->validate();

        $product->update([
            'generic_name'     => $data['generic_name'],
            'brand_name'       => $data['brand_name']       ?? null,
            'standard_price'   => $data['standard_price']   ?? 0,
            'discounted_price' => $data['discounted_price'] ?? 0,
        ]);

        return back()->with('success', 'Product updated.');
    }

    /** Archive (soft delete) (merchant only) */
    public function archive(Request $request, Product $product)
    {
        $this->authorizeManage();

        $product->delete();
        return back()->with('success', 'Product archived.');
    }

    /** Restore (merchant only) */
    public function restore(Request $request, int $id)
    {
        $this->authorizeManage();

        $product = Product::onlyTrashed()->findOrFail($id);
        $product->restore();

        return back()->with('success', 'Product restored.');
    }

    /** Archived list for modal (JSON) — merchants only */
    public function archived(Request $request)
    {
        $items = Product::onlyTrashed()
            ->orderByDesc(Product::DELETED_AT)
            ->get([
                'id',
                'generic_name',
                'brand_name',
                'standard_price',
                'discounted_price',
                Product::DELETED_AT . ' as archived_at',
            ]);

        return response()->json($items);
    }

    /** DataTables server-side JSON (active items; all roles) */
    public function datatable(Request $request)
    {
        $draw   = (int) $request->input('draw', 1);
        $start  = (int) $request->input('start', 0);
        $length = (int) $request->input('length', 10);
        $search = $request->input('search.value', '');
        $order  = $request->input('order', []);

        $base = Product::query(); // SoftDeletes hides archived automatically
        $recordsTotal = (clone $base)->count();

        if ($search !== '') {
            $base->where(function ($q) use ($search) {
                $q->where('generic_name', 'like', "%{$search}%")
                  ->orWhere('brand_name', 'like', "%{$search}%");
            });
        }

        $recordsFiltered = (clone $base)->count();

        // Column order MUST match your DataTables columns in Prices.jsx
        $columns = ['id','generic_name','brand_name','standard_price','discounted_price'];

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


        $rows = $base->skip($start)->take($length)
            ->get(['id','generic_name','brand_name','standard_price','discounted_price']);

        $data = $rows->map(fn ($p) => [
            'id'               => $p->id,
            'generic_name'     => $p->generic_name,
            'brand_name'       => $p->brand_name,
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

    /** Guard mutating endpoints to merchants only */
    private function authorizeManage(): void
    {
        if (Auth::user()?->role !== 'merchant') {
            abort(403, 'Only partner merchants can modify prices.');
        }
    }
}
