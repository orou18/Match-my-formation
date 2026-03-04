<?php

return [

    /*
    |--------------------------------------------------------------------------
    | Cross-Origin Resource Sharing (CORS) Configuration
    |--------------------------------------------------------------------------
    */

    'paths' => ['api/*', 'sanctum/csrf-cookie'],

    'allowed_methods' => ['*'],

    // Utilisation de l'URL du .env en priorité, avec repli sur localhost
    'allowed_origins' => [
        'http://localhost:3000',
        'http://localhost:3000',
        trim(env('FRONTEND_URL', 'http://localhost:3000'), '/'),
    ],

    'allowed_origins_patterns' => [],

    // On autorise tous les headers, ce qui inclut 'Authorization' et 'Content-Type'
    'allowed_headers' => ['*'],

    'exposed_headers' => [],

    'max_age' => 0,

    // OBLIGATOIRE à true pour que Sanctum et NextAuth partagent les cookies/sessions
    'supports_credentials' => true,

];
