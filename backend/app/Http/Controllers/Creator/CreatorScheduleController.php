<?php

namespace App\Http\Controllers\Creator;

use App\Http\Controllers\Controller;
use App\Models\CreatorScheduleItem;
use Illuminate\Http\Request;

class CreatorScheduleController extends Controller
{
    public function index(Request $request)
    {
        $creator = $request->user();
        abort_unless($creator && $creator->role === 'creator', 403, 'Accès créateur requis.');

        return response()->json([
            'success' => true,
            'items' => CreatorScheduleItem::where('creator_id', $creator->id)
                ->orderBy('starts_at')
                ->get(),
        ]);
    }

    public function store(Request $request)
    {
        $creator = $request->user();
        abort_unless($creator && $creator->role === 'creator', 403, 'Accès créateur requis.');

        $validated = $request->validate([
            'title' => 'required|string|max:255',
            'description' => 'nullable|string',
            'type' => 'nullable|string|max:50',
            'starts_at' => 'required|date',
            'ends_at' => 'nullable|date|after_or_equal:starts_at',
            'status' => 'nullable|string|max:50',
            'metadata' => 'nullable|array',
        ]);

        $item = CreatorScheduleItem::create([
            ...$validated,
            'creator_id' => $creator->id,
        ]);

        return response()->json(['success' => true, 'item' => $item], 201);
    }

    public function update(Request $request, $id)
    {
        $creator = $request->user();
        abort_unless($creator && $creator->role === 'creator', 403, 'Accès créateur requis.');

        $item = CreatorScheduleItem::where('creator_id', $creator->id)->findOrFail($id);
        $validated = $request->validate([
            'title' => 'sometimes|string|max:255',
            'description' => 'nullable|string',
            'type' => 'sometimes|string|max:50',
            'starts_at' => 'sometimes|date',
            'ends_at' => 'nullable|date',
            'status' => 'sometimes|string|max:50',
            'metadata' => 'nullable|array',
        ]);
        $item->update($validated);

        return response()->json(['success' => true, 'item' => $item]);
    }

    public function destroy(Request $request, $id)
    {
        $creator = $request->user();
        abort_unless($creator && $creator->role === 'creator', 403, 'Accès créateur requis.');

        CreatorScheduleItem::where('creator_id', $creator->id)->findOrFail($id)->delete();

        return response()->json(['success' => true]);
    }
}
