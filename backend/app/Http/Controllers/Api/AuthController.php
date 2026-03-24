<?php
namespace App\Http\Controllers\Api;
use App\Http\Controllers\Controller;
use App\Models\User;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Hash;
use Illuminate\Validation\ValidationException;

class AuthController extends Controller {
    public function register(Request $r) {
        $data = $r->validate([
            'full_name'     => 'required|string|max:255',
            'email'         => 'required|email|unique:users',
            'password'      => 'required|string|min:8|confirmed',
            'mobile_number' => 'required|string|max:20',
            'address'       => 'required|string',
        ]);
        $user  = User::create([...$data, 'password' => Hash::make($data['password'])]);
        $token = $user->createToken('buyer-token')->plainTextToken;
        return response()->json(['user'=>$user,'token'=>$token], 201);
    }

    public function login(Request $r) {
        $r->validate(['email'=>'required|email','password'=>'required']);
        $user = User::where('email',$r->email)->first();
        if (!$user || !Hash::check($r->password, $user->password)) {
            throw ValidationException::withMessages(['email'=>['Invalid credentials.']]);
        }
        $token = $user->createToken('buyer-token')->plainTextToken;
        return response()->json(['user'=>$user,'token'=>$token]);
    }

    public function logout(Request $r) {
        $r->user()->currentAccessToken()->delete();
        return response()->json(['message'=>'Logged out']);
    }

    public function me(Request $r) {
        return response()->json($r->user());
    }
}
