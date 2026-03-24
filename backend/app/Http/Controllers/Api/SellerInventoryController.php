<?php
namespace App\Http\Controllers\Api;
use App\Http\Controllers\Controller;
use App\Models\Product;
use Illuminate\Http\Request;

class SellerInventoryController extends Controller {
    public function index(Request $r) {
        $products = Product::with('category')
            ->where('seller_id',$r->user()->id)
            ->orderBy('stock')
            ->paginate(20);
        return response()->json($products);
    }

    public function lowStock(Request $r) {
        $threshold = $r->threshold ?? 10;
        $products  = Product::where('seller_id',$r->user()->id)
            ->where('stock','<=',$threshold)
            ->where('is_active',true)->get();
        return response()->json($products);
    }
}
