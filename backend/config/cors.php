<?php
return [
    'paths'                    => ['api/*'],
    'allowed_methods'          => ['*'],
    'allowed_origins'          => [
        env('FRONTEND_BUYER_URL',  'http://localhost:5173'),
        env('FRONTEND_SELLER_URL', 'http://localhost:5174'),
    ],
    'allowed_origins_patterns' => [],
    'allowed_headers'          => ['*'],
    'exposed_headers'          => [],
    'max_age'                  => 0,
    'supports_credentials'     => false,
];
