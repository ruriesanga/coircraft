<?php
namespace App\Http\Controllers\Api;
use App\Http\Controllers\Controller;
use App\Models\Product;
use Illuminate\Http\Request;

class SellerStorefrontController extends Controller {
    public function index(Request $r) {
        $seller = $r->user();
        $featured = Product::where('seller_id',$r->user()->id)->where('is_featured',true)->with('category')->get();
        return response()->json(['seller'=>$seller,'featured_products'=>$featured]);
    }

    public function update(Request $r) {
        $data = $r->validate([
            'store_name'    => 'sometimes|string|max:255',
            'description'   => 'nullable|string',
            'featured_ids'  => 'nullable|array',
            'featured_ids.*'=> 'exists:products,id',
        ]);
        $seller = $r->user();
        if (isset($data['store_name']) || isset($data['description'])) {
            $seller->update(array_filter(['store_name'=>$data['store_name']??null,'description'=>$data['description']??null]));
        }
        if (isset($data['featured_ids'])) {
            Product::where('seller_id',$seller->id)->update(['is_featured'=>false]);
            Product::whereIn('id',$data['featured_ids'])->where('seller_id',$seller->id)->update(['is_featured'=>true]);
        }
        return response()->json(['message'=>'Storefront updated','seller'=>$seller]);
    }
}
