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

// ======================
// 🔓 ROUTES PUBLIQUES
// ======================

Route::post('/register', [AuthController::class, 'register']);
Route::post('/login', [AuthController::class, 'login']);


// ======================
// 🔐 ROUTES PROTÉGÉES
// ======================

Route::middleware('auth:sanctum')->group(function () {

    // Infos utilisateur connecté
    Route::get('/me', function (Request $request) {
        return $request->user();
    });

    // Déconnexion
    Route::post('/logout', [AuthController::class, 'logout']);

    // Ressources API
    Route::apiResource('courses', CourseController::class);
    Route::apiResource('modules', ModuleController::class);
    Route::apiResource('videos', VideoController::class);
    Route::apiResource('pathways', PathwayController::class);
    Route::apiResource('companies', CompanyController::class);

});
