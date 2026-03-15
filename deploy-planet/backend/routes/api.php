<?php

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;
use App\Http\Controllers\Auth\AuthController;
use App\Http\Controllers\Analytics\AnalyticsController;
use App\Http\Controllers\Course\CourseController;
use App\Http\Controllers\Course\ModuleController;
use App\Http\Controllers\Course\VideoController as CourseVideoController;
use App\Http\Controllers\Pathway\PathwayController;
use App\Http\Controllers\Company\CompanyController;
use App\Http\Controllers\Creator\DashboardController;
use App\Http\Controllers\Creator\VideoController;
use App\Http\Controllers\Creator\StatsController;
use App\Http\Controllers\Creator\HistoryController;
use App\Http\Controllers\Creator\NotificationController;
use App\Http\Controllers\Creator\ProfileController;

/*
|--------------------------------------------------------------------------
| API Routes - MODE DÉVELOPPEMENT TOTAL (ACCÈS LIBRE)
|--------------------------------------------------------------------------
*/

// --- 0. ROUTES PUBLIQUES (PAS D'AUTHENTIFICATION REQUISE) ---
Route::get('/public/videos', [CourseController::class, 'publicVideos']);

// --- 1. AUTHENTIFICATION ---
Route::post('/register', [AuthController::class, 'register']);
Route::post('/login', [AuthController::class, 'login']);
Route::post('/logout', [AuthController::class, 'logout']);

// Routes protégées par Sanctum
Route::middleware('auth:sanctum')->group(function () {
    // --- 2. UTILISATEUR AUTHENTIFIÉ ---
    Route::get('/me', [AuthController::class, 'me']);
    
    // --- 3. CREATOR DASHBOARD ---
    Route::get('/creator/dashboard', [DashboardController::class, 'index']);
    Route::get('/creator/videos', [VideoController::class, 'index']);
    Route::post('/creator/videos', [VideoController::class, 'store']);
    Route::get('/creator/videos/{id}', [VideoController::class, 'show']);
    Route::put('/creator/videos/{id}', [VideoController::class, 'update']);
    Route::delete('/creator/videos/{id}', [VideoController::class, 'destroy']);
    Route::get('/creator/stats', [StatsController::class, 'index']);
    Route::get('/creator/history', [HistoryController::class, 'index']);
    Route::get('/creator/notifications', [NotificationController::class, 'index']);
    Route::post('/creator/notifications/{id}/read', [NotificationController::class, 'markAsRead']);
    Route::post('/creator/notifications/read-all', [NotificationController::class, 'markAllAsRead']);
    Route::delete('/creator/notifications/{id}', [NotificationController::class, 'destroy']);
    Route::post('/creator/notifications/{id}/archive', [NotificationController::class, 'archive']);
    Route::get('/creator/profile', [ProfileController::class, 'index']);
    Route::put('/creator/profile', [ProfileController::class, 'update']);
    Route::put('/creator/profile/password', [ProfileController::class, 'updatePassword']);
    
    // --- 4. DASHBOARD ADMIN & ANALYTICS ---
    Route::get('/admin/stats', [AnalyticsController::class, 'getDashboardStats']);
    
    // --- 5. DASHBOARD STUDENT ---
    Route::get('/student/courses', [CourseController::class, 'index']);
    Route::get('/student/pathways', [PathwayController::class, 'index']);
});
