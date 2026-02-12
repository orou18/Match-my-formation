"use client";
import { Download } from "lucide-react";

export default function PaymentHistory({ invoices }: any) {
  return (
    <div className="bg-white rounded-[2rem] border border-gray-100 shadow-sm overflow-hidden">
      <div className="p-8 border-b border-gray-50">
        <h3 className="text-xl font-black text-[#002B24] tracking-tight">Historique des factures</h3>
      </div>
      <div className="overflow-x-auto">
        <table className="w-full text-left">
          <thead>
            <tr className="bg-gray-50 text-[10px] font-black uppercase tracking-widest text-gray-400">
              <th className="px-8 py-4">Date</th>
              <th className="px-8 py-4">Montant</th>
              <th className="px-8 py-4">Statut</th>
              <th className="px-8 py-4 text-right">Action</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-50">
            {invoices.map((invoice: any) => (
              <tr key={invoice.id} className="hover:bg-gray-50/50 transition-colors group">
                <td className="px-8 py-5 text-sm font-bold text-gray-600">{invoice.date}</td>
                <td className="px-8 py-5 text-sm font-black text-[#002B24]">{invoice.amount} FCFA</td>
                <td className="px-8 py-5">
                  <span className="px-3 py-1 bg-green-100 text-green-600 text-[10px] font-black rounded-full uppercase">
                    Payé
                  </span>
                </td>
                <td className="px-8 py-5 text-right">
                  <button className="p-2 text-gray-400 hover:text-primary transition-colors">
                    <Download size={18} />
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}