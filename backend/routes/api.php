<?php

use Illuminate\Support\Facades\Route;
use App\Http\Controllers\Api\AuthController;
use App\Http\Controllers\Api\SellerAuthController;
use App\Http\Controllers\Api\ProductController;
use App\Http\Controllers\Api\CartController;
use App\Http\Controllers\Api\OrderController;
use App\Http\Controllers\Api\ProfileController;
use App\Http\Controllers\Api\SellerProductController;
use App\Http\Controllers\Api\SellerReportController;
use App\Http\Controllers\Api\SellerInventoryController;
use App\Http\Controllers\Api\SellerStorefrontController;
use App\Http\Controllers\Api\SellerOrderController;

/*
|--------------------------------------------------------------------------
| API Routes — CoirCraft PH
|--------------------------------------------------------------------------
*/

Route::prefix('v1')->group(function () {

    // ── PUBLIC AUTH ──────────────────────────────────────────────
    Route::prefix('auth')->group(function () {
        Route::post('register', [AuthController::class, 'register']);
        Route::post('login',    [AuthController::class, 'login']);
    });

    // ── SELLER AUTH ──────────────────────────────────────────────
    Route::prefix('seller')->group(function () {
        Route::post('login', [SellerAuthController::class, 'login']);
    });

    // ── PUBLIC PRODUCTS ──────────────────────────────────────────
    Route::prefix('products')->group(function () {
        Route::get('/',            [ProductController::class, 'index']);
        Route::get('/featured',    [ProductController::class, 'featured']);
        Route::get('/new',         [ProductController::class, 'newArrivals']);
        Route::get('/trending',    [ProductController::class, 'trending']);
        Route::get('/bestsellers', [ProductController::class, 'bestSellers']);
        Route::get('/{id}',        [ProductController::class, 'show']);
    });

    // ── BUYER PROTECTED ROUTES ───────────────────────────────────
    Route::middleware('auth:sanctum')->group(function () {

        Route::post('auth/logout', [AuthController::class, 'logout']);
        Route::get('auth/me',      [AuthController::class, 'me']);

        // Profile
        Route::get('profile', [ProfileController::class, 'show']);
        Route::put('profile', [ProfileController::class, 'update']);

        // Cart
        Route::get('cart',         [CartController::class, 'index']);
        Route::post('cart',        [CartController::class, 'store']);
        Route::put('cart/{id}',    [CartController::class, 'update']);
        Route::delete('cart/{id}', [CartController::class, 'destroy']);
        Route::delete('cart',      [CartController::class, 'clear']);

        // Orders / Checkout / History
        Route::get('orders',      [OrderController::class, 'index']);
        Route::post('orders',     [OrderController::class, 'store']);
        Route::get('orders/{id}', [OrderController::class, 'show']);
    });

    // ── SELLER PROTECTED ROUTES ──────────────────────────────────
    Route::middleware(['auth:sanctum', 'seller'])->prefix('seller')->group(function () {

        Route::post('logout', [SellerAuthController::class, 'logout']);
        Route::get('me',      [SellerAuthController::class, 'me']);

        // Storefront management
        Route::get('storefront', [SellerStorefrontController::class, 'index']);
        Route::put('storefront', [SellerStorefrontController::class, 'update']);

        // Products / Inventory
        Route::get('products',         [SellerProductController::class, 'index']);
        Route::post('products',        [SellerProductController::class, 'store']);
        Route::get('products/{id}',    [SellerProductController::class, 'show']);
        Route::post('products/{id}',   [SellerProductController::class, 'update']);
        Route::delete('products/{id}', [SellerProductController::class, 'destroy']);

        // Orders — list, detail, status update
        Route::get('orders',                  [SellerOrderController::class, 'index']);
        Route::get('orders/{id}',             [SellerOrderController::class, 'show']);
        Route::patch('orders/{id}/status',    [SellerOrderController::class, 'updateStatus']);

        // Sales Reports
        Route::get('reports/daily',    [SellerReportController::class, 'daily']);
        Route::get('reports/monthly',  [SellerReportController::class, 'monthly']);
        Route::get('reports/summary',  [SellerReportController::class, 'summary']);

        // Inventory report
        Route::get('inventory',           [SellerInventoryController::class, 'index']);
        Route::get('inventory/low-stock', [SellerInventoryController::class, 'lowStock']);
    });
});
