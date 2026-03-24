<?php
namespace App\Models;
use Illuminate\Database\Eloquent\Model;

class Transaction extends Model {
    protected $fillable = ['order_id','reference_number','amount','payment_method','status','gateway_response'];
    protected $casts    = ['amount'=>'float','gateway_response'=>'array'];
    public function order() { return $this->belongsTo(Order::class); }
}
