<?php
namespace App\Http\Controllers\Api;
use App\Http\Controllers\Controller;
use App\Models\Seller;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Hash;
use Illuminate\Validation\ValidationException;

class SellerAuthController extends Controller {
    public function login(Request $r) {
        $r->validate(['email'=>'required|email','password'=>'required']);
        $seller = Seller::where('email',$r->email)->first();
        if (!$seller || !Hash::check($r->password, $seller->password)) {
            throw ValidationException::withMessages(['email'=>['Invalid credentials.']]);
        }
        $token = $seller->createToken('seller-token',['role:seller'])->plainTextToken;
        return response()->json(['seller'=>$seller,'token'=>$token]);
    }

    public function logout(Request $r) {
        $r->user()->currentAccessToken()->delete();
        return response()->json(['message'=>'Logged out']);
    }

    public function me(Request $r) {
        return response()->json($r->user());
    }
}
