"use client";
import Link from "next/link";
import Image from "next/image";
import { usePathname, useParams } from "next/navigation";
import { User, Shield, Bell, Settings, CreditCard, Star, GraduationCap } from "lucide-react";

export default function ProfileSidebar() {
  const pathname = usePathname();
  const { locale } = useParams();

  const navLinks = [
    { name: "Profil", href: `/${locale}/dashboard/student/profile`, icon: User },
    { name: "Sécurité", href: `/${locale}/dashboard/student/profile/security`, icon: Shield },
    { name: "Notifications", href: `/${locale}/dashboard/student/profile/notifications`, icon: Bell },
    { name: "Préférences", href: `/${locale}/dashboard/student/profile/preferences`, icon: Settings },
    { name: "Facturation", href: `/${locale}/dashboard/student/profile/billing`, icon: CreditCard },
  ];

  return (
    <div className="bg-white rounded-[2.5rem] p-8 shadow-sm border border-gray-50 flex flex-col items-center">
      <div className="relative w-24 h-24 mb-4">
        <Image src="/temoignage.png" alt="Profile" fill className="rounded-full object-cover border-4 border-gray-50" />
      </div>
      
      <h3 className="text-xl font-bold text-[#002B24]">Marc Dubois</h3>
      <div className="mt-2 bg-[#EEF2FF] text-[#4F46E5] px-4 py-1.5 rounded-full flex items-center gap-2 text-xs font-bold">
        <GraduationCap size={14} />
        Apprenant
      </div>

      <nav className="w-full mt-10 space-y-2">
        {navLinks.map((link) => {
          const isActive = pathname === link.href;
          return (
            <Link
              key={link.name}
              href={link.href}
              className={`flex items-center gap-4 px-6 py-4 rounded-2xl transition-all duration-300 group ${
                isActive 
                  ? "bg-[#004D40] text-white shadow-lg shadow-primary/20" 
                  : "text-gray-400 hover:bg-gray-50 hover:text-[#004D40]"
              }`}
            >
              <link.icon size={20} className={isActive ? "text-white" : "group-hover:scale-110 transition-transform"} />
              <span className="text-sm font-bold">{link.name}</span>
            </Link>
          );
        })}
      </nav>

      <button className="w-full mt-8 bg-[#FFF9EB] text-[#D97706] p-4 rounded-2xl flex items-center justify-center gap-3 font-bold text-xs hover:bg-[#FEF3C7] transition-colors">
        <Star size={18} fill="currentColor" />
        Devenir créateur
      </button>
    </div>
  );
}