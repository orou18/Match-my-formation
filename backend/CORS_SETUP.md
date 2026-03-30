# Étapes pour configurer CORS dans Laravel

## 1. Installer le package CORS
```bash
cd /home/kisoumare/Match-my-formation/backend
composer require fruitcake/laravel-cors
```

## 2. Publier la configuration
```bash
php artisan vendor:publish --tag="cors"
```

## 3. Configurer config/cors.php
```php
<?php

return [
    'paths' => ['api/*', 'sanctum/csrf-cookie'],

    'allowed_methods' => ['*'],

    'allowed_origins' => [
        'http://localhost:3001',
        'http://localhost:3000',
        'http://127.0.0.1:3001',
        'http://127.0.0.1:3000',
    ],

    'allowed_origins_patterns' => [],

    'allowed_headers' => ['*'],

    'exposed_headers' => [],

    'max_age' => 0,

    'supports_credentials' => true,
];
```

## 4. Appliquer le middleware dans app/Http/Kernel.php
```php
protected $middleware = [
    // ... autres middleware
    \Fruitcake\Cors\HandleCors::class,
];
```

## 5. Alternative: Configuration rapide dans bootstrap/app.php (pour Laravel 11)
```php
<?php

use Illuminate\Http\Request;

define('LARAVEL_START', microtime(true));

// Configuration CORS rapide
if (env('APP_ENV') === 'local') {
    header('Access-Control-Allow-Origin: http://localhost:3001');
    header('Access-Control-Allow-Methods: GET, POST, PUT, DELETE, OPTIONS');
    header('Access-Control-Allow-Headers: Content-Type, Authorization, X-Requested-With, Accept, Origin');
    header('Access-Control-Allow-Credentials: true');
    
    if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
        http_response_code(200);
        exit();
    }
}

// ... reste du fichier bootstrap/app.php
