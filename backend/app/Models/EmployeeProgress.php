<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class EmployeeProgress extends Model
{
    use HasFactory;

    protected $fillable = [
        'employee_id',
        'video_id',
        'watch_time_seconds',
        'total_duration_seconds',
        'progress_percentage',
        'completed',
        'last_watched_at',
    ];

    protected $casts = [
        'progress_percentage' => 'decimal:2',
        'completed' => 'boolean',
        'last_watched_at' => 'datetime',
    ];

    /**
     * Relation avec l'employé
     */
    public function employee(): BelongsTo
    {
        return $this->belongsTo(Employee::class);
    }

    /**
     * Relation avec la vidéo
     */
    public function video(): BelongsTo
    {
        return $this->belongsTo(Video::class);
    }

    /**
     * Mettre à jour la progression
     */
    public static function updateProgress(
        int $employeeId,
        int $videoId,
        int $watchTimeSeconds,
        int $totalDurationSeconds
    ): self {
        $progress = self::where('employee_id', $employeeId)
            ->where('video_id', $videoId)
            ->first();

        if (!$progress) {
            $progress = self::create([
                'employee_id' => $employeeId,
                'video_id' => $videoId,
                'watch_time_seconds' => $watchTimeSeconds,
                'total_duration_seconds' => $totalDurationSeconds,
                'progress_percentage' => $totalDurationSeconds > 0 
                    ? ($watchTimeSeconds / $totalDurationSeconds) * 100 
                    : 0,
                'completed' => $watchTimeSeconds >= ($totalDurationSeconds * 0.9), // 90% = terminé
                'last_watched_at' => now(),
            ]);
        } else {
            $progressPercentage = $totalDurationSeconds > 0 
                ? min(($watchTimeSeconds / $totalDurationSeconds) * 100, 100) 
                : 0;

            $progress->update([
                'watch_time_seconds' => max($watchTimeSeconds, $progress->watch_time_seconds),
                'total_duration_seconds' => $totalDurationSeconds,
                'progress_percentage' => $progressPercentage,
                'completed' => $progressPercentage >= 90,
                'last_watched_at' => now(),
            ]);
        }

        return $progress;
    }

    /**
     * Obtenir les statistiques de progression d'un employé
     */
    public static function getEmployeeStats(int $employeeId): array
    {
        $stats = self::where('employee_id', $employeeId)
            ->selectRaw('
                COUNT(*) as total_videos,
                SUM(CASE WHEN completed = 1 THEN 1 ELSE 0 END) as completed_videos,
                AVG(progress_percentage) as average_progress,
                SUM(watch_time_seconds) as total_watch_time
            ')
            ->first();

        return [
            'total_videos' => $stats->total_videos ?? 0,
            'completed_videos' => $stats->completed_videos ?? 0,
            'in_progress_videos' => ($stats->total_videos ?? 0) - ($stats->completed_videos ?? 0),
            'average_progress' => round($stats->average_progress ?? 0, 2),
            'total_watch_time_minutes' => round(($stats->total_watch_time ?? 0) / 60),
            'completion_rate' => $stats->total_videos > 0 
                ? round((($stats->completed_videos ?? 0) / $stats->total_videos) * 100, 2)
                : 0,
        ];
    }
}
