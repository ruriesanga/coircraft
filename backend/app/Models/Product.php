<?php
namespace App\Models;
use Illuminate\Database\Eloquent\Model;

class Product extends Model {
    protected $fillable = [
        'seller_id','category_id','name','slug','description',
        'price','stock','image','is_featured','is_trending',
        'is_bestseller','is_active','sales_count'
    ];

    protected $casts = [
        'is_featured'  => 'boolean',
        'is_trending'  => 'boolean',
        'is_bestseller'=> 'boolean',
        'is_active'    => 'boolean',
        'price'        => 'float',
    ];

    // ← THIS is what was missing — tells Laravel to include image_url in JSON
    protected $appends = ['image_url'];

    public function seller()    { return $this->belongsTo(Seller::class); }
    public function category()  { return $this->belongsTo(Category::class); }
    public function orderItems(){ return $this->hasMany(OrderItem::class); }

    public function getImageUrlAttribute(): ?string {
        if (!$this->image) return null;
        // Use url() instead of asset() — works correctly with Apache/XAMPP
        return url('storage/' . $this->image);
    }
}