"use client";

import { useEffect, useState } from "react";
import { CreditCard, Download, Plus } from "lucide-react";
import {
  studentProfileApi,
  type StudentBillingPayload,
} from "@/lib/services/student-profile-api";

export default function BillingPage() {
  const [billing, setBilling] = useState<StudentBillingPayload | null>(null);

  useEffect(() => {
    const loadBilling = async () => {
      try {
        setBilling(await studentProfileApi.getBilling());
      } catch {
        // Keep empty state if billing is unavailable.
      }
    };

    loadBilling();
  }, []);

  const transactions = billing?.transactions || [];
  const paymentMethod = billing?.paymentMethod || {
    brand: "VISA",
    maskedNumber: "4242",
    expiresAt: "12/27",
  };

  return (
    <div className="w-full min-w-0 space-y-8">
      <h1 className="text-3xl font-black text-[#002B24]">Facturation</h1>

      <div className="bg-gradient-to-br from-[#004D40] to-[#002B24] rounded-[2.5rem] p-10 text-white shadow-xl flex flex-col gap-8 lg:flex-row lg:items-center lg:justify-between overflow-hidden relative">
        <div className="absolute -right-10 -bottom-10 opacity-10">
          <CreditCard size={250} />
        </div>
        <div className="relative z-10">
          <p className="text-xs font-black uppercase tracking-[0.3em] opacity-60 mb-8">
            Méthode de paiement
          </p>
          <div className="flex items-center gap-6">
            <div className="w-16 h-10 bg-white/10 backdrop-blur-md rounded-lg flex items-center justify-center border border-white/20">
              <span className="font-bold italic">{paymentMethod.brand}</span>
            </div>
            <div>
              <p className="font-black tracking-widest text-lg">
                •••• •••• •••• {paymentMethod.maskedNumber}
              </p>
              <p className="text-xs opacity-60 uppercase font-bold mt-1">
                Expire le {paymentMethod.expiresAt}
              </p>
            </div>
          </div>
        </div>
        <button className="relative z-10 self-start p-4 bg-white/10 hover:bg-white/20 rounded-2xl transition-all lg:self-auto">
          <Plus size={24} />
        </button>
      </div>

      <div className="bg-white border border-gray-100 rounded-[2.5rem] p-10 shadow-sm">
        <h3 className="font-black text-[#002B24] mb-8 uppercase text-xs tracking-widest">
          Historique des transactions
        </h3>
        <div className="space-y-6">
          {transactions.map((transaction) => (
            <div
              key={transaction.id}
              className="flex items-center justify-between py-4 border-b border-gray-50 last:border-0"
            >
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 bg-gray-50 rounded-xl flex items-center justify-center text-[#004D40]">
                  <Download size={20} />
                </div>
                <div>
                  <p className="font-bold text-[#002B24]">{transaction.label}</p>
                  <p className="text-xs text-gray-400">
                    Payé le{" "}
                    {new Date(transaction.paidAt).toLocaleDateString("fr-FR", {
                      day: "numeric",
                      month: "long",
                      year: "numeric",
                    })}
                  </p>
                </div>
              </div>
              <div className="text-right">
                <p className="font-black text-[#002B24]">
                  {transaction.amount.toFixed(2)} {transaction.currency}
                </p>
                <span className="text-[10px] font-black uppercase text-green-500">
                  {transaction.status === "paid" ? "Succès" : transaction.status}
                </span>
              </div>
            </div>
          ))}

          {transactions.length === 0 ? (
            <p className="text-sm text-gray-500">
              Aucune transaction disponible pour le moment.
            </p>
          ) : null}
        </div>
      </div>
    </div>
  );
}
