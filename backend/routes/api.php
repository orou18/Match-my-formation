<?php

use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Route;
use App\Http\Controllers\Auth\AuthController;
use App\Http\Controllers\EmployeeAuthController;
use App\Http\Controllers\EmployeeProgressController;
use App\Http\Controllers\PathwayManagementController;
use App\Http\Controllers\Analytics\AnalyticsController;
use App\Http\Controllers\Admin\BrandingController;
use App\Http\Controllers\Course\CourseController;
use App\Http\Controllers\Course\ModuleController;
use App\Http\Controllers\Course\VideoController as CourseVideoController;
use App\Http\Controllers\Pathway\PathwayController;
use App\Http\Controllers\Company\CompanyController;
use App\Http\Controllers\Creator\DashboardController;
use App\Http\Controllers\Creator\WebinarController;
use App\Http\Controllers\Creator\WebinarMessageController;
use App\Http\Controllers\Creator\VideoController;
use App\Http\Controllers\Creator\StatsController;
use App\Http\Controllers\Creator\HistoryController;
use App\Http\Controllers\Creator\NotificationController;
use App\Http\Controllers\Creator\ProfileController;
use App\Http\Controllers\EmployeeController;
use App\Http\Controllers\Chat\ChatMessageController;
use App\Http\Controllers\User\AccountController;

/*
|--------------------------------------------------------------------------
| API Routes - MODE DÉVELOPPEMENT TOTAL (ACCÈS LIBRE)
|--------------------------------------------------------------------------
*/

// --- HEALTH CHECK ---
Route::get('/health', function () {
    return response()->json([
        'status' => 'ok',
        'timestamp' => now()->toISOString(),
        'version' => '1.0.0',
        'environment' => config('app.env'),
        'database' => DB::connection()->getPdo() ? 'connected' : 'disconnected'
    ]);
});

// --- 0. ROUTES PUBLIQUES (PAS D'AUTHENTIFICATION REQUISE) ---
Route::get('/public/videos', [CourseController::class, 'publicVideos']);
Route::get('/videos/public', [VideoController::class, 'publicVideos']);
Route::get('/videos/public/{id}', [VideoController::class, 'showPublic']);
Route::get('/videos/public/search', [VideoController::class, 'searchPublic']);
Route::get('/videos/{id}', [CourseVideoController::class, 'show']);

// --- 1. AUTHENTIFICATION ---
Route::prefix('auth')->group(function () {
    Route::post('/register', [AuthController::class, 'register'])->middleware('throttle:auth');
    Route::post('/login', [AuthController::class, 'login'])->middleware('throttle:auth');
    Route::post('/logout', [AuthController::class, 'logout']);
});

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
    Route::get('/creator/videos/public', [VideoController::class, 'publicVideos']);
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

    // --- 3.3 ANALYTICS DES EMPLOYÉS ---
    Route::get('/creator/analytics/employees', [CreatorAnalyticsController::class, 'getEmployeeAnalytics']);

    // --- 3.3 GESTION DES PARCOURS DE FORMATION ---
    Route::get('/creator/pathways', [PathwayManagementController::class, 'index']);
    Route::post('/creator/pathways', [PathwayManagementController::class, 'store']);
    Route::delete('/creator/pathways/{id}', [PathwayManagementController::class, 'destroy']);
    Route::post('/creator/pathways/assign', [PathwayManagementController::class, 'assignToEmployee']);
    Route::get('/creator/pathways/employee/{employeeId}', [PathwayManagementController::class, 'employeePathways']);
    Route::put('/creator/pathways/assignment/{assignmentId}/progress', [PathwayManagementController::class, 'updateProgress']);
    Route::delete('/creator/pathways/assignment/{assignmentId}', [PathwayManagementController::class, 'removeAssignment']);

    // --- 3.4 LIVE / WEBINARS (simple JSON-backed persistence)
    Route::get('/creator/webinars', [WebinarController::class, 'index']);
    Route::post('/creator/webinars', [WebinarController::class, 'store']);
    Route::get('/creator/webinars/{id}', [WebinarController::class, 'show']);
    Route::delete('/creator/webinars/{id}', [WebinarController::class, 'destroy']);
    // Chat messages for webinars (JSON-backed)
    Route::get('/creator/webinars/{id}/messages', [WebinarMessageController::class, 'index']);
    Route::post('/creator/webinars/{id}/messages', [WebinarMessageController::class, 'store']);

    // --- 4. DASHBOARD ADMIN & ANALYTICS ---
    Route::get('/admin/stats', [AnalyticsController::class, 'getDashboardStats']);
    Route::get('/admin/branding', [BrandingController::class, 'show']);
    Route::put('/admin/branding', [BrandingController::class, 'update']);

    // --- 5. DASHBOARD STUDENT ---
    Route::get('/student/courses', [CourseController::class, 'index']);
    Route::get('/student/pathways', [PathwayController::class, 'index']);
    Route::get('/student/parcours', [PathwayController::class, 'studentProgressDetails']);

    // --- 5.1 COMPTE UTILISATEUR ---
    Route::get('/user/profile', [AccountController::class, 'profile']);
    Route::put('/user/profile', [AccountController::class, 'updateProfile']);
    Route::post('/user/change-password', [AccountController::class, 'changePassword']);
    Route::post('/user/upload-avatar', [AccountController::class, 'uploadAvatar']);
    Route::get('/user/preferences', [AccountController::class, 'preferences']);
    Route::put('/user/preferences', [AccountController::class, 'updatePreferences']);
    Route::get('/user/security', [AccountController::class, 'security']);
    Route::get('/user/notification-settings', [AccountController::class, 'notificationSettings']);
    Route::put('/user/notification-settings', [AccountController::class, 'updateNotificationSettings']);
    Route::get('/user/notifications', [AccountController::class, 'notifications']);
    Route::put('/user/notifications', [AccountController::class, 'updateNotifications']);
    Route::delete('/user/notifications', [AccountController::class, 'deleteNotifications']);
    Route::get('/user/notifications/unread-count', [AccountController::class, 'unreadNotificationsCount']);
    Route::post('/user/2fa/setup', [AccountController::class, 'setupTwoFactor']);
    Route::post('/user/2fa/verify', [AccountController::class, 'verifyTwoFactor']);
    Route::post('/user/2fa/disable', [AccountController::class, 'disableTwoFactor']);
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

    // --- 6.4 INTERACTIONS VIDÉO ---
    Route::post('/videos/{id}/like', [CourseVideoController::class, 'like']);
    Route::delete('/videos/{id}/like', [CourseVideoController::class, 'unlike']);
    Route::post('/videos/{id}/comments', [CourseVideoController::class, 'comment']);

    // --- 7. CHAT MESSAGES (Disponible pour tous les utilisateurs authentifiés) ---
    Route::get('/videos/{videoId}/messages', [ChatMessageController::class, 'getVideoMessages']);
    Route::post('/videos/{videoId}/messages', [ChatMessageController::class, 'storeMessage']);
    Route::put('/messages/{messageId}', [ChatMessageController::class, 'updateMessage']);
    Route::delete('/messages/{messageId}', [ChatMessageController::class, 'deleteMessage']);
    Route::post('/messages/{messageId}/like', [ChatMessageController::class, 'likeMessage']);

    // --- 7.1 CHAT CREATOR NOTIFICATIONS ---
    Route::get('/creator/chat/notifications', [ChatMessageController::class, 'getCreatorChatNotifications']);
    Route::post('/creator/chat/messages/{messageId}/reply', [ChatMessageController::class, 'replyToMessage']);
    Route::post('/creator/chat/messages/{messageId}/mark-resolved', [ChatMessageController::class, 'markAsResolved']);
});
