<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\Hash;
use App\Models\User;
use App\Models\Seller;
use App\Models\Category;
use App\Models\Product;

class DatabaseSeeder extends Seeder
{
    public function run(): void
    {
        // ── Buyer user ──────────────────────────────────────────
        User::create([
            'full_name'     => 'Juan dela Cruz',
            'email'         => 'buyer@coircraft.ph',
            'password'      => Hash::make('password'),
            'mobile_number' => '09171234567',
            'address'       => '123 Sampaguita St., Quezon City, Metro Manila',
        ]);

        // ── Seller account ──────────────────────────────────────
        $seller = Seller::create([
            'store_name'  => 'CoirCraft PH',
            'email'       => 'seller@coircraft.ph',
            'password'    => Hash::make('password'),
            'description' => 'Handcrafted coconut coir products from the heart of the Philippines.',
        ]);

        // ── Categories ──────────────────────────────────────────
        $categories = [
            ['name' => 'Mats & Rugs',     'slug' => 'mats-rugs'],
            ['name' => 'Baskets',          'slug' => 'baskets'],
            ['name' => 'Garden & Planters','slug' => 'garden-planters'],
            ['name' => 'Home Decor',       'slug' => 'home-decor'],
            ['name' => 'Storage',          'slug' => 'storage'],
        ];
        foreach ($categories as $cat) {
            Category::create($cat);
        }

        // ── Products ─────────────────────────────────────────────
        $products = [
            [
                'name'         => 'Coir Doormat — Classic Weave',
                'slug'         => 'coir-doormat-classic-weave',
                'description'  => 'Thick-woven natural coir fiber doormat with traditional Filipino weave pattern. Perfect for home entrances.',
                'price'        => 450.00,
                'stock'        => 50,
                'category_id'  => 1,
                'is_featured'  => true,
                'is_bestseller'=> true,
                'sales_count'  => 142,
            ],
            [
                'name'         => 'Coir Garden Pot — Round',
                'slug'         => 'coir-garden-pot-round',
                'description'  => 'Breathable coir planter ideal for orchids, herbs, and tropical plants. Available in 3 sizes.',
                'price'        => 220.00,
                'stock'        => 80,
                'category_id'  => 3,
                'is_featured'  => true,
                'is_trending'  => true,
                'sales_count'  => 98,
            ],
            [
                'name'         => 'Woven Coir Basket — Medium',
                'slug'         => 'woven-coir-basket-medium',
                'description'  => 'Hand-braided storage basket great for market trips or decorative use. Sturdy and eco-friendly.',
                'price'        => 340.00,
                'stock'        => 35,
                'category_id'  => 2,
                'is_featured'  => true,
                'is_trending'  => true,
                'sales_count'  => 76,
            ],
            [
                'name'         => 'Coir Wall Art — Baybayin',
                'slug'         => 'coir-wall-art-baybayin',
                'description'  => 'Decorative wall hanging inspired by baybayin script and local Philippine motifs. Unique artisan piece.',
                'price'        => 680.00,
                'stock'        => 20,
                'category_id'  => 4,
                'is_featured'  => true,
                'sales_count'  => 34,
            ],
            [
                'name'         => 'Coir Table Runner',
                'slug'         => 'coir-table-runner',
                'description'  => 'Natural coir table runner with woven geometric pattern. Adds a rustic Filipino touch to any dining table.',
                'price'        => 290.00,
                'stock'        => 45,
                'category_id'  => 4,
                'is_trending'  => true,
                'sales_count'  => 55,
            ],
            [
                'name'         => 'Coir Storage Box — Large',
                'slug'         => 'coir-storage-box-large',
                'description'  => 'Spacious woven coir storage box with a lid. Great for living room organization.',
                'price'        => 780.00,
                'stock'        => 25,
                'category_id'  => 5,
                'sales_count'  => 22,
            ],
            [
                'name'         => 'Coir Hanging Planter Set',
                'slug'         => 'coir-hanging-planter-set',
                'description'  => 'Set of 3 coir hanging planters. Lightweight and perfect for balcony gardens.',
                'price'        => 550.00,
                'stock'        => 30,
                'category_id'  => 3,
                'is_bestseller'=> true,
                'sales_count'  => 88,
            ],
            [
                'name'         => 'Coir Bath Mat',
                'slug'         => 'coir-bath-mat',
                'description'  => 'Natural exfoliating coir bath mat. Anti-slip backing, quick-drying and eco-friendly.',
                'price'        => 380.00,
                'stock'        => 60,
                'category_id'  => 1,
                'is_bestseller'=> true,
                'sales_count'  => 110,
            ],
        ];

        foreach ($products as $p) {
            Product::create(array_merge($p, ['seller_id' => $seller->id]));
        }
    }
}
