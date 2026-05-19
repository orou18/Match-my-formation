<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\AdminBlogPost;
use Illuminate\Http\Request;
use Illuminate\Support\Str;

class AdminBlogController extends Controller
{
    public function index(Request $request)
    {
        $this->ensureAdmin($request);
        $query = AdminBlogPost::latest();

        foreach (['status', 'category'] as $filter) {
            if ($request->filled($filter) && $request->input($filter) !== 'all') {
                $query->where($filter, $request->input($filter));
            }
        }

        if ($request->filled('search')) {
            $search = $request->input('search');
            $query->where(fn ($q) => $q->where('title', 'like', "%{$search}%")->orWhere('content', 'like', "%{$search}%"));
        }

        return response()->json(['success' => true, 'posts' => $query->get()]);
    }

    public function store(Request $request)
    {
        $user = $this->ensureAdmin($request);
        $validated = $request->validate([
            'title' => 'required|string|max:255',
            'content' => 'nullable|string',
            'excerpt' => 'nullable|string|max:255',
            'author' => 'nullable|string|max:255',
            'category' => 'nullable|string|max:100',
            'tags' => 'nullable|array',
            'status' => 'nullable|string|max:50',
            'featured' => 'nullable|boolean',
            'thumbnail' => 'nullable|string|max:2048',
        ]);

        $post = AdminBlogPost::create([
            ...$validated,
            'slug' => Str::slug($validated['title']) . '-' . Str::lower(Str::random(6)),
            'published_at' => ($validated['status'] ?? 'draft') === 'published' ? now() : null,
            'created_by' => $user->id,
        ]);

        return response()->json(['success' => true, 'post' => $post], 201);
    }

    public function update(Request $request, $id)
    {
        $this->ensureAdmin($request);
        $post = AdminBlogPost::findOrFail($id);
        $validated = $request->validate([
            'title' => 'sometimes|string|max:255',
            'content' => 'nullable|string',
            'excerpt' => 'nullable|string|max:255',
            'author' => 'nullable|string|max:255',
            'category' => 'nullable|string|max:100',
            'tags' => 'nullable|array',
            'status' => 'nullable|string|max:50',
            'featured' => 'nullable|boolean',
            'thumbnail' => 'nullable|string|max:2048',
        ]);
        if (($validated['status'] ?? null) === 'published' && !$post->published_at) {
            $validated['published_at'] = now();
        }
        $post->update($validated);

        return response()->json(['success' => true, 'post' => $post]);
    }

    public function destroy(Request $request, $id)
    {
        $this->ensureAdmin($request);
        AdminBlogPost::findOrFail($id)->delete();

        return response()->json(['success' => true]);
    }

    private function ensureAdmin(Request $request)
    {
        $user = $request->user();
        abort_unless($user && $user->role === 'admin', 403, 'Accès administrateur requis.');
        return $user;
    }
}
