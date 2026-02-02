<?php

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;
use App\Http\Controllers\Auth\AuthController;
use App\Http\Controllers\Course\CourseController;
use App\Http\Controllers\Course\ModuleController;
use App\Http\Controllers\Course\VideoController;
use App\Http\Controllers\Pathway\PathwayController;
use App\Http\Controllers\Company\CompanyController;

/*
|--------------------------------------------------------------------------
| API Routes
|--------------------------------------------------------------------------
*/

// --- Routes Publiques ---
Route::post('/login', [AuthController::class, 'login']);
Route::post('/register', [AuthController::class, 'register']);

// --- Routes Protégées (Sanctum) ---
Route::middleware('auth:sanctum')->group(function () {

    // Informations de l'utilisateur connecté
    Route::get('/me', fn(Request $r) => $r->user());

    // Déconnexion
    Route::post('/logout', [AuthController::class, 'logout']);

    // Ressources API
    Route::apiResource('courses', CourseController::class);
    Route::apiResource('modules', ModuleController::class);
    Route::apiResource('videos', VideoController::class);
    Route::apiResource('pathways', PathwayController::class);
    Route::apiResource('companies', CompanyController::class);

});
