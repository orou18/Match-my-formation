<?php

namespace App\Jobs;

use App\Models\Video;
use Illuminate\Bus\Queueable;
use Illuminate\Contracts\Queue\ShouldQueue;
use Illuminate\Foundation\Bus\Dispatchable;
use Illuminate\Queue\InteractsWithQueue;
use Illuminate\Queue\SerializesModels;
use Illuminate\Support\Facades\Log;

class ProcessVideoUpload implements ShouldQueue
{
    use Dispatchable, InteractsWithQueue, Queueable, SerializesModels;

    public function __construct(public int $videoId)
    {
    }

    public function handle(): void
    {
        $video = Video::find($this->videoId);
        if (!$video) {
            return;
        }

        Log::info('Video processing queued', [
            'video_id' => $video->id,
            'url' => $video->url,
        ]);
    }
}
