<?php
namespace App\Models;
use Illuminate\Foundation\Auth\User as Authenticatable;
use Laravel\Sanctum\HasApiTokens;

class User extends Authenticatable {
    use HasApiTokens;
    protected $fillable = ['full_name','email','password','mobile_number','address','avatar'];
    protected $hidden   = ['password','remember_token'];
    protected $casts    = ['password' => 'hashed'];
}
