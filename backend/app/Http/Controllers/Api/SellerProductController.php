<?php
namespace App\Http\Controllers\Api;
use App\Http\Controllers\Controller;
use App\Models\Product;
use Illuminate\Http\Request;
use Illuminate\Support\Str;

class SellerProductController extends Controller {
    public function index(Request $r) {
        return response()->json(
            Product::with('category')->where('seller_id',$r->user()->id)->latest()->paginate(15)
        );
    }

    public function show(Request $r, $id) {
        return response()->json(Product::where('seller_id',$r->user()->id)->findOrFail($id));
    }

    public function store(Request $r) {
        $data = $r->validate([
            'name'         => 'required|string|max:255',
            'description'  => 'nullable|string',
            'price'        => 'required|numeric|min:0',
            'stock'        => 'required|integer|min:0',
            'category_id'  => 'nullable|exists:categories,id',
            'image'        => 'nullable|image|max:2048',
            'is_featured'  => 'boolean',
            'is_trending'  => 'boolean',
            'is_bestseller'=> 'boolean',
            'is_active'    => 'boolean',
        ]);
        $data['seller_id'] = $r->user()->id;
        $data['slug']      = Str::slug($data['name']).'-'.Str::random(5);
        if ($r->hasFile('image')) {
            $data['image'] = $r->file('image')->store('products','public');
        }
        return response()->json(Product::create($data)->load('category'), 201);
    }

    public function update(Request $r, $id) {
        $product = Product::where('seller_id',$r->user()->id)->findOrFail($id);
        $data = $r->validate([
            'name'         => 'sometimes|string|max:255',
            'description'  => 'nullable|string',
            'price'        => 'sometimes|numeric|min:0',
            'stock'        => 'sometimes|integer|min:0',
            'category_id'  => 'nullable|exists:categories,id',
            'image'        => 'nullable|image|max:2048',
            'is_featured'  => 'boolean',
            'is_trending'  => 'boolean',
            'is_bestseller'=> 'boolean',
            'is_active'    => 'boolean',
        ]);
        if ($r->hasFile('image')) {
            $data['image'] = $r->file('image')->store('products','public');
        }
        $product->update($data);
        return response()->json($product->load('category'));
    }

    public function destroy(Request $r, $id) {
        Product::where('seller_id',$r->user()->id)->findOrFail($id)->delete();
        return response()->json(['message'=>'Product deleted']);
    }
}
