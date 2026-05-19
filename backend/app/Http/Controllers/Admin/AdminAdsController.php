<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\AdminAd;
use Illuminate\Http\Request;

class AdminAdsController extends Controller
{
    public function index(Request $request)
    {
        $this->ensureAdmin($request);
        return response()->json(['success' => true, 'ads' => AdminAd::latest()->get()]);
    }

    public function store(Request $request)
    {
        $user = $this->ensureAdmin($request);
        $ad = AdminAd::create($this->validated($request) + ['created_by' => $user->id]);
        return response()->json(['success' => true, 'ad' => $ad], 201);
    }

    public function update(Request $request, $id)
    {
        $this->ensureAdmin($request);
        $ad = AdminAd::findOrFail($id);
        $ad->update($this->validated($request, true));
        return response()->json(['success' => true, 'ad' => $ad]);
    }

    public function destroy(Request $request, $id)
    {
        $this->ensureAdmin($request);
        AdminAd::findOrFail($id)->delete();
        return response()->json(['success' => true]);
    }

    private function validated(Request $request, bool $partial = false): array
    {
        return $request->validate([
            'title' => ($partial ? 'sometimes' : 'required') . '|string|max:255',
            'description' => 'nullable|string',
            'type' => 'nullable|string|max:50',
            'status' => 'nullable|string|max:50',
            'starts_at' => 'nullable|date',
            'ends_at' => 'nullable|date',
            'budget' => 'nullable|numeric|min:0',
            'target_audience' => 'nullable|string|max:255',
            'image' => 'nullable|string|max:2048',
        ]);
    }

    private function ensureAdmin(Request $request): void
    {
        $user = $request->user();
        abort_unless($user && $user->role === 'admin', 403, 'Accès administrateur requis.');
    }
}
