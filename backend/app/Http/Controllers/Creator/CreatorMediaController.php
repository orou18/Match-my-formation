<?php

namespace App\Http\Controllers\Creator;

use App\Http\Controllers\Controller;
use App\Models\Video;
use Illuminate\Http\Request;

class CreatorMediaController extends Controller
{
    public function batch(Request $request)
    {
        $creator = $request->user();
        abort_unless($creator && $creator->role === 'creator', 403, 'Accès créateur requis.');

        $validated = $request->validate([
            'action' => 'required|string|in:copy,move,archive,delete',
            'itemIds' => 'required|array|min:1',
            'itemIds.*' => 'integer',
            'targetPath' => 'nullable|string|max:255',
        ]);

        $videos = Video::where('uploader_id', $creator->id)
            ->whereIn('id', $validated['itemIds'])
            ->get();

        if ($validated['action'] === 'copy') {
            $copies = $videos->map(function (Video $video) {
                $copy = $video->replicate(['views', 'likes', 'comments', 'shares', 'published_at']);
                $copy->title = $video->title . ' (copie)';
                $copy->visibility = 'private';
                $copy->published_at = null;
                $copy->views = 0;
                $copy->likes = 0;
                $copy->comments = 0;
                $copy->shares = 0;
                $copy->save();

                return $copy;
            });

            return response()->json(['success' => true, 'items' => $copies->values()]);
        }

        if ($validated['action'] === 'move') {
            Video::whereIn('id', $videos->pluck('id'))->update([
                'category' => $validated['targetPath'] ?? 'Médias',
            ]);
        }

        if ($validated['action'] === 'archive') {
            Video::whereIn('id', $videos->pluck('id'))->update([
                'visibility' => 'private',
                'published_at' => null,
            ]);
        }

        if ($validated['action'] === 'delete') {
            Video::whereIn('id', $videos->pluck('id'))->delete();
        }

        return response()->json([
            'success' => true,
            'message' => 'Action média appliquée',
            'affected' => $videos->count(),
        ]);
    }
}
