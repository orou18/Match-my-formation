import Image from "next/image";

export default function PremiumBanner() {
  return (
    <div className="relative overflow-hidden bg-gradient-to-r from-[#FFB800] to-[#E58600] rounded-[3rem] p-12 mt-20 flex flex-col md:flex-row items-center justify-between shadow-orange-500/20 shadow-2xl">
      <div className="relative z-10">
        <h2 className="text-4xl font-black text-[#002B24] mb-4">
          Passez au Premium dès aujourd'hui
        </h2>
        <p className="text-[#002B24]/80 text-lg max-w-xl">
          Accédez à toutes les formations certifiantes, contenus exclusifs et
          accompagnement personnalisé pour booster votre carrière.
        </p>
        <div className="flex gap-4 mt-8">
          <button className="bg-[#002B24] text-white px-8 py-4 rounded-2xl font-bold">
            Découvrir Premium
          </button>
          <button className="bg-white text-[#002B24] px-8 py-4 rounded-2xl font-bold shadow-sm">
            En savoir plus
          </button>
        </div>
      </div>

      {/* Sceau Premium Gold à droite */}
      <div className="relative w-64 h-64 opacity-40">
        <Image
          src="/matchmyformation_footer.png"
          alt="Premium Gold Seal"
          fill
          className="object-contain"
        />
      </div>
    </div>
  );
}
