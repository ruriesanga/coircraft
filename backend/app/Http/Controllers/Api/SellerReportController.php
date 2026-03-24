<?php
namespace App\Http\Controllers\Api;
use App\Http\Controllers\Controller;
use App\Models\Order;
use App\Models\OrderItem;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;

class SellerReportController extends Controller {
    public function daily(Request $r) {
        $sellerId = $r->user()->id;
        $date     = $r->date ?? today()->toDateString();
        $sales    = DB::table('order_items')
            ->join('products','order_items.product_id','products.id')
            ->join('orders','order_items.order_id','orders.id')
            ->where('products.seller_id', $sellerId)
            ->whereDate('orders.created_at', $date)
            ->whereNotIn('orders.status',['cancelled'])
            ->select(
                DB::raw('SUM(order_items.subtotal) as total_sales'),
                DB::raw('COUNT(DISTINCT orders.id) as order_count'),
                DB::raw('SUM(order_items.quantity) as items_sold')
            )->first();
        return response()->json(['date'=>$date,'report'=>$sales]);
    }

    public function monthly(Request $r) {
        $sellerId = $r->user()->id;
        $year     = $r->year  ?? now()->year;
        $month    = $r->month ?? now()->month;
        $daily    = DB::table('order_items')
            ->join('products','order_items.product_id','products.id')
            ->join('orders','order_items.order_id','orders.id')
            ->where('products.seller_id', $sellerId)
            ->whereYear('orders.created_at', $year)
            ->whereMonth('orders.created_at', $month)
            ->whereNotIn('orders.status',['cancelled'])
            ->select(
                DB::raw('DAY(orders.created_at) as day'),
                DB::raw('SUM(order_items.subtotal) as total_sales'),
                DB::raw('COUNT(DISTINCT orders.id) as order_count')
            )
            ->groupBy(DB::raw('DAY(orders.created_at)'))
            ->orderBy('day')->get();
        $totals = DB::table('order_items')
            ->join('products','order_items.product_id','products.id')
            ->join('orders','order_items.order_id','orders.id')
            ->where('products.seller_id', $sellerId)
            ->whereYear('orders.created_at', $year)
            ->whereMonth('orders.created_at', $month)
            ->whereNotIn('orders.status',['cancelled'])
            ->select(
                DB::raw('SUM(order_items.subtotal) as total_sales'),
                DB::raw('COUNT(DISTINCT orders.id) as order_count'),
                DB::raw('SUM(order_items.quantity) as items_sold')
            )->first();
        return response()->json(['year'=>$year,'month'=>$month,'daily'=>$daily,'totals'=>$totals]);
    }

    public function summary(Request $r) {
        $sellerId = $r->user()->id;
        $topProducts = DB::table('order_items')
            ->join('products','order_items.product_id','products.id')
            ->join('orders','order_items.order_id','orders.id')
            ->where('products.seller_id', $sellerId)
            ->whereNotIn('orders.status',['cancelled'])
            ->select('products.name',DB::raw('SUM(order_items.quantity) as qty_sold'),DB::raw('SUM(order_items.subtotal) as revenue'))
            ->groupBy('products.id','products.name')
            ->orderByDesc('qty_sold')->limit(5)->get();
        return response()->json(['top_products'=>$topProducts]);
    }
}
