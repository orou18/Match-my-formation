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
use App\Http\Controllers\Admin\AdminNotificationController;
use App\Http\Controllers\Admin\AdminCreatorController;
use App\Http\Controllers\Admin\AdminUserController;
use App\Http\Controllers\Admin\AdminAdsController;
use App\Http\Controllers\Admin\AdminBlogController;
use App\Http\Controllers\Admin\AdminWebinarController;
use App\Http\Controllers\Admin\AdminProfileController;
use App\Http\Controllers\Course\CourseController;
use App\Http\Controllers\Course\ModuleController;
use App\Http\Controllers\Course\VideoController as CourseVideoController;
use App\Http\Controllers\Video\PublicVideoController;
use App\Http\Controllers\Video\StudentVideoController;
use App\Http\Controllers\Pathway\PathwayController;
use App\Http\Controllers\Company\CompanyController;
use App\Http\Controllers\Student\StudentProgressController;
use App\Http\Controllers\Employee\EmployeeDashboardController;
use App\Http\Controllers\Employee\EmployeePathwayController;
use App\Http\Controllers\Creator\DashboardController;
use App\Http\Controllers\Creator\WebinarController;
use App\Http\Controllers\Creator\WebinarMessageController;
use App\Http\Controllers\Creator\VideoController;
use App\Http\Controllers\Creator\StatsController;
use App\Http\Controllers\Creator\CreatorAnalyticsController;
use App\Http\Controllers\Creator\CreatorBrandingController;
use App\Http\Controllers\Creator\CreatorMediaController;
use App\Http\Controllers\Creator\CreatorScheduleController;
use App\Http\Controllers\Creator\CreatorVideoAssignmentController;
use App\Http\Controllers\Creator\CreatorRevenueController;
use App\Http\Controllers\Creator\CreatorEngagementController;
use App\Http\Controllers\Creator\CreatorNotificationController;
use App\Http\Controllers\Creator\HistoryController;
use App\Http\Controllers\Creator\NotificationController;
use App\Http\Controllers\Creator\ProfileController;
use App\Http\Controllers\EmployeeController;
use App\Http\Controllers\Employee\EmployeeStatsController;
use App\Http\Controllers\Chat\ChatMessageController;
use App\Http\Controllers\User\AccountController;
use App\Http\Controllers\FinanceController;

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
Route::get('/videos/public', [PublicVideoController::class, 'index']);
Route::get('/videos/public/search', [PublicVideoController::class, 'search']);
Route::get('/videos/public/{id}', [PublicVideoController::class, 'show']);
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
    // --- 3.1 GESTION DES EMPLOYÉS ---
    Route::get('/creator/employees', [EmployeeController::class, 'index']);
    Route::post('/creator/employees', [EmployeeController::class, 'store']);
    Route::get('/creator/employees/{id}', [EmployeeController::class, 'show']);
    Route::put('/creator/employees/{id}', [EmployeeController::class, 'update']);
    Route::delete('/creator/employees/{id}', [EmployeeController::class, 'destroy']);
    Route::post('/creator/employees/{id}/regenerate-credentials', [EmployeeController::class, 'regenerateCredentials']);
    Route::get('/creator/employees/stats', [EmployeeController::class, 'stats']);
    
    // --- 3.2 ACCÈS EMPLOYÉS ---
    Route::post('/creator/employees/{id}/send-access', [App\Http\Controllers\EmployeeAccessController::class, 'sendAccess']);
    Route::get('/creator/employees/{id}/qr-code', [App\Http\Controllers\EmployeeAccessController::class, 'generateQRCode']);
    Route::post('/creator/employees/{id}/reset-password', [App\Http\Controllers\EmployeeAccessController::class, 'resetPassword']);

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

    // --- 3.4 GESTION DES VIDÉOS ---
    Route::get('/creator/videos', [VideoController::class, 'index']);
    Route::post('/creator/videos', [VideoController::class, 'store']);
    Route::put('/creator/videos/{id}', [VideoController::class, 'update']);
    Route::delete('/creator/videos/{id}', [VideoController::class, 'destroy']);
    Route::post('/creator/videos/{id}/assign-employees', [CreatorVideoAssignmentController::class, 'assign']);
    Route::delete('/creator/videos/{id}/assign-employees', [CreatorVideoAssignmentController::class, 'unassign']);

    // --- 3.5 HISTORIQUE ACTIVITÉS ---
    Route::get('/creator/history', [HistoryController::class, 'index']);
    Route::get('/creator/history/stats', [HistoryController::class, 'getStats']);

    // --- 3.6 BRANDING PERSONNALISÉ ---
    Route::get('/creator/branding', [CreatorBrandingController::class, 'current']);
    Route::put('/creator/branding', [CreatorBrandingController::class, 'updateCurrent']);
    Route::get('/creator/{id}/branding', [CreatorBrandingController::class, 'getBranding']);
    Route::put('/creator/{id}/branding', [CreatorBrandingController::class, 'updateBranding']);
    Route::post('/creator/media/batch', [CreatorMediaController::class, 'batch']);
    Route::put('/creator/media/batch', [CreatorMediaController::class, 'batch']);
    Route::delete('/creator/media/batch', [CreatorMediaController::class, 'batch']);
    Route::get('/creator/schedule', [CreatorScheduleController::class, 'index']);
    Route::post('/creator/schedule', [CreatorScheduleController::class, 'store']);
    Route::put('/creator/schedule/{id}', [CreatorScheduleController::class, 'update']);
    Route::delete('/creator/schedule/{id}', [CreatorScheduleController::class, 'destroy']);

    // --- 3.5 LIVE / WEBINARS (simple JSON-backed persistence)
    Route::get('/creator/webinars', [WebinarController::class, 'index']);
    Route::post('/creator/webinars', [WebinarController::class, 'store']);
    Route::get('/creator/webinars/{id}', [WebinarController::class, 'show']);
    Route::delete('/creator/webinars/{id}', [WebinarController::class, 'destroy']);
    // Chat messages for webinars (JSON-backed)
    Route::get('/creator/webinars/{id}/messages', [WebinarMessageController::class, 'index']);
    Route::post('/creator/webinars/{id}/messages', [WebinarMessageController::class, 'store']);

    // --- 3. DASHBOARD CREATOR ---
    Route::middleware('auth:sanctum')->group(function () {
        Route::get('/creator/dashboard', [DashboardController::class, 'index']);
        Route::get('/creator/stats', [StatsController::class, 'index']);
        Route::get('/creator/profile', [ProfileController::class, 'index']);
        Route::put('/creator/profile', [ProfileController::class, 'update']);
        Route::get('/creator/notifications', [NotificationController::class, 'index']);
        Route::put('/creator/notifications', [NotificationController::class, 'markAsRead']);
        Route::delete('/creator/notifications', [NotificationController::class, 'delete']);
        Route::get('/creator/history', [HistoryController::class, 'index']);
        Route::get('/creator/employees', [EmployeeController::class, 'index']);
        Route::post('/creator/employees', [EmployeeController::class, 'store']);
        Route::get('/creator/employees/{id}', [EmployeeController::class, 'show']);
        Route::put('/creator/employees/{id}', [EmployeeController::class, 'update']);
        Route::delete('/creator/employees/{id}', [EmployeeController::class, 'destroy']);
        Route::get('/creator/videos', [VideoController::class, 'index']);
        Route::post('/creator/videos', [VideoController::class, 'store']);
        Route::get('/creator/videos/{id}', [VideoController::class, 'show']);
        Route::put('/creator/videos/{id}', [VideoController::class, 'update']);
        Route::delete('/creator/videos/{id}', [VideoController::class, 'destroy']);
        Route::post('/creator/videos/{id}/publish', [VideoController::class, 'publish']);
        Route::post('/creator/videos/{id}/unpublish', [VideoController::class, 'unpublish']);
        Route::get('/creator/webinars', [WebinarController::class, 'index']);
        Route::post('/creator/webinars', [WebinarController::class, 'store']);
        Route::get('/creator/webinars/{id}', [WebinarController::class, 'show']);
        Route::put('/creator/webinars/{id}', [WebinarController::class, 'update']);
        Route::delete('/creator/webinars/{id}', [WebinarController::class, 'destroy']);
        Route::post('/creator/webinars/{id}/start', [WebinarController::class, 'start']);
        Route::post('/creator/webinars/{id}/end', [WebinarController::class, 'end']);
        Route::get('/creator/webinars/{id}/messages', [WebinarMessageController::class, 'index']);
        Route::post('/creator/webinars/{id}/messages', [WebinarMessageController::class, 'store']);

        // --- 3.1 REVENUS CREATOR ---
        Route::get('/creator/revenue', [CreatorRevenueController::class, 'getRevenue']);
        Route::get('/creator/revenue/details', [CreatorRevenueController::class, 'getRevenueDetails']);
        
        // --- 3.2 ENGAGEMENT CREATOR ---
        Route::get('/creator/engagement', [CreatorEngagementController::class, 'getEngagement']);
        
        // --- 3.3 NOTIFICATIONS CREATOR ---
        Route::get('/creator/notifications', [CreatorNotificationController::class, 'getNotifications']);
        Route::put('/creator/notifications', [CreatorNotificationController::class, 'markAsRead']);
        Route::put('/creator/notifications/mark-all-read', [CreatorNotificationController::class, 'markAllAsRead']);
        Route::delete('/creator/notifications', [CreatorNotificationController::class, 'deleteNotification']);
        Route::get('/creator/notifications/unread-count', [CreatorNotificationController::class, 'getUnreadCount']);
    });

    // --- 4. DASHBOARD ADMIN & ANALYTICS ---
    Route::middleware('auth:sanctum')->group(function () {
        Route::get('/admin/stats', [AnalyticsController::class, 'getDashboardStats']);
        Route::get('/admin/branding', [BrandingController::class, 'show']);
        Route::put('/admin/branding', [BrandingController::class, 'update']);
        
        // --- 4.1 NOTIFICATIONS ADMIN ---
        Route::get('/admin/notifications', [AdminNotificationController::class, 'index']);
        Route::post('/admin/notifications', [AdminNotificationController::class, 'store']);
        Route::get('/admin/notifications/{id}', [AdminNotificationController::class, 'show']);
        Route::put('/admin/notifications/{id}', [AdminNotificationController::class, 'update']);
        Route::delete('/admin/notifications/{id}', [AdminNotificationController::class, 'destroy']);
        Route::post('/admin/notifications/{id}/send', [AdminNotificationController::class, 'send']);
        Route::get('/admin/notifications/stats', [AdminNotificationController::class, 'stats']);
        Route::apiResource('/admin/blog', AdminBlogController::class)->except(['show']);
        Route::apiResource('/admin/ads', AdminAdsController::class)->except(['show']);
        Route::apiResource('/admin/webinars', AdminWebinarController::class)->except(['show']);
        
        // --- 4.2 CRÉATEURS ADMIN ---
        Route::get('/admin/creators', [AdminCreatorController::class, 'index']);
        Route::post('/admin/creators', [AdminCreatorController::class, 'store']);
        Route::get('/admin/creators/{id}', [AdminCreatorController::class, 'show']);
        Route::put('/admin/creators/{id}', [AdminCreatorController::class, 'update']);
        Route::delete('/admin/creators/{id}', [AdminCreatorController::class, 'destroy']);
        Route::post('/admin/creators/{id}/toggle-status', [AdminCreatorController::class, 'toggleStatus']);
        Route::get('/admin/creators/stats', [AdminCreatorController::class, 'stats']);
        
        // --- 4.3 UTILISATEURS ADMIN ---
        Route::get('/admin/users', [AdminUserController::class, 'index']);
        Route::post('/admin/users', [AdminUserController::class, 'store']);
        Route::get('/admin/users/{id}', [AdminUserController::class, 'show']);
        Route::put('/admin/users/{id}', [AdminUserController::class, 'update']);
        Route::delete('/admin/users/{id}', [AdminUserController::class, 'destroy']);
        Route::post('/admin/users/{id}/toggle-status', [AdminUserController::class, 'toggleStatus']);
        Route::get('/admin/users/stats', [AdminUserController::class, 'stats']);
        Route::get('/admin/users/export', [AdminUserController::class, 'export']);
        
        // --- 4.4 VIDEOS ADMIN ---
        Route::get('/admin/videos', [App\Http\Controllers\Admin\AdminVideosController::class, 'index']);
        Route::post('/admin/videos', [App\Http\Controllers\Admin\AdminVideosController::class, 'store']);
        Route::get('/admin/videos/{id}', [App\Http\Controllers\Admin\AdminVideosController::class, 'show']);
        Route::put('/admin/videos/{id}', [App\Http\Controllers\Admin\AdminVideosController::class, 'update']);
        Route::delete('/admin/videos/{id}', [App\Http\Controllers\Admin\AdminVideosController::class, 'destroy']);
        
        Route::get('/admin/videos/stats', [App\Http\Controllers\Admin\AdminVideosController::class, 'stats']);
        Route::post('/admin/videos/{id}/approve', [App\Http\Controllers\Admin\AdminVideosController::class, 'approve']);
        Route::post('/admin/videos/{id}/reject', [App\Http\Controllers\Admin\AdminVideosController::class, 'reject']);
        
        // --- 4.5 PROFILE ADMIN ---
        Route::get('/admin/profile', [AdminProfileController::class, 'show']);
        Route::put('/admin/profile', [AdminProfileController::class, 'update']);
        Route::post('/admin/profile/change-password', [AdminProfileController::class, 'changePassword']);
        Route::post('/admin/profile/upload-avatar', [AdminProfileController::class, 'uploadAvatar']);
    });

    // --- 5. DASHBOARD STUDENT ---
    // Temporaire: parcours endpoint en public pour la présentation
    Route::get('/student/parcours', [PathwayController::class, 'studentProgressDetails']);
    
    Route::middleware('auth:sanctum')->group(function () {
        Route::get('/student/courses', [CourseController::class, 'index']);
        Route::get('/student/pathways', [PathwayController::class, 'index']);

        // --- 5.1 PROGRESSION STUDENT ---
        Route::get('/student/progress', [StudentProgressController::class, 'getGlobalProgress']);
        Route::get('/student/progress/course/{courseId}', [StudentProgressController::class, 'getCourseProgress']);
        Route::put('/student/progress/video/{videoId}', [StudentProgressController::class, 'updateVideoProgress']);
        Route::post('/student/progress/video/{videoId}/complete', [StudentProgressController::class, 'completeVideo']);

        // --- 5.2 VIDÉOS PUBLIQUES ---
        Route::get('/videos/all-public', [StudentVideoController::class, 'getAllPublicVideos']);
        Route::get('/videos/{id}', [StudentVideoController::class, 'getVideoDetails'])->where('id', '\d+');
        Route::post('/videos/{id}/add-url', [StudentVideoController::class, 'addVideoUrl'])->where('id', '\d+');
        Route::post('/videos/{id}/publish', [StudentVideoController::class, 'publishVideo'])->where('id', '\d+');
        Route::get('/user/balance', [FinanceController::class, 'balance']);
        Route::post('/user/balance', [FinanceController::class, 'process']);
        Route::get('/payment/process', [FinanceController::class, 'paymentMethods']);
        Route::post('/payment/process', [FinanceController::class, 'process']);
        Route::post('/videos/{id}/increment-views', [StudentVideoController::class, 'incrementViews'])->where('id', '\d+');
        Route::post('/videos/{id}/like', [StudentVideoController::class, 'likeVideo'])->where('id', '\d+');
        Route::get('/videos/categories', [StudentVideoController::class, 'getCategories']);

        // --- 5.1 COMPTE UTILISATEUR ---
        Route::get('/creator/profile', [ProfileController::class, 'index']);
        Route::put('/creator/profile', [ProfileController::class, 'update']);
        Route::put('/creator/profile/password', [ProfileController::class, 'updatePassword']);
    });

    // --- 5.1 COMPTE UTILISATEUR ---
    Route::middleware('auth:sanctum')->group(function () {
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
    
    // --- 6.2 DASHBOARD EMPLOYÉ ---
    Route::get('/employee/me', [EmployeeDashboardController::class, 'getMe']);
    Route::get('/employee/courses', [EmployeeDashboardController::class, 'getCourses']);
    Route::get('/employee/stats', [EmployeeDashboardController::class, 'getStats']);
    Route::get('/employee/activity', [EmployeeDashboardController::class, 'getRecentActivity']);
    Route::put('/employee/progress/video/{videoId}', [EmployeeDashboardController::class, 'updateProgress']);
    Route::post('/employee/progress/video/{videoId}/complete', [EmployeeDashboardController::class, 'completeVideo']);
    
    // --- 6.3 PATHWAYS EMPLOYÉ ---
    Route::get('/employee/pathways', [EmployeePathwayController::class, 'getPathways']);
    Route::get('/employee/pathways/{pathwayId}', [EmployeePathwayController::class, 'getPathwayDetails']);
    Route::post('/employee/pathways/{pathwayId}/start', [EmployeePathwayController::class, 'startPathway']);
    Route::put('/employee/pathways/{pathwayId}/progress', [EmployeePathwayController::class, 'updatePathwayProgress']);
    Route::get('/employee/pathways/available', [EmployeePathwayController::class, 'getAvailablePathways']);
    
    // --- 6.4 STATISTIQUES EMPLOYÉ ---
    Route::get('/employee/stats/dashboard', [EmployeeStatsController::class, 'dashboard']);
    Route::post('/employee/stats/progress', [EmployeeStatsController::class, 'updateProgress']);
    Route::get('/employee/stats/detailed', [EmployeeStatsController::class, 'getDetailedStats']);

    // --- 6.2 EMPLOYÉ COURSES ---
    Route::get('/employee/courses', [CourseController::class, 'employeeCourses']);
    Route::get('/employee/pathways', [PathwayController::class, 'employeePathways']);

    // --- 6.3 PROGRESSION EMPLOYÉ ---
    Route::post('/employee/progress/update', [EmployeeProgressController::class, 'updateProgress']);

    // --- 6.4 INTERACTIONS VIDÉO ---
    Route::post('/videos/{id}/like', [CourseVideoController::class, 'like']);
    Route::delete('/videos/{id}/like', [CourseVideoController::class, 'unlike']);
    Route::post('/videos/{id}/comments', [CourseVideoController::class, 'comment']);

    // --- 6.5 EMPLOYEE STUDENT VIEW ---
    Route::get('/employee/student/dashboard', [App\Http\Controllers\EmployeeStudentController::class, 'dashboard']);
    Route::get('/employee/student/videos', [App\Http\Controllers\EmployeeStudentController::class, 'videos']);
    Route::get('/employee/student/pathways', [App\Http\Controllers\EmployeeStudentController::class, 'pathways']);
    Route::get('/employee/student/pathways/{id}', [App\Http\Controllers\EmployeeStudentController::class, 'pathwayDetails']);
    Route::post('/employee/student/videos/{id}/complete', [App\Http\Controllers\EmployeeStudentController::class, 'completeVideo']);
    Route::get('/employee/student/progress', [App\Http\Controllers\EmployeeStudentController::class, 'getProgress']);

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
});
