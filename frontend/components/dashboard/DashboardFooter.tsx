import Image from "next/image";
import Link from "next/link";

export default function DashboardFooter() {
  return (
    <footer className="bg-white py-6 md:py-4 border-t border-gray-50">
      <div className="container mx-auto px-6">
        <div className="flex flex-col md:flex-row justify-between items-center gap-6 md:gap-4">
          {/* Brand & Copyright */}
          <div className="flex flex-col md:flex-row items-center gap-3 md:gap-6 text-center md:text-left">
            <div className="relative w-28 h-8 opacity-60 grayscale">
              <Image
                src="/matchmyformation.png"
                alt="Logo"
                fill
                className="object-contain"
              />
            </div>
            <p className="text-gray-400 text-[9px] md:text-[10px] font-bold uppercase tracking-[0.15em] leading-none">
              © 2026 MatchMyFormation
            </p>
          </div>

          {/* Quick Links - S'empilent joliment sur mobile */}
          <div className="flex flex-wrap justify-center gap-x-6 gap-y-2 text-[9px] md:text-[10px] font-black uppercase tracking-widest text-gray-400">
            {["Aide", "Confidentialité", "Contact"].map((link) => (
              <Link
                key={link}
                href="#"
                className="hover:text-primary transition-colors"
              >
                {link}
              </Link>
            ))}
          </div>

          {/* Socials - Centrés sur mobile */}
          <div className="flex gap-3">
            {["facebook", "linkedIn"].map((social) => (
              <div
                key={social}
                className="w-8 h-8 bg-gray-50 rounded-xl flex items-center justify-center cursor-pointer hover:bg-primary/10 group transition-all"
              >
                <Image
                  src={`/${social}.png`}
                  alt={social}
                  width={14}
                  height={14}
                  className="opacity-40 group-hover:opacity-100 transition-opacity"
                />
              </div>
            ))}
          </div>
        </div>
      </div>
    </footer>
  );
}
