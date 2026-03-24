<?php

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;
use App\Http\Controllers\Auth\AuthController;
use App\Http\Controllers\EmployeeAuthController;
use App\Http\Controllers\EmployeeProgressController;
use App\Http\Controllers\PathwayManagementController;
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
use App\Http\Controllers\EmployeeController;

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

// --- 1.1 AUTHENTIFICATION EMPLOYÉS ---
Route::post('/employee/login', [EmployeeAuthController::class, 'login']);

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
    
    // --- 3.1 GESTION DES EMPLOYÉS ---
    Route::get('/creator/employees', [EmployeeController::class, 'index']);
    Route::post('/creator/employees', [EmployeeController::class, 'store']);
    Route::get('/creator/employees/{id}', [EmployeeController::class, 'show']);
    Route::put('/creator/employees/{id}', [EmployeeController::class, 'update']);
    Route::delete('/creator/employees/{id}', [EmployeeController::class, 'destroy']);
    Route::post('/creator/employees/{id}/regenerate-credentials', [EmployeeController::class, 'regenerateCredentials']);
    Route::get('/creator/employees/stats', [EmployeeController::class, 'stats']);
    
    // --- 3.2 SUIVI DE PROGRESSION DES EMPLOYÉS ---
    Route::get('/creator/employees/progress/global', [EmployeeProgressController::class, 'globalProgress']);
    Route::get('/creator/employees/{employeeId}/progress', [EmployeeProgressController::class, 'employeeProgress']);
    Route::get('/creator/employees/{employeeId}/progress/courses', [EmployeeProgressController::class, 'courseProgress']);
    
    // --- 3.3 GESTION DES PARCOURS DE FORMATION ---
    Route::get('/creator/pathways', [PathwayManagementController::class, 'index']);
    Route::post('/creator/pathways', [PathwayManagementController::class, 'store']);
    Route::post('/creator/pathways/assign', [PathwayManagementController::class, 'assignToEmployee']);
    Route::get('/creator/pathways/employee/{employeeId}', [PathwayManagementController::class, 'employeePathways']);
    Route::put('/creator/pathways/assignment/{assignmentId}/progress', [PathwayManagementController::class, 'updateProgress']);
    Route::delete('/creator/pathways/assignment/{assignmentId}', [PathwayManagementController::class, 'removeAssignment']);
    
    // --- 4. DASHBOARD ADMIN & ANALYTICS ---
    Route::get('/admin/stats', [AnalyticsController::class, 'getDashboardStats']);
    
    // --- 5. DASHBOARD STUDENT ---
    Route::get('/student/courses', [CourseController::class, 'index']);
    Route::get('/student/pathways', [PathwayController::class, 'index']);
});

// --- 6. EMPLOYÉ DASHBOARD ---
Route::middleware('auth:sanctum')->group(function () {
    // --- 6.1 AUTHENTIFICATION EMPLOYÉ ---
    Route::post('/employee/logout', [EmployeeAuthController::class, 'logout']);
    Route::get('/employee/me', [EmployeeAuthController::class, 'me']);
    
    // --- 6.2 EMPLOYÉ COURSES ---
    Route::get('/employee/courses', [CourseController::class, 'employeeCourses']);
    Route::get('/employee/pathways', [PathwayController::class, 'employeePathways']);
    
    // --- 6.3 PROGRESSION EMPLOYÉ ---
    Route::post('/employee/progress/update', [EmployeeProgressController::class, 'updateProgress']);
});
