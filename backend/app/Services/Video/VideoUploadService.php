<?php

namespace App\Services\Video;

use Illuminate\Http\UploadedFile;
use Illuminate\Support\Facades\Storage;
use Illuminate\Support\Str;

class VideoUploadService
{
    public function storeVideo(UploadedFile $file): string
    {
        return $file->store('videos', 'public');
    }

    public function storeThumbnail(UploadedFile $file): string
    {
        return $file->store('thumbnails', 'public');
    }

    public function storeBase64Image(string $value): ?string
    {
        if (!preg_match('/^data:image\/(\w+);base64,/', $value, $matches)) {
            return null;
        }

        $extension = strtolower($matches[1]);
        $data = substr($value, strpos($value, ',') + 1);
        $binary = base64_decode($data, true);

        if ($binary === false) {
            return null;
        }

        $path = 'thumbnails/' . Str::uuid() . '.' . $extension;
        Storage::disk('public')->put($path, $binary);

        return $path;
    }
}
