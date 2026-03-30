<?php

namespace App\Http\Controllers\Course;

use App\Http\Controllers\Controller;
use App\Models\Enrollment;
use App\Models\Video;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;

class CourseController extends Controller
{
    /**
     * Récupérer les vidéos publiques pour la page d'accueil
     */
    public function publicVideos()
    {
        return response()->json(
            Video::with('uploader:id,name,avatar')
                ->where('visibility', 'public')
                ->latest()
                ->limit(12)
                ->get()
                ->map(fn (Video $video) => $this->serializeVideo($video))
                ->values()
        );
    }

    /**
     * Récupérer les cours pour l'étudiant connecté
     */
    public function index(Request $request)
    {
        $user = $request->user();

        $videosQuery = Video::with(['uploader:id,name,avatar', 'pathways:id,title'])
            ->where('visibility', 'public')
            ->latest();

        if ($user && $user->role === 'student') {
            $enrolledCourseIds = Enrollment::where('user_id', $user->id)
                ->pluck('course_id')
                ->all();

            if ($enrolledCourseIds !== []) {
                $videosQuery->whereHas('module.course', function ($query) use ($enrolledCourseIds) {
                    $query->whereIn('courses.id', $enrolledCourseIds);
                });
            }
        }

        return response()->json(
            $videosQuery
                ->limit(20)
                ->get()
                ->map(fn (Video $video) => $this->serializeVideo($video))
                ->values()
        );
    }

    /**
     * Récupérer les cours pour l'employé connecté
     */
    public function employeeCourses(Request $request): JsonResponse
    {
        $employee = $request->user();
        
        // Récupérer les vidéos créées par le créateur de cet employé
        $videos = Video::with('uploader')
            ->where('uploader_id', $employee->creator_id)
            ->whereIn('visibility', ['public', 'unlisted'])
            ->orderBy('created_at', 'desc')
            ->get()
            ->map(fn (Video $video) => array_merge(
                $this->serializeVideo($video),
                [
                    'creator' => [
                        'name' => $video->uploader->name ?? 'Formateur',
                        'domain' => $employee->domain,
                    ],
                ]
            ));

        return response()->json([
            'success' => true,
            'data' => $videos
        ]);
    }

    private function serializeVideo(Video $video): array
    {
        return [
            'id' => $video->id,
            'title' => $video->title,
            'description' => $video->description,
            'thumbnail' => $video->thumbnail_url,
            'video_url' => $video->video_url,
            'duration' => $video->duration,
            'views' => $video->views,
            'likes' => $video->likes,
            'comments' => $video->comments,
            'shares' => $video->shares,
            'publishedAt' => $video->created_at?->diffForHumans(),
            'visibility' => $video->visibility,
            'status' => $video->published_at ? 'published' : 'draft',
            'creator' => [
                'id' => $video->uploader?->id,
                'name' => $video->uploader?->name,
                'avatar' => $video->uploader?->avatar,
            ],
            'pathways' => $video->relationLoaded('pathways')
                ? $video->pathways->map(fn ($pathway) => [
                    'id' => $pathway->id,
                    'title' => $pathway->title,
                ])->values()
                : [],
        ];
    }
}
