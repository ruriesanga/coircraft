<?php
namespace App\Models;
use Illuminate\Foundation\Auth\User as Authenticatable;
use Laravel\Sanctum\HasApiTokens;

class Seller extends Authenticatable {
    use HasApiTokens;
    protected $fillable = ['store_name','email','password','logo','description','banner_image'];
    protected $hidden   = ['password'];
    protected $casts    = ['password' => 'hashed'];
    public function products() { return $this->hasMany(Product::class); }
}
