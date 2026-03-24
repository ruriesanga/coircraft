<?php
use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration {
    public function up(): void {
        Schema::create('sellers', function (Blueprint $table) {
            $table->id();
            $table->string('store_name');
            $table->string('email')->unique();
            $table->string('password');
            $table->string('logo')->nullable();
            $table->text('description')->nullable();
            $table->string('banner_image')->nullable();
            $table->timestamps();
        });
    }
    public function down(): void { Schema::dropIfExists('sellers'); }
};
