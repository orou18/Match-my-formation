"use client";

import { useState, useEffect } from "react";
import { CreditCard, Lock, CheckCircle, AlertCircle, Crown, Zap } from "lucide-react";

interface BankingIntegrationProps {
  courseId: number;
  courseTitle: string;
  isPremium: boolean;
  price: number;
  onPurchaseComplete: (success: boolean, transactionId?: string) => void;
  onEnrollmentComplete: (success: boolean) => void;
}

interface PaymentMethod {
  id: string;
  type: "card" | "paypal" | "stripe" | "bank_transfer";
  last4: string;
  brand: string;
  expiry: string;
  isDefault: boolean;
}

interface Transaction {
  id: string;
  courseId: number;
  amount: number;
  currency: string;
  status: "pending" | "completed" | "failed" | "refunded";
  paymentMethod: string;
  createdAt: string;
  completedAt?: string;
}

export default function BankingIntegration({ 
  courseId, 
  courseTitle, 
  isPremium, 
  price,
  onPurchaseComplete,
  onEnrollmentComplete 
}: BankingIntegrationProps) {
  const [showPaymentModal, setShowPaymentModal] = useState(false);
  const [paymentMethods, setPaymentMethods] = useState<PaymentMethod[]>([]);
  const [selectedPaymentMethod, setSelectedPaymentMethod] = useState<string>("");
  const [isProcessing, setIsProcessing] = useState(false);
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [userBalance, setUserBalance] = useState(0);
  const [promoCode, setPromoCode] = useState("");
  const [promoDiscount, setPromoDiscount] = useState(0);

  useEffect(() => {
    loadUserBalance();
    loadPaymentMethods();
    loadTransactionHistory();
  }, []);

  const loadUserBalance = async () => {
    try {
      const token = localStorage.getItem("token");
      const response = await fetch("/api/user/balance", {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      });

      if (response.ok) {
        const data = await response.json();
        setUserBalance(data.balance || 0);
      }
    } catch (error) {
      console.error("Erreur solde:", error);
    }
  };

  const loadPaymentMethods = async () => {
    try {
      const token = localStorage.getItem("token");
      const response = await fetch("/api/user/payment-methods", {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      });

      if (response.ok) {
        const data = await response.json();
        setPaymentMethods(data.methods || []);
        // Sélectionner la méthode par défaut
        const defaultMethod = data.methods?.find((m: PaymentMethod) => m.isDefault);
        if (defaultMethod) {
          setSelectedPaymentMethod(defaultMethod.id);
        }
      }
    } catch (error) {
      console.error("Erreur méthodes paiement:", error);
    }
  };

  const loadTransactionHistory = async () => {
    try {
      const token = localStorage.getItem("token");
      const response = await fetch("/api/user/transactions", {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      });

      if (response.ok) {
        const data = await response.json();
        setTransactions(data.transactions || []);
      }
    } catch (error) {
      console.error("Erreur transactions:", error);
    }
  };

  const validatePromoCode = async () => {
    if (!promoCode.trim()) return;

    try {
      const response = await fetch("/api/promo/validate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ code: promoCode, courseId }),
      });

      if (response.ok) {
        const data = await response.json();
        setPromoDiscount(data.discount || 0);
      } else {
        setPromoDiscount(0);
      }
    } catch (error) {
      console.error("Erreur promo:", error);
      setPromoDiscount(0);
    }
  };

  const handlePurchase = async () => {
    if (!selectedPaymentMethod) {
      alert("Veuillez sélectionner une méthode de paiement");
      return;
    }

    setIsProcessing(true);

    try {
      const token = localStorage.getItem("token");
      const finalPrice = price * (1 - promoDiscount / 100);

      const response = await fetch("/api/payment/process", {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          courseId,
          amount: finalPrice,
          currency: "EUR",
          paymentMethodId: selectedPaymentMethod,
          promoCode: promoCode || undefined,
        }),
      });

      const data = await response.json();

      if (data.success) {
        onPurchaseComplete(true, data.transactionId);
        setShowPaymentModal(false);
        // Recharger les données après paiement
        await loadUserBalance();
        await loadTransactionHistory();
      } else {
        onPurchaseComplete(false);
        alert(data.message || "Erreur lors du paiement");
      }
    } catch (error) {
      console.error("Erreur paiement:", error);
      onPurchaseComplete(false);
      alert("Erreur lors du traitement du paiement");
    } finally {
      setIsProcessing(false);
    }
  };

  const handleFreeEnrollment = async () => {
    try {
      const token = localStorage.getItem("token");
      const response = await fetch("/api/student/enroll", {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          courseId,
          isPremium: false,
        }),
      });

      const data = await response.json();

      if (data.success) {
        onEnrollmentComplete(true);
      } else {
        onEnrollmentComplete(false);
        alert(data.message || "Erreur lors de l'inscription");
      }
    } catch (error) {
      console.error("Erreur inscription:", error);
      onEnrollmentComplete(false);
      alert("Erreur lors de l'inscription");
    }
  };

  const finalPrice = price * (1 - promoDiscount / 100);

  return (
    <div className="space-y-6">
      {/* Solde utilisateur */}
      <div className="bg-gradient-to-r from-blue-50 to-indigo-50 p-6 rounded-xl border border-blue-200">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="text-lg font-semibold text-gray-900 mb-2">Mon Solde</h3>
            <p className="text-3xl font-bold text-blue-600">
              {new Intl.NumberFormat("fr-FR", {
                style: "currency",
                currency: "EUR",
              }).format(userBalance)}
            </p>
          </div>
          <div className="text-right">
            <button className="text-blue-600 hover:text-blue-800 text-sm font-medium">
              Recharger
            </button>
          </div>
        </div>
      </div>

      {/* Actions principales */}
      {!isPremium ? (
        <div className="bg-green-50 p-6 rounded-xl border border-green-200">
          <div className="flex items-center gap-3 mb-4">
            <CheckCircle className="w-6 h-6 text-green-600" />
            <h3 className="text-lg font-semibold text-green-800">
              Accès Gratuit
            </h3>
          </div>
          <p className="text-gray-600 mb-4">
            Ce cours est disponible gratuitement. Commencez votre apprentissage maintenant !
          </p>
          <button
            onClick={handleFreeEnrollment}
            className="w-full bg-green-600 text-white py-3 px-6 rounded-lg font-semibold hover:bg-green-700 transition-colors"
          >
            S'inscrire gratuitement
          </button>
        </div>
      ) : (
        <div className="bg-gradient-to-r from-yellow-50 to-orange-50 p-6 rounded-xl border border-yellow-200">
          <div className="flex items-center gap-3 mb-4">
            <Crown className="w-6 h-6 text-yellow-600" />
            <h3 className="text-lg font-semibold text-yellow-800">
              Cours Premium
            </h3>
          </div>
          
          <div className="space-y-4">
            {/* Prix et promo */}
            <div className="flex items-center justify-between">
              <div>
                <span className="text-2xl font-bold text-gray-900">
                  {new Intl.NumberFormat("fr-FR", {
                    style: "currency",
                    currency: "EUR",
                  }).format(finalPrice)}
                </span>
                {promoDiscount > 0 && (
                  <span className="ml-2 text-sm text-gray-500 line-through">
                    {new Intl.NumberFormat("fr-FR", {
                      style: "currency",
                      currency: "EUR",
                    }).format(price)}
                  </span>
                )}
              </div>
              <div className="text-right">
                <span className="text-sm text-gray-500">Prix normal: </span>
                <span className="font-semibold">
                  {new Intl.NumberFormat("fr-FR", {
                    style: "currency",
                    currency: "EUR",
                  }).format(price)}
                </span>
              </div>
            </div>

            {/* Code promo */}
            <div className="flex gap-2">
              <input
                type="text"
                placeholder="Code promo"
                value={promoCode}
                onChange={(e) => setPromoCode(e.target.value)}
                className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              />
              <button
                onClick={validatePromoCode}
                className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
              >
                Appliquer
              </button>
            </div>

            {promoDiscount > 0 && (
              <div className="bg-green-100 text-green-800 p-2 rounded-lg text-sm">
                ✅ Code promo appliqué : -{promoDiscount}%
              </div>
            )}

            {/* Méthodes de paiement */}
            <div className="space-y-3">
              <h4 className="font-semibold text-gray-900">Méthode de paiement</h4>
              <div className="grid grid-cols-1 gap-2">
                {paymentMethods.map((method) => (
                  <label
                    key={method.id}
                    className={`flex items-center p-3 border rounded-lg cursor-pointer transition-colors ${
                      selectedPaymentMethod === method.id
                        ? 'border-blue-500 bg-blue-50'
                        : 'border-gray-300 hover:border-gray-400'
                    }`}
                  >
                    <input
                      type="radio"
                      name="paymentMethod"
                      value={method.id}
                      checked={selectedPaymentMethod === method.id}
                      onChange={(e) => setSelectedPaymentMethod(e.target.value)}
                      className="sr-only"
                    />
                    <div className="flex items-center gap-3">
                      <CreditCard className="w-5 h-5" />
                      <div className="flex-1">
                        <div className="font-medium text-gray-900">
                          {method.brand}
                        </div>
                        <div className="text-sm text-gray-500">
                          **** **** **** {method.last4}
                        </div>
                      </div>
                      {method.isDefault && (
                        <span className="bg-blue-100 text-blue-800 text-xs px-2 py-1 rounded">
                          Par défaut
                        </span>
                      )}
                    </div>
                  </label>
                ))}
              </div>

              {/* Ajouter méthode de paiement */}
              <button className="w-full py-2 border-2 border-dashed border-gray-300 rounded-lg text-gray-600 hover:border-gray-400 hover:text-gray-800 transition-colors">
                + Ajouter une méthode de paiement
              </button>
            </div>

            {/* Bouton d'achat */}
            <button
              onClick={handlePurchase}
              disabled={isProcessing || !selectedPaymentMethod}
              className="w-full bg-gradient-to-r from-yellow-500 to-orange-500 text-white py-3 px-6 rounded-lg font-semibold hover:from-yellow-600 hover:to-orange-600 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isProcessing ? (
                <div className="flex items-center gap-2">
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                  Traitement en cours...
                </div>
              ) : (
                <div className="flex items-center gap-2">
                  <Zap className="w-4 h-4" />
                  Acheter maintenant
                </div>
              )}
            </button>
          </div>
        </div>
      )}

      {/* Sécurité paiement */}
      <div className="bg-gray-50 p-4 rounded-lg border border-gray-200">
        <div className="flex items-center gap-2 text-sm text-gray-600">
          <Lock className="w-4 h-4" />
          <span>Paiement sécurisé via SSL 256-bit</span>
        </div>
      </div>

      {/* Historique des transactions */}
      {transactions.length > 0 && (
        <div className="bg-white p-6 rounded-xl border border-gray-200">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Historique des transactions</h3>
          <div className="space-y-2">
            {transactions.slice(0, 5).map((transaction) => (
              <div key={transaction.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                <div>
                  <div className="font-medium text-gray-900">
                    {new Intl.NumberFormat("fr-FR", {
                      style: "currency",
                      currency: "EUR",
                    }).format(transaction.amount)}
                  </div>
                  <div className="text-sm text-gray-500">
                    {new Date(transaction.createdAt).toLocaleDateString("fr-FR")}
                  </div>
                </div>
                <div className={`px-2 py-1 rounded text-xs font-medium ${
                  transaction.status === "completed"
                    ? "bg-green-100 text-green-800"
                    : transaction.status === "pending"
                    ? "bg-yellow-100 text-yellow-800"
                    : transaction.status === "failed"
                    ? "bg-red-100 text-red-800"
                    : "bg-gray-100 text-gray-800"
                }`}>
                  {transaction.status === "completed" && "Complété"}
                  {transaction.status === "pending" && "En cours"}
                  {transaction.status === "failed" && "Échoué"}
                  {transaction.status === "refunded" && "Remboursé"}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
