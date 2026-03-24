<?php
namespace App\Http\Controllers\Api;
use App\Http\Controllers\Controller;
use App\Models\Cart;
use App\Models\Product;
use Illuminate\Http\Request;

class CartController extends Controller {
    public function index(Request $r) {
        $items = Cart::with('product')->where('user_id',$r->user()->id)->get();
        $total = $items->sum(fn($i)=>$i->product->price * $i->quantity);
        return response()->json(['items'=>$items,'total'=>$total]);
    }

    public function store(Request $r) {
        $r->validate(['product_id'=>'required|exists:products,id','quantity'=>'required|integer|min:1']);
        $product = Product::findOrFail($r->product_id);
        if ($product->stock < $r->quantity) return response()->json(['message'=>'Insufficient stock'],422);
        $cart = Cart::updateOrCreate(
            ['user_id'=>$r->user()->id,'product_id'=>$r->product_id],
            ['quantity'=>$r->quantity]
        );
        return response()->json($cart->load('product'), 201);
    }

    public function update(Request $r, $id) {
        $r->validate(['quantity'=>'required|integer|min:1']);
        $cart = Cart::where('user_id',$r->user()->id)->findOrFail($id);
        $cart->update(['quantity'=>$r->quantity]);
        return response()->json($cart->load('product'));
    }

    public function destroy(Request $r, $id) {
        Cart::where('user_id',$r->user()->id)->findOrFail($id)->delete();
        return response()->json(['message'=>'Removed']);
    }

    public function clear(Request $r) {
        Cart::where('user_id',$r->user()->id)->delete();
        return response()->json(['message'=>'Cart cleared']);
    }
}
