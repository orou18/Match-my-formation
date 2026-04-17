<?php

namespace App\Http\Controllers;

use App\Models\Employee;
use App\Models\User;
use Illuminate\Http\Request;
use Illuminate\Http\JsonResponse;
use Illuminate\Support\Facades\Mail;
use Illuminate\Support\Facades\Log;

class EmployeeAccessController extends Controller
{
    /**
     * Envoyer les accès à un employé
     */
    public function sendAccess(Request $request, $employeeId): JsonResponse
    {
        $creator = auth()->user();
        
        if (!$creator || $creator->role !== 'creator') {
            return response()->json([
                'success' => false,
                'message' => 'Accès non autorisé'
            ], 403);
        }

        $employee = Employee::where('id', $employeeId)
                           ->where('creator_id', $creator->id)
                           ->first();

        if (!$employee) {
            return response()->json([
                'success' => false,
                'message' => 'Employé non trouvé'
            ], 404);
        }

        try {
            // Générer un token temporaire si nécessaire
            $tempToken = $this->generateTempToken($employee);
            
            // URL de connexion employé
            $loginUrl = config('app.frontend_url', 'http://localhost:3000') . 
                       '/fr/login-employee?token=' . $tempToken;

            // Envoyer l'email
            Mail::raw($this->buildEmailContent($employee, $loginUrl), function ($message) use ($employee) {
                $message->to($employee->email)
                       ->subject('Accès à votre espace de formation')
                       ->from($employee->creator->email, $employee->creator->name);
            });

            return response()->json([
                'success' => true,
                'message' => 'Accès envoyé avec succès',
                'data' => [
                    'login_url' => $loginUrl,
                    'employee_email' => $employee->email,
                    'sent_at' => now()
                ]
            ]);

        } catch (\Exception $e) {
            Log::error('Erreur envoi accès employé: ' . $e->getMessage());
            
            return response()->json([
                'success' => false,
                'message' => 'Erreur lors de l\'envoi des accès',
                'error' => $e->getMessage()
            ], 500);
        }
    }

    /**
     * Générer un token temporaire
     */
    private function generateTempToken(Employee $employee): string
    {
        return base64_encode(json_encode([
            'employee_id' => $employee->id,
            'email' => $employee->email,
            'expires_at' => now()->addDays(7)->timestamp
        ]));
    }

    /**
     * Construire le contenu de l'email
     */
    private function buildEmailContent(Employee $employee, string $loginUrl): string
    {
        $creatorName = $employee->creator->name;
        $employeeName = $employee->name;
        $loginEmail = $employee->email;
        $loginPassword = $employee->password; // En réalité, il faudrait régénérer ou afficher le mot de passe initial

        return "Bonjour {$employeeName},

Vous avez été invité à rejoindre l'espace de formation de {$creatorName}.

Accès à votre espace :
URL de connexion : {$loginUrl}
Email : {$loginEmail}
Mot de passe : {$loginPassword}

Cet espace vous donnera accès à toutes les formations et vidéos créées par {$creatorName}.

Si vous avez des questions, n'hésitez pas à contacter votre formateur.

Cordialement,
L'équipe de Match My Formation";
    }

    /**
     * Générer un QR code pour l'accès rapide
     */
    public function generateQRCode(Request $request, $employeeId): JsonResponse
    {
        $creator = auth()->user();
        
        if (!$creator || $creator->role !== 'creator') {
            return response()->json([
                'success' => false,
                'message' => 'Accès non autorisé'
            ], 403);
        }

        $employee = Employee::where('id', $employeeId)
                           ->where('creator_id', $creator->id)
                           ->first();

        if (!$employee) {
            return response()->json([
                'success' => false,
                'message' => 'Employé non trouvé'
            ], 404);
        }

        $loginUrl = config('app.frontend_url', 'http://localhost:3000') . 
                   '/fr/login-employee';

        return response()->json([
            'success' => true,
            'data' => [
                'qr_data' => $loginUrl,
                'employee_name' => $employee->name,
                'employee_email' => $employee->email,
                'instructions' => 'Scannez ce QR code pour accéder à votre espace de formation'
            ]
        ]);
    }

    /**
     * Réinitialiser le mot de passe d'un employé
     */
    public function resetPassword(Request $request, $employeeId): JsonResponse
    {
        $creator = auth()->user();
        
        if (!$creator || $creator->role !== 'creator') {
            return response()->json([
                'success' => false,
                'message' => 'Accès non autorisé'
            ], 403);
        }

        $employee = Employee::where('id', $employeeId)
                           ->where('creator_id', $creator->id)
                           ->first();

        if (!$employee) {
            return response()->json([
                'success' => false,
                'message' => 'Employé non trouvé'
            ], 404);
        }

        // Générer un nouveau mot de passe
        $newPassword = Employee::generatePassword();
        $employee->password = Hash::make($newPassword);
        $employee->save();

        return response()->json([
            'success' => true,
            'message' => 'Mot de passe réinitialisé',
            'data' => [
                'new_password' => $newPassword,
                'employee_email' => $employee->email
            ]
        ]);
    }
}
