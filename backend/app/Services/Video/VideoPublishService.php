<?php

namespace App\Services\Video;

use Carbon\CarbonInterface;
use Illuminate\Support\Carbon;

class VideoPublishService
{
    public function publishedAtForVisibility(string $visibility, ?CarbonInterface $current = null): ?CarbonInterface
    {
        if ($visibility === 'private') {
            return null;
        }

        return $current ?: Carbon::now();
    }
}
