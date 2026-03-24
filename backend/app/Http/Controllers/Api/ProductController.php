<?php
namespace App\Http\Controllers\Api;
use App\Http\Controllers\Controller;
use App\Models\Product;
use Illuminate\Http\Request;

class ProductController extends Controller {
    public function index(Request $r) {
        $q = Product::with('category')->where('is_active',true);
        if ($r->search) $q->where('name','like','%'.$r->search.'%');
        if ($r->category) $q->whereHas('category',fn($c)=>$c->where('slug',$r->category));
        if ($r->min_price) $q->where('price','>=',$r->min_price);
        if ($r->max_price) $q->where('price','<=',$r->max_price);
        $sort = $r->sort ?? 'created_at';
        $q->orderBy($sort, $r->order ?? 'desc');
        return response()->json($q->paginate(12));
    }

    public function show($id) {
        $p = Product::with('category','seller')->findOrFail($id);
        return response()->json($p);
    }

    public function featured() {
        return response()->json(Product::where('is_featured',true)->where('is_active',true)->with('category')->take(8)->get());
    }

    public function newArrivals() {
        return response()->json(Product::where('is_active',true)->with('category')->latest()->take(8)->get());
    }

    public function trending() {
        return response()->json(Product::where('is_trending',true)->where('is_active',true)->with('category')->take(8)->get());
    }

    public function bestSellers() {
        return response()->json(Product::where('is_bestseller',true)->where('is_active',true)->with('category')->orderByDesc('sales_count')->take(8)->get());
    }
}
