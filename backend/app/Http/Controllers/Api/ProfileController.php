<?php
namespace App\Http\Controllers\Api;
use App\Http\Controllers\Controller;
use Illuminate\Http\Request;

class ProfileController extends Controller {
    public function show(Request $r) {
        return response()->json($r->user());
    }

    public function update(Request $r) {
        $data = $r->validate([
            'full_name'     => 'sometimes|string|max:255',
            'mobile_number' => 'sometimes|string|max:20',
            'address'       => 'sometimes|string',
        ]);
        $r->user()->update($data);
        return response()->json($r->user());
    }
}
