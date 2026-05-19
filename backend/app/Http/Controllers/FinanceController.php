<?php

namespace App\Http\Controllers;

use App\Models\FinancialTransaction;
use Illuminate\Http\Request;
use Illuminate\Support\Str;

class FinanceController extends Controller
{
    public function balance(Request $request)
    {
        $user = $request->user();
        abort_unless($user, 401, 'Unauthorized');

        $transactions = FinancialTransaction::where('user_id', $user->id)->latest()->get();
        $balance = $transactions->where('status', 'completed')->sum(function ($transaction) {
            return in_array($transaction->type, ['credit', 'refund'], true)
                ? (float) $transaction->amount
                : -(float) $transaction->amount;
        });

        return response()->json([
            'success' => true,
            'balance' => round($balance, 2),
            'currency' => 'EUR',
            'lastUpdated' => now()->toISOString(),
            'transactions' => $transactions,
        ]);
    }

    public function process(Request $request)
    {
        $user = $request->user();
        abort_unless($user, 401, 'Unauthorized');

        $validated = $request->validate([
            'courseId' => 'nullable|integer',
            'videoId' => 'nullable|integer|exists:videos,id',
            'amount' => 'required|numeric|min:0',
            'currency' => 'nullable|string|size:3',
            'paymentMethodId' => 'nullable|string|max:255',
        ]);

        $transaction = FinancialTransaction::create([
            'reference' => (string) Str::uuid(),
            'user_id' => $user->id,
            'video_id' => $validated['videoId'] ?? null,
            'type' => 'purchase',
            'amount' => $validated['amount'],
            'currency' => $validated['currency'] ?? 'EUR',
            'status' => 'pending',
            'payment_provider' => 'manual',
            'provider_reference' => $validated['paymentMethodId'] ?? null,
            'payload' => $validated,
        ]);

        return response()->json([
            'success' => true,
            'message' => 'Transaction enregistrée en attente de fournisseur de paiement',
            'transactionId' => $transaction->reference,
            'transaction' => $transaction,
        ], 202);
    }

    public function paymentMethods(Request $request)
    {
        abort_unless($request->user(), 401, 'Unauthorized');

        return response()->json([
            'success' => true,
            'methods' => [],
            'message' => 'Aucune méthode de paiement tokenisée enregistrée.',
        ]);
    }
}
