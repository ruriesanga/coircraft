<?php
namespace App\Models;
use Illuminate\Database\Eloquent\Model;

class Order extends Model {
    protected $fillable = [
        'order_number','user_id','total_amount','status',
        'payment_method','payment_status','delivery_method',
        'delivery_address','contact_number','notes'
    ];
    protected $casts = ['total_amount'=>'float'];
    public function user()        { return $this->belongsTo(User::class); }
    public function items()       { return $this->hasMany(OrderItem::class); }
    public function transaction() { return $this->hasOne(Transaction::class); }
}
