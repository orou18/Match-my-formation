<?php

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;

// Route de test ULTRA minimaliste pour isoler le crash
Route::get('/test', function () {
    return response()->json(['status' => 'ok', 'message' => 'Test endpoint works']);
});

Route::get('/test-db', function () {
    try {
        \DB::connection()->getPdo();
        return response()->json(['status' => 'ok', 'message' => 'DB connection works']);
    } catch (\Exception $e) {
        return response()->json(['status' => 'error', 'message' => $e->getMessage()]);
    }
});
