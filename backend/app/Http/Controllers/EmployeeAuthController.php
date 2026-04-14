<?php

namespace App\Http\Controllers;

use App\Models\Employee;
use Illuminate\Http\Request;
use Illuminate\Http\JsonResponse;
use Illuminate\Support\Facades\Hash;
use Illuminate\Validation\ValidationException;

class EmployeeAuthController extends Controller
{
    /**
     * Connexion d'un employé
     */
    public function login(Request $request): JsonResponse
    {
        $request->validate([
            'email' => 'nullable|string',
            'login_id' => 'nullable|string',
            'password' => 'required|string',
        ]);

        $identifier = $request->string('email')->toString() ?: $request->string('login_id')->toString();
        $employee = Employee::where('email', $identifier)
            ->orWhere('login_id', $identifier)
            ->first();

        if (!$employee || !Hash::check($request->password, $employee->password)) {
            throw ValidationException::withMessages([
                'email' => ['Les identifiants fournis sont incorrects.'],
            ]);
        }

        if (!$employee->is_active) {
            throw ValidationException::withMessages([
                'email' => ['Ce compte est désactivé.'],
            ]);
        }

        // Mettre à jour la dernière connexion
        $employee->update(['last_login_at' => now()]);

        // Créer un token Sanctum pour l'employé
        $token = $employee->createToken('employee-token')->plainTextToken;

        return response()->json([
            'success' => true,
            'data' => [
                'employee' => $employee,
                'token' => $token,
            ],
            'message' => 'Connexion réussie'
        ]);
    }

    /**
     * Déconnexion d'un employé
     */
    public function logout(Request $request): JsonResponse
    {
        $request->user()->tokens()->delete();

        return response()->json([
            'success' => true,
            'message' => 'Déconnexion réussie'
        ]);
    }

    /**
     * Obtenir les informations de l'employé connecté
     */
    public function me(Request $request): JsonResponse
    {
        return response()->json([
            'success' => true,
            'data' => $request->user()
        ]);
    }
}
