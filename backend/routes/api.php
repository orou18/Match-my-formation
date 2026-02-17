<?php

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;
use App\Http\Controllers\Auth\AuthController;
use App\Http\Controllers\Analytics\AnalyticsController;
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

// --- ROUTES PUBLIQUES ---
Route::post('/register', [AuthController::class, 'register']);
Route::post('/login', [AuthController::class, 'login']);
Route::get('/public/videos', [VideoController::class, 'indexPublic']);

// --- ROUTES PROTÉGÉES (Auth Requis) ---
Route::middleware('auth:sanctum')->group(function () {
    
    // Profil & Session
    Route::get('/me', [AuthController::class, 'me']); // Utilise la méthode du controller
    Route::post('/logout', [AuthController::class, 'logout']);

    // --- ESPACE ADMIN / ANALYTICS ---
    Route::get('/admin/stats', [AnalyticsController::class, 'getDashboardStats']);

    // --- GESTION DES VIDÉOS ---
    // Note : On garde le store séparé si tu as une logique d'upload spécifique (ex: S3, Chunking)
    Route::post('/videos/upload', [VideoController::class, 'store']); 
    Route::apiResource('videos', VideoController::class);

    // --- FORMATIONS & CONTENUS ---
    Route::apiResource('courses', CourseController::class);
    Route::apiResource('modules', ModuleController::class);
    
    // --- PARCOURS & ENTREPRISES ---
    Route::apiResource('pathways', PathwayController::class);
    Route::apiResource('companies', CompanyController::class);
});