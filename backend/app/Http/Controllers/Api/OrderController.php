<?php
namespace App\Http\Controllers\Api;
use App\Http\Controllers\Controller;
use App\Models\Order;
use App\Models\Cart;
use App\Models\Product;
use App\Models\Transaction;
use Illuminate\Http\Request;
use Illuminate\Support\Str;

class OrderController extends Controller {
    public function index(Request $r) {
        $orders = Order::with('items','transaction')
            ->where('user_id',$r->user()->id)
            ->latest()->paginate(10);
        return response()->json($orders);
    }

    public function show(Request $r, $id) {
        $order = Order::with('items.product','transaction')
            ->where('user_id',$r->user()->id)->findOrFail($id);
        return response()->json($order);
    }

    public function store(Request $r) {
        $r->validate([
            'payment_method'  => 'required|in:cod,gcash,paymaya',
            'delivery_method' => 'required|in:pickup,delivery',
            'delivery_address'=> 'required_if:delivery_method,delivery|string',
            'contact_number'  => 'required|string',
            'notes'           => 'nullable|string',
        ]);

        $cartItems = Cart::with('product')->where('user_id',$r->user()->id)->get();
        if ($cartItems->isEmpty()) return response()->json(['message'=>'Cart is empty'],422);

        $total = $cartItems->sum(fn($i)=>$i->product->price * $i->quantity);

        $order = Order::create([
            'order_number'   => 'CC-'.strtoupper(Str::random(8)),
            'user_id'        => $r->user()->id,
            'total_amount'   => $total,
            'payment_method' => $r->payment_method,
            'delivery_method'=> $r->delivery_method,
            'delivery_address'=> $r->delivery_address,
            'contact_number' => $r->contact_number,
            'notes'          => $r->notes,
        ]);

        foreach ($cartItems as $item) {
            $order->items()->create([
                'product_id'  => $item->product_id,
                'product_name'=> $item->product->name,
                'unit_price'  => $item->product->price,
                'quantity'    => $item->quantity,
                'subtotal'    => $item->product->price * $item->quantity,
            ]);
            $item->product->decrement('stock', $item->quantity);
            $item->product->increment('sales_count', $item->quantity);
        }

        Transaction::create([
            'order_id'       => $order->id,
            'reference_number'=> 'TXN-'.strtoupper(Str::random(10)),
            'amount'         => $total,
            'payment_method' => $r->payment_method,
            'status'         => $r->payment_method === 'cod' ? 'pending' : 'pending',
        ]);

        Cart::where('user_id',$r->user()->id)->delete();

        return response()->json($order->load('items','transaction'), 201);
    }
}
