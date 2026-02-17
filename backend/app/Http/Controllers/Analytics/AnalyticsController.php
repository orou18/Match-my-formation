<?php

namespace App\Http\Controllers\Analytics;

use App\Http\Controllers\Controller;
use App\Models\User;
use App\Models\Video;
use App\Models\Course;
use Illuminate\Http\JsonResponse;

class AnalyticsController extends Controller
{
    public function getDashboardStats(): JsonResponse
    {
        return response()->json([
            'total_users' => User::count(),
            'total_videos' => Video::count(),
            'total_courses' => Course::count(),
            'recent_activity' => [
                ['id' => 1, 'user' => 'Alice', 'action' => 'a rejoint un cours', 'date' => 'Il y a 2h'],
                ['id' => 2, 'user' => 'Jean', 'action' => 'a publié une vidéo', 'date' => 'Il y a 5h'],
            ]
        ]);
    }
}