<?php

return [
    'paths' => ['api/*', 'sanctum/csrf-cookie', 'login', 'register', 'logout'],
    'allowed_methods' => ['*'],
    'allowed_origins' => [
        // Domaine principal o2switch
        'https://matchmyformation-e-learning.com.matchmyformation.com',
        'https://www.matchmyformation-e-learning.com.matchmyformation.com',
        
        // Frontend Vercel (à ajouter une fois déployé)
        'https://votre-domaine-vercel.vercel.app',
        'https://match-my-formation.vercel.app',
        
        // Pour le développement local
        'http://localhost:3000',
        'http://localhost:3001',
        'http://127.0.0.1:3000',
    ],
    'allowed_origins_patterns' => [
        // Autoriser tous les sous-domaines du domaine principal
        'https://*.matchmyformation.com',
        
        // Autoriser tous les sous-domaines Vercel
        'https://*.vercel.app',
    ],
    'allowed_headers' => ['*'],
    'exposed_headers' => [
        'Authorization',
        'Content-Length',
        'Content-Type',
        'X-CSRF-TOKEN',
        'X-Sanctum-CSRF-Token',
    ],
    'max_age' => 0,
    'supports_credentials' => true, // Indispensable pour Sanctum et NextAuth
];
