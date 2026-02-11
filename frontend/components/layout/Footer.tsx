"use client";

import React, { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { IconType } from "react-icons"; // Import du type pour les icônes
import {
  FaFacebookF,
  FaLinkedinIn,
  FaYoutube,
  FaInstagram,
} from "react-icons/fa";

export default function Footer() {
  const [copiedText, setCopiedText] = useState<string | null>(null);

  const handleCopy = (text: string, label: string) => {
    navigator.clipboard.writeText(text);
    setCopiedText(label);
    setTimeout(() => setCopiedText(null), 2000);
  };

  return (
    <footer className="bg-secondary text-white pt-20 pb-10 font-sans border-t border-white/5">
      <div className="max-w-[1440px] mx-auto px-6 lg:px-16">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-16 mb-20">
          <div className="lg:col-span-4">
            <div className="mb-8">
              <Image
                src="/matchmyformation_footer.png"
                alt="Logo"
                width={200}
                height={60}
                className="brightness-110"
              />
            </div>

            <p className="text-mutedText text-[15px] leading-relaxed mb-8 max-w-sm">
              Développez vos compétences avec des formations pratiques,
              certifiantes et accessibles partout en Afrique et dans la
              diaspora.
            </p>

            <div className="flex w-full max-w-sm gap-2">
              <input
                type="email"
                placeholder="Email"
                className="flex-1 bg-white text-gray-900 px-6 py-4 rounded-full text-sm outline-none shadow-inner"
              />

              <button className="bg-primary hover:bg-primary-hover text-white px-8 py-4 rounded-full font-bold text-sm transition-all shadow-md active:scale-95">
                Souscrire
              </button>
            </div>
          </div>

          <div className="lg:col-span-4 grid grid-cols-2 gap-4">
            <div>
              <h3 className="text-xl font-bold mb-8 uppercase tracking-wider text-white/90">
                Navigation
              </h3>

              <ul className="space-y-4 text-mutedText text-[15px]">
                <FooterLink href="/">Accueil</FooterLink>
                <FooterLink href="/formations">Formations</FooterLink>
                <FooterLink href="/a-propos">A propos</FooterLink>
                <FooterLink href="/mon-compte">Mon compte</FooterLink>
              </ul>
            </div>

            <div>
              <h3 className="text-xl font-bold mb-8 uppercase tracking-wider text-white/90">
                Légales
              </h3>

              <ul className="space-y-4 text-mutedText text-[15px]">
                <FooterLink href="/terms">
                  Conditions d&apos;utilisation
                </FooterLink>
                <FooterLink href="/privacy">Confidentialité</FooterLink>
                <FooterLink href="/faq">FAQs</FooterLink>
                <FooterLink href="/contact">Contact</FooterLink>
              </ul>
            </div>
          </div>

          <div className="lg:col-span-4">
            <div className="bg-contactCard p-10 rounded-[35px] relative overflow-hidden h-full border border-white/5 shadow-2xl transition-transform hover:shadow-primary/5">
              <div className="absolute right-[-10px] bottom-[-10px] opacity-10 pointer-events-none">
                <svg width="180" height="180" viewBox="0 0 24 24" fill="white">
                  <path d="M12 3L1 9L12 15L21 10.09V17H23V9L12 3M4.73 11L12 15L19.27 11L12 7L4.73 11Z" />
                </svg>
              </div>

              <h3 className="text-2xl font-bold mb-8 relative z-10">
                Get In Touch
              </h3>

              <ul className="space-y-6 relative z-10">
                <ContactItem
                  icon="✉"
                  text="contact@matchmyformation.com"
                  isCopied={copiedText === "email"}
                  onCopy={() =>
                    handleCopy("contact@matchmyformation.com", "email")
                  }
                />

                <ContactItem
                  icon="💬"
                  text="@matchmyformation"
                  isCopied={copiedText === "social"}
                  onCopy={() => handleCopy("@matchmyformation", "social")}
                />

                <ContactItem
                  icon="📞"
                  text="+229 01 55 00 00 00 00"
                  isCopied={copiedText === "phone"}
                  onCopy={() => handleCopy("+229 01 55 00 00 00 00", "phone")}
                />
              </ul>
            </div>
          </div>
        </div>

        <div className="border-t border-white/10 pt-8 flex flex-col md:flex-row justify-between items-center gap-6 text-[13px] font-medium tracking-wide">
          <p className="text-mutedText uppercase">
            Copyright © 2025. MATCHMYFORMATION
          </p>

          <div className="flex gap-4">
            <SocialBtn Icon={FaFacebookF} />
            <SocialBtn Icon={FaLinkedinIn} />
            <SocialBtn Icon={FaYoutube} />
            <SocialBtn Icon={FaInstagram} />
          </div>
        </div>
      </div>
    </footer>
  );
}

function FooterLink({
  href,
  children,
}: {
  href: string;
  children: React.ReactNode;
}) {
  return (
    <li>
      <Link
        href={href}
        className="hover:text-primary transition-colors duration-300 flex items-center group"
      >
        <span className="w-0 h-[2px] bg-primary transition-all duration-300 group-hover:w-3 mr-0 group-hover:mr-2"></span>
        {children}
      </Link>
    </li>
  );
}

// Interface pour ContactItem pour supprimer le type "any"
interface ContactItemProps {
  icon: string;
  text: string;
  onCopy: () => void;
  isCopied: boolean;
}

function ContactItem({ icon, text, onCopy, isCopied }: ContactItemProps) {
  return (
    <li
      onClick={onCopy}
      title="Cliquez pour copier"
      className="flex items-center gap-4 text-mutedText hover:text-white cursor-pointer group transition-all"
    >
      <span className="text-primary font-bold text-xl group-hover:scale-110 transition-transform">
        {icon}
      </span>

      <div className="flex flex-col">
        <span
          className={`text-[14px] transition-colors ${
            isCopied ? "text-primary font-bold  " : "group-hover:text-primary"
          }`}
        >
          {isCopied ? "Copié !" : text}
        </span>
      </div>
    </li>
  );
}

// Typage correct pour l'icône SocialBtn
function SocialBtn({ Icon }: { Icon: IconType }) {
  return (
    <Link
      href="#"
      className="w-10 h-10 bg-[#004D4D] rounded-full flex items-center justify-center hover:bg-primary transition-all text-white text-lg hover:-translate-y-1 shadow-lg"
    >
      <Icon />
    </Link>
  );
}
