<?php

namespace App\Http\Controllers\Creator;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;

class WebinarController extends Controller
{
    protected $storePath;

    public function __construct()
    {
        $this->storePath = storage_path('app/webinars.json');
        if (!file_exists($this->storePath)) {
            file_put_contents($this->storePath, json_encode([]));
        }
    }

    protected function readStore()
    {
        $data = @file_get_contents($this->storePath);
        return $data ? json_decode($data, true) : [];
    }

    protected function writeStore($data)
    {
        file_put_contents($this->storePath, json_encode(array_values($data), JSON_PRETTY_PRINT));
    }

    public function index(Request $request)
    {
        $user = $request->user();
        if (!$user) {
            return response()->json(['error' => 'Unauthorized'], 401);
        }

        $items = $this->readStore();
        // Return only items for this creator (if creator_id present)
        $filtered = array_values(array_filter($items, function ($i) use ($user) {
            return !isset($i['creatorId']) || $i['creatorId'] == $user->id;
        }));

        return response()->json($filtered);
    }

    public function store(Request $request)
    {
        $user = $request->user();
        if (!$user) {
            return response()->json(['error' => 'Unauthorized'], 401);
        }

        $items = $this->readStore();
        $nextId = count($items) ? (max(array_column($items, 'id')) + 1) : 1;

        $payload = $request->only(['title', 'description', 'date', 'time', 'duration', 'type', 'maxParticipants', 'location', 'address', 'meetingLink']);
        $new = array_merge($payload, [
            'id' => $nextId,
            'creatorId' => $user->id,
            'creatorName' => $user->name ?? 'Creator',
            'currentParticipants' => 0,
            'status' => 'scheduled',
        ]);

        $items[] = $new;
        $this->writeStore($items);

        return response()->json($new, 201);
    }

    public function show($id, Request $request)
    {
        $user = $request->user();
        if (!$user) return response()->json(['error' => 'Unauthorized'], 401);

        $items = $this->readStore();
        foreach ($items as $item) {
            if ($item['id'] == (int)$id) return response()->json($item);
        }

        return response()->json(['error' => 'Not found'], 404);
    }

    public function destroy($id, Request $request)
    {
        $user = $request->user();
        if (!$user) return response()->json(['error' => 'Unauthorized'], 401);

        $items = $this->readStore();
        $remaining = array_values(array_filter($items, function ($i) use ($id) {
            return $i['id'] != (int)$id;
        }));

        $this->writeStore($remaining);
        return response()->json(['message' => 'Deleted']);
    }
}
