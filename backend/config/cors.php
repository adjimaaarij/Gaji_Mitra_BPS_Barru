<?php

return [
    'paths' => ['api/*', 'sanctum/csrf-cookie'],
    'allowed_methods' => ['*'],
    'allowed_origins' => [
        'http://localhost:5173',   // frontend lokal vite
        'https://barru.stat7300.net', // domain di server
        'http://127.0.0.1:8000', // backend lokal
        'https://barru.stat7300.net/Manajamen_gaji_mitra/Frontend/dist', // domain di server dengan subfolder Frontend
    ],
    'allowed_origins_patterns' => [],
    'allowed_headers' => ['*'],
    'exposed_headers' => ['*'],
    'max_age' => 0,
    'supports_credentials' => true,
];

