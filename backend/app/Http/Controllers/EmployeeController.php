<?php

namespace App\Http\Controllers;

use App\Models\Employee;
use Illuminate\Http\Request;
use Illuminate\Http\JsonResponse;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Hash;
use Illuminate\Validation\Rule;

class EmployeeController extends Controller
{
    /**
     * Lister les employés du créateur connecté
     */
    public function index(): JsonResponse
    {
        $employees = Employee::where('creator_id', Auth::id())
            ->orderBy('created_at', 'desc')
            ->get();

        return response()->json([
            'success' => true,
            'data' => $employees
        ]);
    }

    /**
     * Créer un nouvel employé
     */
    public function store(Request $request): JsonResponse
    {
        $validated = $request->validate([
            'name' => 'required|string|max:255',
            'email' => 'required|email|unique:employees,email,NULL,NULL,creator_id,' . Auth::id(),
            'domain' => 'required|string|max:255',
        ]);

        // Générer automatiquement login_id et mot de passe
        $loginId = Employee::generateLoginId();
        $password = Employee::generatePassword();

        $employee = Employee::create([
            'creator_id' => Auth::id(),
            'name' => $validated['name'],
            'email' => $validated['email'],
            'domain' => $validated['domain'],
            'login_id' => $loginId,
            'password' => Hash::make($password),
            'is_active' => true,
        ]);

        return response()->json([
            'success' => true,
            'data' => $employee,
            'login_credentials' => [
                'email' => $employee->email,
                'login_id' => $loginId,
                'password' => $password,
            ],
            'message' => 'Employé créé avec succès'
        ], 201);
    }

    /**
     * Afficher un employé spécifique
     */
    public function show(string $id): JsonResponse
    {
        $employee = Employee::where('creator_id', Auth::id())
            ->where('id', $id)
            ->firstOrFail();

        return response()->json([
            'success' => true,
            'data' => $employee
        ]);
    }

    /**
     * Mettre à jour un employé
     */
    public function update(Request $request, string $id): JsonResponse
    {
        $employee = Employee::where('creator_id', Auth::id())
            ->where('id', $id)
            ->firstOrFail();

        $validated = $request->validate([
            'name' => 'sometimes|string|max:255',
            'email' => [
                'sometimes',
                'email',
                Rule::unique('employees')->where(function ($query) use ($id) {
                    return $query->where('creator_id', Auth::id())
                              ->where('id', '!=', $id);
                })
            ],
            'domain' => 'sometimes|string|max:255',
            'is_active' => 'sometimes|boolean',
        ]);

        $employee->update($validated);

        return response()->json([
            'success' => true,
            'data' => $employee,
            'message' => 'Employé mis à jour avec succès'
        ]);
    }

    /**
     * Supprimer un employé
     */
    public function destroy(string $id): JsonResponse
    {
        $employee = Employee::where('creator_id', Auth::id())
            ->where('id', $id)
            ->firstOrFail();

        $employee->delete();

        return response()->json([
            'success' => true,
            'message' => 'Employé supprimé avec succès'
        ]);
    }

    /**
     * Régénérer les identifiants d'un employé
     */
    public function regenerateCredentials(string $id): JsonResponse
    {
        $employee = Employee::where('creator_id', Auth::id())
            ->where('id', $id)
            ->firstOrFail();

        $newLoginId = Employee::generateLoginId();
        $newPassword = Employee::generatePassword();

        $employee->update([
            'login_id' => $newLoginId,
            'password' => Hash::make($newPassword),
        ]);

        return response()->json([
            'success' => true,
            'data' => $employee,
            'login_credentials' => [
                'email' => $employee->email,
                'login_id' => $newLoginId,
                'password' => $newPassword,
            ],
            'message' => 'Identifiants régénérés avec succès'
        ]);
    }

    /**
     * Obtenir les statistiques des employés
     */
    public function stats(): JsonResponse
    {
        $creatorId = Auth::id();
        
        $totalEmployees = Employee::where('creator_id', $creatorId)->count();
        $activeEmployees = Employee::where('creator_id', $creatorId)->where('is_active', true)->count();
        $byDomain = Employee::where('creator_id', $creatorId)
            ->selectRaw('domain, COUNT(*) as count')
            ->groupBy('domain')
            ->get();

        return response()->json([
            'success' => true,
            'data' => [
                'total_employees' => $totalEmployees,
                'active_employees' => $activeEmployees,
                'inactive_employees' => $totalEmployees - $activeEmployees,
                'by_domain' => $byDomain,
            ]
        ]);
    }
}
