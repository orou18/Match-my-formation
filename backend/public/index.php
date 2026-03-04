<?php

/**
 * Force l'affichage des erreurs pour le debug Ubuntu
 * À retirer une fois que le problème est réglé
 */
error_reporting(E_ALL);
ini_set('display_errors', '1');

use Illuminate\Contracts\Http\Kernel;
use Illuminate\Http\Request;

define('LARAVEL_START', microtime(true));

/*
|--------------------------------------------------------------------------
| Check If The Application Is Under Maintenance
|--------------------------------------------------------------------------
*/
if (file_exists($maintenance = __DIR__.'/../storage/framework/maintenance.php')) {
    require $maintenance;
}

/*
|--------------------------------------------------------------------------
| Register The Auto Loader
|--------------------------------------------------------------------------
*/
require __DIR__.'/../vendor/autoload.php';

/*
|--------------------------------------------------------------------------
| Run The Application
|--------------------------------------------------------------------------
*/
$app = require_once __DIR__.'/../bootstrap/app.php';

$kernel = $app->make(Kernel::class);

$request = Request::capture();

try {
    $response = $kernel->handle($request);
    $response->send();
    $kernel->terminate($request, $response);
} catch (\Throwable $e) {
    // Si Laravel crash, on affiche l'erreur proprement au lieu de couper la connexion
    header('Content-Type: text/plain');
    echo "L'APPLICATION A CRASHÉ : \n";
    echo $e->getMessage() . "\n";
    echo "Fichier : " . $e->getFile() . " à la ligne " . $e->getLine();
    exit;
}
