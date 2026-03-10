// Configuration des cours premium prédéfinis
export const PREMIUM_COURSES = [
  {
    id: 1,
    title: "Management de Luxe Excellence",
    slug: "management-luxe-excellence",
    description: "Devenez un expert du management dans le secteur du luxe avec cette formation complète.",
    long_description: "Cette formation exclusive vous plongera au cœur de l'industrie du luxe, où vous maîtriserez les techniques de management les plus sophistiquées. De la gestion des équipes à l'expérience client, en passant par la stratégie de marque et le digital, vous développerez une expertise à 360° du secteur premium.",
    thumbnail: "/courses/luxe-thumb.png",
    banner: "/courses/luxe-banner.png",
    price: 299,
    original_price: 499,
    duration: "40 heures",
    level: "advanced" as const,
    category: "luxe" as const,
    instructor: {
      name: "Sophie Dubois",
      title: "Directrice Expérience Client, Four Seasons",
      avatar: "/instructors/sophie-dubois.png",
      bio: "Avec 15 ans d'expérience dans le luxe, Sophie a dirigé des équipes dans les hôtels les plus prestigieux au monde.",
      expertise: ["Management", "Luxe", "Expérience Client", "Stratégie"]
    },
    modules: [
      {
        title: "Fondamentaux du Management de Luxe",
        lessons: [
          { title: "Introduction au secteur du luxe", duration: "45 min", type: "video" as const },
          { title: "Les piliers de l'excellence", duration: "60 min", type: "video" as const },
          { title: "Étude de cas: Ritz Carlton", duration: "30 min", type: "reading" as const }
        ]
      },
      {
        title: "Stratégie de Marque Premium",
        lessons: [
          { title: "Positionnement et differentiation", duration: "55 min", type: "video" as const },
          { title: "Storytelling de luxe", duration: "40 min", type: "video" as const },
          { title: "Exercice: Créer votre marque", duration: "45 min", type: "exercise" as const }
        ]
      },
      {
        title: "Management des Équipes",
        lessons: [
          { title: "Recrutement dans le luxe", duration: "50 min", type: "video" as const },
          { title: "Formation et développement", duration: "45 min", type: "video" as const },
          { title: "Leadership inspirant", duration: "60 min", type: "video" as const }
        ]
      },
      {
        title: "Expérience Client Exceptionnelle",
        lessons: [
          { title: "Les standards du service premium", duration: "55 min", type: "video" as const },
          { title: "Gestion des situations complexes", duration: "40 min", type: "video" as const },
          { title: "Personnalisation à grande échelle", duration: "50 min", type: "video" as const }
        ]
      }
    ],
    features: [
      "Accès à vie au contenu",
      "Certificat de completion",
      "Sessions Q&A mensuelles",
      "Réseau privé d'étudiants",
      "Ressources exclusives",
      "Support prioritaire"
    ],
    certification: true,
    language: "Français",
    rating: 4.9,
    reviews_count: 127,
    enrolled_count: 3420,
    is_featured: true,
    created_at: "2024-01-15"
  },
  {
    id: 2,
    title: "Écotourisme & Développement Durable",
    slug: "ecotourisme-developpement-durable",
    description: "Maîtrisez les enjeux de l'écotourisme et développez des projets touristiques durables.",
    long_description: "Cette formation vous forme aux meilleures pratiques de l'écotourisme, de la conception de projets durables à la gestion environnementale. Vous apprendrez à créer des expériences touristiques qui respectent l'environnement tout en étant économiquement viables.",
    thumbnail: "/courses/ecotourisme-thumb.png",
    banner: "/courses/ecotourisme-banner.png",
    price: 249,
    original_price: 399,
    duration: "35 heures",
    level: "intermediate" as const,
    category: "ecotourisme" as const,
    instructor: {
      name: "Dr. Marc Laurent",
      title: "Consultant en Développement Durable",
      avatar: "/instructors/marc-laurent.png",
      bio: "PhD en environnement et 12 ans d'expérience dans le conseil en tourisme durable à travers le monde.",
      expertise: ["Écotourisme", "Développement Durable", "Environnement", "Consulting"]
    },
    modules: [
      {
        title: "Fondamentaux de l'Écotourisme",
        lessons: [
          { title: "Définition et principes", duration: "40 min", type: "video" as const },
          { title: "Historique et évolution", duration: "35 min", type: "video" as const },
          { title: "Les labels et certifications", duration: "30 min", type: "reading" as const }
        ]
      },
      {
        title: "Conception de Projets Durables",
        lessons: [
          { title: "Analyse d'impact environnemental", duration: "55 min", type: "video" as const },
          { title: "Design d'expériences éco-responsables", duration: "45 min", type: "video" as const },
          { title: "Exercice: Plan de durabilité", duration: "60 min", type: "exercise" as const }
        ]
      },
      {
        title: "Gestion Environnementale",
        lessons: [
          { title: "Réduction de l'empreinte carbone", duration: "50 min", type: "video" as const },
          { title: "Gestion des déchets", duration: "40 min", type: "video" as const },
          { title: "Economie circulaire en tourisme", duration: "45 min", type: "video" as const }
        ]
      }
    ],
    features: [
      "Guide pratique des certifications",
      "Templates pour projets durables",
      "Études de cas internationales",
      "Calculateur d'impact carbone",
      "Certificat spécialisé"
    ],
    certification: true,
    language: "Français",
    rating: 4.8,
    reviews_count: 89,
    enrolled_count: 2150,
    is_featured: true,
    created_at: "2024-01-20"
  },
  {
    id: 3,
    title: "Marketing Digital Touristique",
    slug: "marketing-digital-touristique",
    description: "Maîtrisez les stratégies digitales pour transformer votre activité touristique.",
    long_description: "Cette formation complète vous enseigne toutes les techniques de marketing digital appliquées au tourisme. De la création de contenu virale à l'optimisation des réservations, en passant par l'analyse de données et l'IA, vous deviendrez un expert du marketing touristique digital.",
    thumbnail: "/courses/digital-thumb.png",
    banner: "/courses/digital-banner.png",
    price: 279,
    original_price: 449,
    duration: "38 heures",
    level: "intermediate" as const,
    category: "digital" as const,
    instructor: {
      name: "Julie Martin",
      title: "CMO Digital Tourism Group",
      avatar: "/instructors/julie-martin.png",
      bio: "Spécialiste du marketing digital avec 10 ans d'expérience dans le tourisme, Julie a transformé l'approche digitale de nombreuses marques.",
      expertise: ["Marketing Digital", "Social Media", "SEO/SEA", "Data Analytics"]
    },
    modules: [
      {
        title: "Stratégie de Contenu",
        lessons: [
          { title: "Storytelling digital", duration: "45 min", type: "video" as const },
          { title: "Création de contenu viral", duration: "55 min", type: "video" as const },
          { title: "Exercice: Plan de contenu", duration: "40 min", type: "exercise" as const }
        ]
      },
      {
        title: "Social Media Marketing",
        lessons: [
          { title: "Instagram et TikTok pour le tourisme", duration: "50 min", type: "video" as const },
          { title: "Community management", duration: "40 min", type: "video" as const },
          { title: "Influence marketing", duration: "45 min", type: "video" as const }
        ]
      },
      {
        title: "SEO et Réservations",
        lessons: [
          { title: "Optimisation pour les moteurs", duration: "55 min", type: "video" as const },
          { title: "Google Ads pour le tourisme", duration: "45 min", type: "video" as const },
          { title: "Optimisation du taux de conversion", duration: "50 min", type: "video" as const }
        ]
      },
      {
        title: "Analytics et IA",
        lessons: [
          { title: "Google Analytics avancé", duration: "60 min", type: "video" as const },
          { title: "IA dans le marketing touristique", duration: "45 min", type: "video" as const },
          { title: "Prédictions et tendances", duration: "40 min", type: "video" as const }
        ]
      }
    ],
    features: [
      "Outils d'analyse inclus",
      "Templates de campagnes",
      "Check-lists SEO",
      "Accès à une communauté",
      "Mises à jour régulières"
    ],
    certification: true,
    language: "Français",
    rating: 4.7,
    reviews_count: 156,
    enrolled_count: 3890,
    is_featured: false,
    created_at: "2024-01-25"
  },
  {
    id: 4,
    title: "Revenue Management Avancé",
    slug: "revenue-management-avance",
    description: "Optimisez vos revenus avec les techniques les plus avancées du revenue management.",
    long_description: "Devenez un expert en optimisation des revenus avec cette formation spécialisée. Vous maîtriserez les techniques de pricing dynamique, la gestion des canaux de distribution, l'analyse prédictive et les stratégies de maximisation des revenus dans l'hôtellerie et le tourisme.",
    thumbnail: "/courses/revenue-thumb.png",
    banner: "/courses/revenue-banner.png",
    price: 349,
    original_price: 599,
    duration: "42 heures",
    level: "advanced" as const,
    category: "revenue" as const,
    instructor: {
      name: "Thomas Bernard",
      title: "VP Revenue Management, Accor",
      avatar: "/instructors/thomas-bernard.png",
      bio: "Expert international en revenue management avec 18 ans d'expérience dans les plus grands groupes hôteliers.",
      expertise: ["Revenue Management", "Pricing", "Analytics", "Distribution"]
    },
    modules: [
      {
        title: "Fondamentaux du Revenue Management",
        lessons: [
          { title: "Principes et KPIs", duration: "50 min", type: "video" as const },
          { title: "Analyse de la demande", duration: "45 min", type: "video" as const },
          { title: "Étude de cas: Pricing strategy", duration: "40 min", type: "reading" as const }
        ]
      },
      {
        title: "Pricing Dynamique",
        lessons: [
          { title: "Stratégies de tarification", duration: "55 min", type: "video" as const },
          { title: "Algorithmes et automatisation", duration: "60 min", type: "video" as const },
          { title: "Exercice: Optimisation des prix", duration: "45 min", type: "exercise" as const }
        ]
      },
      {
        title: "Distribution et Canaux",
        lessons: [
          { title: "Gestion des OTA", duration: "50 min", type: "video" as const },
          { title: "Direct vs indirect booking", duration: "40 min", type: "video" as const },
          { title: "Channel management", duration: "45 min", type: "video" as const }
        ]
      },
      {
        title: "Analytics et Prédictions",
        lessons: [
          { title: "Business Intelligence", duration: "55 min", type: "video" as const },
          { title: "Modèles prédictifs", duration: "60 min", type: "video" as const },
          { title: "Tableaux de bord avancés", duration: "45 min", type: "video" as const }
        ]
      }
    ],
    features: [
      "Outils de simulation pricing",
      "Templates d'analyse",
      "Cas pratiques réels",
      "Calculateur d'optimisation",
      "Certificat spécialisé RM"
    ],
    certification: true,
    language: "Français",
    rating: 4.9,
    reviews_count: 94,
    enrolled_count: 1780,
    is_featured: false,
    created_at: "2024-02-01"
  }
];

export default PREMIUM_COURSES;
