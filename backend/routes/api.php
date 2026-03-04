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
| API Routes - MODE DÉVELOPPEMENT TOTAL (ACCÈS LIBRE)
|--------------------------------------------------------------------------
*/

// --- 1. AUTHENTIFICATION (SIMULÉE) ---
Route::post('/register', [AuthController::class, 'register']);
Route::post('/login', [AuthController::class, 'login']);
Route::get('/me', [AuthController::class, 'me']);
Route::post('/logout', [AuthController::class, 'logout']);

// --- 2. DASHBOARD ADMIN & ANALYTICS ---
// Accès direct aux stats pour tes graphiques
Route::get('/admin/stats', [AnalyticsController::class, 'getDashboardStats']);

// --- 3. DASHBOARD CREATOR (Vidéos & Upload) ---
// Routes pour que le créateur puisse uploader et voir ses vidéos sans token
Route::get('/creator/videos', [VideoController::class, 'index']); // Liste complète
Route::post('/videos/upload', [VideoController::class, 'store']); // Upload de fichier
Route::get('/public/videos', [VideoController::class, 'indexPublic']);

// --- 4. DASHBOARD STUDENT (Cours & Parcours) ---
// Routes pour tester l'affichage côté étudiant
Route::get('/student/courses', [CourseController::class, 'index']);
Route::get('/student/pathways', [PathwayController::class, 'index']);

// --- 5. RESSOURCES GÉNÉRALES (CRUD COMPLET SANS AUTH) ---
// On expose toutes les ressources pour tes formulaires (Ajout, Modif, Suppr)
Route::apiResource('videos', VideoController::class);
Route::apiResource('courses', CourseController::class);
Route::apiResource('modules', ModuleController::class);
Route::apiResource('pathways', PathwayController::class);
Route::apiResource('companies', CompanyController::class);

// --- 6. GROUPE VIDE (POUR LE FUTUR) ---
Route::middleware('auth:sanctum')->group(function () {
    // Vide pour l'instant pour éviter les erreurs 401
});
