import BlogHero from "@/components/blog/BlogHero";
import BlogFilters from "@/components/blog/BlogFilters";
import BlogCard from "@/components/blog/BlogCard";
import NewsletterSection from "@/components/blog/NewsletterSection";

const ARTICLES = [
  {
    title:
      "L'essor du Tourisme Durable au Bénin : Vers un modèle éco-responsable",
    category: "Patrimoine",
    author: "Koffi Mensah",
    date: "11 Fév 2026",
    image:
      "https://images.unsplash.com/photo-1489447068241-b3490214e8f5?q=80&w=2070",
    excerpt:
      "Comment les guides locaux transforment l'expérience touristique en préservant les écosystèmes fragiles de la sous-région.",
  },
  {
    title:
      "Maîtriser l'Art du Storytelling : Captiver son audience en 5 étapes",
    category: "Formation",
    author: "Sarah Touré",
    date: "09 Fév 2026",
    image:
      "https://images.unsplash.com/photo-1516321318423-f06f85e504b3?q=80&w=2070",
    excerpt:
      "Les techniques narratives utilisées par les plus grands guides pour transformer une simple visite en aventure inoubliable.",
  },
  {
    title: "Hôtellerie de Luxe : Les nouveaux standards de l'accueil en 2026",
    category: "Hôtellerie",
    author: "Marc Lefebvre",
    date: "05 Fév 2026",
    image:
      "https://images.unsplash.com/photo-1566073771259-6a8506099945?q=80&w=2070",
    excerpt:
      "Digitalisation, personnalisation extrême et authenticité : ce que les voyageurs fortunés attendent aujourd'hui.",
  },
  {
    title:
      "Gastronomie Africaine : Le levier d'attractivité du tourisme culinaire",
    category: "Restauration",
    author: "Chef Amina",
    date: "02 Fév 2026",
    image:
      "https://images.unsplash.com/photo-1547592166-23ac45744acd?q=80&w=2070",
    excerpt:
      "Pourquoi la cuisine locale est devenue le premier critère de choix pour 40% des touristes internationaux.",
  },
  {
    title: "Exploration : 10 spots méconnus à découvrir absolument cette année",
    category: "Exploration",
    author: "Jean Guide",
    date: "28 Jan 2026",
    image:
      "https://images.unsplash.com/photo-1533105079780-92b9be482077?q=80&w=2070",
    excerpt:
      "Hors des sentiers battus, ces destinations offrent une immersion totale loin du tourisme de masse.",
  },
  {
    title:
      "Digital Nomad : Comment le télétravail change la donne pour les hôtels",
    category: "Technologie",
    author: "Inès B.",
    date: "25 Jan 2026",
    image:
      "https://images.unsplash.com/photo-1522202176988-66273c2fd55f?q=80&w=2070",
    excerpt:
      "Les infrastructures nécessaires pour attirer cette nouvelle clientèle qui voyage tout en travaillant.",
  },
];

export default function BlogPage() {
  return (
    <main className="bg-[#F8FAFB] min-h-screen pb-10">
      <BlogHero />
      <BlogFilters />

      <section className="max-w-7xl mx-auto px-6 py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {ARTICLES.map((art, i) => (
            <BlogCard key={i} article={art} />
          ))}
        </div>

        <div className="mt-16 text-center">
          <button className="px-12 py-5 bg-[#004D40] text-white font-black rounded-2xl shadow-2xl hover:bg-[#F5B743] hover:text-[#004D40] transition-all duration-300 transform hover:scale-105">
            EXPLORER PLUS D&apos;ARTICLES
          </button>
        </div>
      </section>

      <div className="w-full px-0">
        <NewsletterSection />
      </div>
    </main>
  );
}
