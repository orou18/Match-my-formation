<?php

namespace App\Http\Controllers\Creator;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Storage;
use Illuminate\Support\Str;

class WebinarMessageController extends Controller
{
    protected function storagePath($webinarId)
    {
        return "webinar_messages_{$webinarId}.json";
    }

    public function index($webinarId)
    {
        $path = $this->storagePath($webinarId);
        if (!Storage::disk('local')->exists($path)) {
            return response()->json([], 200);
        }

        $text = Storage::disk('local')->get($path);
        $data = json_decode($text, true) ?: [];
        return response()->json($data, 200);
    }

    public function store(Request $request, $webinarId)
    {
        $request->validate([
            'userId' => 'required|integer',
            'userName' => 'required|string',
            'message' => 'required|string',
        ]);

        $path = $this->storagePath($webinarId);
        $messages = [];
        if (Storage::disk('local')->exists($path)) {
            $messages = json_decode(Storage::disk('local')->get($path), true) ?: [];
        }

        $entry = [
            'id' => Str::uuid()->toString(),
            'userId' => $request->input('userId'),
            'userName' => $request->input('userName'),
            'message' => $request->input('message'),
            'timestamp' => now()->toDateTimeString(),
        ];

        $messages[] = $entry;
        Storage::disk('local')->put($path, json_encode($messages, JSON_PRETTY_PRINT | JSON_UNESCAPED_UNICODE));

        return response()->json($entry, 201);
    }
}
