<?php

return [
    'paths' => ['api/*', 'sanctum/csrf-cookie', 'login', 'register', 'logout'],
    'allowed_methods' => ['*'],
    'allowed_origins' => [
        // Développement local
        'http://localhost:3000',
        'http://127.0.0.1:3000',
        // Production Vercel
        'https://match-my-formation.vercel.app',
        // Fallback pour sous-domaines Vercel
        'https://*.vercel.app',
    ],
    'allowed_origins_patterns' => [
        '#^https?://localhost(:\\d+)?$#',
        '#^https?://127\\.0\\.0\\.1(:\\d+)?$#',
        '#^https?://.*\\.vercel\\.app$#',
    ],
    'allowed_headers' => ['*'],
    'exposed_headers' => [],
    'max_age' => 86400,
    'supports_credentials' => true, // Indispensable pour Sanctum et NextAuth
];
