<?php
namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Order;
use App\Models\OrderItem;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;

class SellerOrderController extends Controller
{
    /**
     * List all orders that contain this seller's products.
     */
    public function index(Request $r)
    {
        $sellerId = $r->user()->id;
        $status   = $r->status;   // optional filter
        $search   = $r->search;   // optional order number search

        $orderIds = OrderItem::join('products', 'order_items.product_id', 'products.id')
            ->where('products.seller_id', $sellerId)
            ->pluck('order_items.order_id')
            ->unique();

        $query = Order::with(['items.product', 'user', 'transaction'])
            ->whereIn('id', $orderIds)
            ->latest();

        if ($status && $status !== 'all') {
            $query->where('status', $status);
        }
        if ($search) {
            $query->where('order_number', 'like', '%' . $search . '%');
        }

        return response()->json($query->paginate(15));
    }

    /**
     * Get a single order detail.
     */
    public function show(Request $r, $id)
    {
        $sellerId = $r->user()->id;

        // Verify this order has at least one item belonging to this seller
        $belongs = OrderItem::join('products', 'order_items.product_id', 'products.id')
            ->where('products.seller_id', $sellerId)
            ->where('order_items.order_id', $id)
            ->exists();

        if (!$belongs) {
            return response()->json(['message' => 'Order not found.'], 404);
        }

        $order = Order::with(['items.product', 'user', 'transaction'])->findOrFail($id);
        return response()->json($order);
    }

    /**
     * Update the status of an order.
     */
    public function updateStatus(Request $r, $id)
    {
        $r->validate([
            'status' => 'required|in:pending,confirmed,processing,shipped,delivered,cancelled',
            'note'   => 'nullable|string|max:500',
        ]);

        $sellerId = $r->user()->id;

        $belongs = OrderItem::join('products', 'order_items.product_id', 'products.id')
            ->where('products.seller_id', $sellerId)
            ->where('order_items.order_id', $id)
            ->exists();

        if (!$belongs) {
            return response()->json(['message' => 'Order not found.'], 404);
        }

        $order = Order::findOrFail($id);

        // Business rules: cannot un-cancel or un-deliver
        if ($order->status === 'cancelled') {
            return response()->json(['message' => 'Cannot update a cancelled order.'], 422);
        }
        if ($order->status === 'delivered' && $r->status !== 'cancelled') {
            return response()->json(['message' => 'Order already delivered.'], 422);
        }

        $order->update(['status' => $r->status]);

        // Auto-mark transaction as paid when delivered (COD)
        if ($r->status === 'delivered' && $order->payment_method === 'cod') {
            $order->transaction?->update(['status' => 'completed']);
            $order->update(['payment_status' => 'paid']);
        }

        // If cancelled, restore stock
        if ($r->status === 'cancelled') {
            foreach ($order->items as $item) {
                $item->product?->increment('stock', $item->quantity);
                $item->product?->decrement('sales_count', $item->quantity);
            }
        }

        return response()->json([
            'message' => 'Order status updated to ' . $r->status,
            'order'   => $order->fresh(['items.product', 'user', 'transaction']),
        ]);
    }
}
