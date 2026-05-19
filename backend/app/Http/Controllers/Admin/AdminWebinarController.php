<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\AdminWebinar;
use Illuminate\Http\Request;

class AdminWebinarController extends Controller
{
    public function index(Request $request)
    {
        $this->ensureAdmin($request);
        return response()->json(['success' => true, 'webinars' => AdminWebinar::orderBy('starts_at')->get()]);
    }

    public function store(Request $request)
    {
        $user = $this->ensureAdmin($request);
        $webinar = AdminWebinar::create($this->validated($request) + ['created_by' => $user->id]);
        return response()->json(['success' => true, 'webinar' => $webinar], 201);
    }

    public function update(Request $request, $id)
    {
        $this->ensureAdmin($request);
        $webinar = AdminWebinar::findOrFail($id);
        $webinar->update($this->validated($request, true));
        return response()->json(['success' => true, 'webinar' => $webinar]);
    }

    public function destroy(Request $request, $id)
    {
        $this->ensureAdmin($request);
        AdminWebinar::findOrFail($id)->delete();
        return response()->json(['success' => true]);
    }

    private function validated(Request $request, bool $partial = false): array
    {
        return $request->validate([
            'title' => ($partial ? 'sometimes' : 'required') . '|string|max:255',
            'description' => 'nullable|string',
            'speaker' => 'nullable|string|max:255',
            'starts_at' => ($partial ? 'sometimes' : 'required') . '|date',
            'duration_minutes' => 'nullable|integer|min:1',
            'status' => 'nullable|string|max:50',
            'max_participants' => 'nullable|integer|min:0',
            'category' => 'nullable|string|max:100',
            'thumbnail' => 'nullable|string|max:2048',
        ]);
    }

    private function ensureAdmin(Request $request)
    {
        $user = $request->user();
        abort_unless($user && $user->role === 'admin', 403, 'Accès administrateur requis.');
        return $user;
    }
}
