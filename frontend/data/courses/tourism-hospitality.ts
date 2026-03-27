export interface Course {
  id: string;
  title: string;
  description: string;
  category: string;
  level: "Débutant" | "Intermédiaire" | "Avancé" | "Expert";
  duration: string;
  price: number;
  image: string;
  instructor: {
    name: string;
    bio: string;
    avatar: string;
    expertise: string[];
  };
  modules: Module[];
  prerequisites: string[];
  learningOutcomes: string[];
  targetAudience: string[];
  certification: boolean;
  language: string;
  subtitles: string[];
  rating: number;
  students: number;
  reviews: number;
  lastUpdated: string;
  tags: string[];
}

export interface Module {
  id: string;
  title: string;
  description: string;
  duration: string;
  lessons: Lesson[];
  resources: Resource[];
}

export interface Lesson {
  id: string;
  title: string;
  description: string;
  duration: string;
  videoUrl?: string;
  type: "video" | "reading" | "quiz" | "assignment";
  order: number;
}

export interface Resource {
  id: string;
  title: string;
  type: "pdf" | "link" | "template" | "tool";
  url: string;
  description: string;
}

// Cours 1: Management de l'Hôtellerie de Luxe
export const luxuryHotelManagement: Course = {
  id: "luxury-hotel-management",
  title: "Management de l'Hôtellerie de Luxe",
  description:
    "Maîtrisez les stratégies de gestion hôtelière haut de gamme et développez une expertise dans l'industrie du luxe. Ce cours complet vous formera aux meilleures pratiques mondiales en matière d'opérations hôtelières, de service client et de management stratégique.",
  category: "Management Hôtelier",
  level: "Avancé",
  duration: "12h",
  price: 299,
  image: "/courses/luxury-hotel-management.jpg",
  instructor: {
    name: "Marie Dubois",
    bio: "Directrice générale avec 15 ans d'expérience dans les hôtels 5 étoiles. Formée à l'École Hôtelière de Lausanne, elle a géré des établissements prestigieux à Paris, Monaco et Dubaï.",
    avatar: "/instructors/marie-dubois.jpg",
    expertise: [
      "Management Hôtelier",
      "Service Client",
      "Stratégie de Luxe",
      "Opérations",
    ],
  },
  modules: [
    {
      id: "module-1",
      title: "Introduction au Management Hôtelier de Luxe",
      description:
        "Découvrez les fondamentaux du management dans l'industrie hôtelière de luxe",
      duration: "1h30",
      lessons: [
        {
          id: "lesson-1-1",
          title: "Histoire et Évolution de l'Hôtellerie de Luxe",
          description: "Comprendre les origines et l'évolution du secteur",
          duration: "20 min",
          type: "video",
          order: 1,
        },
        {
          id: "lesson-1-2",
          title: "Standards Internationaux et Certifications",
          description: "Les normes qualité et certifications reconnues",
          duration: "25 min",
          type: "video",
          order: 2,
        },
        {
          id: "lesson-1-3",
          title: "Analyse du Marché du Luxe",
          description: "Tendances actuelles et futures du marché",
          duration: "45 min",
          type: "video",
          order: 3,
        },
      ],
      resources: [
        {
          id: "res-1-1",
          title: "Guide des Standards Hôteliers",
          type: "pdf",
          url: "/resources/hotel-standards.pdf",
          description: "Référentiel complet des standards internationaux",
        },
      ],
    },
    {
      id: "module-2",
      title: "Opérations et Service Client",
      description:
        "Maîtrisez les opérations quotidiennes et l'excellence du service",
      duration: "2h",
      lessons: [
        {
          id: "lesson-2-1",
          title: "Gestion des Réservations et Revenue Management",
          description: "Optimisation des taux d'occupation et des revenus",
          duration: "35 min",
          type: "video",
          order: 1,
        },
        {
          id: "lesson-2-2",
          title: "Service Client d'Excellence",
          description: "Techniques de service et gestion des relations clients",
          duration: "40 min",
          type: "video",
          order: 2,
        },
        {
          id: "lesson-2-3",
          title: "Gestion des Plaintes et Récupération",
          description: "Transformer les expériences négatives en opportunités",
          duration: "25 min",
          type: "video",
          order: 3,
        },
      ],
      resources: [
        {
          id: "res-2-1",
          title: "Template Check-list Service Client",
          type: "template",
          url: "/resources/customer-service-checklist.docx",
          description: "Check-list complète pour l'audit du service client",
        },
      ],
    },
  ],
  prerequisites: [
    "Expérience minimale de 2 ans dans le secteur hôtelier",
    "Connaissances de base en management",
    "Maîtrise de l'anglais professionnel",
  ],
  learningOutcomes: [
    "Maîtriser les opérations hôtelières de luxe",
    "Développer des stratégies de service client exceptionnelles",
    "Optimiser la rentabilité et l'efficacité opérationnelle",
    "Gérer des équipes multiculturelles dans un environnement international",
  ],
  targetAudience: [
    "Directeurs d'hôtels et managers",
    "Professionnels cherchant à évoluer vers le luxe",
    "Entrepreneurs du secteur hôtelier",
    "Étudiants en management hôtelier",
  ],
  certification: true,
  language: "Français",
  subtitles: ["Français", "Anglais", "Espagnol"],
  rating: 4.8,
  students: 1234,
  reviews: 89,
  lastUpdated: "2024-03-01",
  tags: ["Management", "Luxe", "Hôtellerie", "Service Client", "Opérations"],
};

// Cours 2: Écotourisme et Développement Durable
export const ecotourismSustainable: Course = {
  id: "ecotourism-sustainable",
  title: "Écotourisme et Développement Durable en Afrique",
  description:
    "Initiatives éco-responsables dans le tourisme africain. Apprenez à concevoir et gérer des projets touristiques durables qui respectent l'environnement et les communautés locales tout en étant économiquement viables.",
  category: "Écotourisme",
  level: "Intermédiaire",
  duration: "8h",
  price: 199,
  image: "/courses/ecotourism-africa.jpg",
  instructor: {
    name: "Jean-Pierre N'Diaye",
    bio: "Consultant en tourisme durable avec 12 ans d'expérience en développement de projets écotouristiques en Afrique de l'Ouest. Spécialiste en tourisme communautaire et conservation de la biodiversité.",
    avatar: "/instructors/jean-pierre-ndiaye.jpg",
    expertise: [
      "Écotourisme",
      "Développement Durable",
      "Tourisme Communautaire",
      "Conservation",
    ],
  },
  modules: [
    {
      id: "module-1",
      title: "Fondements de l'Écotourisme",
      description: "Comprendre les principes et concepts clés de l'écotourisme",
      duration: "1h45",
      lessons: [
        {
          id: "lesson-1-1",
          title: "Définitions et Principes de l'Écotourisme",
          description:
            "Les concepts fondamentaux et les différences avec le tourisme traditionnel",
          duration: "30 min",
          type: "video",
          order: 1,
        },
        {
          id: "lesson-1-2",
          title: "Biodiversité et Conservation",
          description:
            "L'importance de la biodiversité dans les projets écotouristiques",
          duration: "35 min",
          type: "video",
          order: 2,
        },
        {
          id: "lesson-1-3",
          title: "Tourisme Communautaire",
          description: "Impliquer et bénéficier aux communautés locales",
          duration: "40 min",
          type: "video",
          order: 3,
        },
      ],
      resources: [
        {
          id: "res-1-1",
          title: "Guide Certification Écotourisme",
          type: "pdf",
          url: "/resources/ecotourism-certification.pdf",
          description: "Les certifications internationales en écotourisme",
        },
      ],
    },
  ],
  prerequisites: [
    "Intérêt pour l'environnement et le développement durable",
    "Connaissances de base en tourisme",
    "Sensibilité aux cultures africaines",
  ],
  learningOutcomes: [
    "Concevoir des projets écotouristiques viables",
    "Évaluer l'impact environnemental et social",
    "Développer des stratégies de conservation",
    "Créer des bénéfices économiques pour les communautés locales",
  ],
  targetAudience: [
    "Professionnels du tourisme",
    "Agents de développement local",
    "Gestionnaires d'aires protégées",
    "Étudiants en tourisme et environnement",
  ],
  certification: true,
  language: "Français",
  subtitles: ["Français", "Anglais"],
  rating: 4.6,
  students: 856,
  reviews: 67,
  lastUpdated: "2024-02-28",
  tags: [
    "Écotourisme",
    "Développement Durable",
    "Afrique",
    "Conservation",
    "Communautaire",
  ],
};

// Cours 3: Digitalisation du Parcours Client
export const digitalCustomerJourney: Course = {
  id: "digital-customer-journey",
  title: "Digitalisation du Parcours Client (IA & Data)",
  description:
    "IA et Data pour optimiser l'expérience client. Transformez votre approche client avec les technologies digitales, l'intelligence artificielle et l'analyse de données pour créer des expériences personnalisées et mémorables.",
  category: "Digital & Tech",
  level: "Avancé",
  duration: "10h",
  price: 349,
  image: "/courses/digital-customer-journey.jpg",
  instructor: {
    name: "Sophie Martin",
    bio: "Expert en transformation digitale et intelligence artificielle avec 10 ans d'expérience dans l'optimisation de l'expérience client. Ancienne consultante chez McKinsey Digital, spécialisée dans les secteurs tourisme et luxe.",
    avatar: "/instructors/sophie-martin.jpg",
    expertise: [
      "IA",
      "Data Analytics",
      "Customer Experience",
      "Digital Transformation",
    ],
  },
  modules: [
    {
      id: "module-1",
      title: "Fondamentaux du Digital et de l'IA",
      description:
        "Introduction aux technologies digitales et à l'IA appliquées au tourisme",
      duration: "2h",
      lessons: [
        {
          id: "lesson-1-1",
          title: "Transformation Digitale du Secteur Touristique",
          description:
            "L'impact du digital sur les modèles d'affaires touristiques",
          duration: "40 min",
          type: "video",
          order: 1,
        },
        {
          id: "lesson-1-2",
          title: "Introduction à l'IA et au Machine Learning",
          description: "Concepts fondamentaux et applications pratiques",
          duration: "45 min",
          type: "video",
          order: 2,
        },
        {
          id: "lesson-1-3",
          title: "Data Analytics et Business Intelligence",
          description:
            "Utiliser les données pour prendre de meilleures décisions",
          duration: "35 min",
          type: "video",
          order: 3,
        },
      ],
      resources: [
        {
          id: "res-1-1",
          title: "Glossaire IA et Data",
          type: "pdf",
          url: "/resources/ai-data-glossary.pdf",
          description: "Terminologie essentielle en IA et analyse de données",
        },
      ],
    },
  ],
  prerequisites: [
    "Connaissances de base en marketing digital",
    "Familiarité avec les outils analytics",
    "Notions de base en statistiques",
    "Maîtrise de l'anglais technique",
  ],
  learningOutcomes: [
    "Mettre en œuvre des stratégies de digitalisation",
    "Utiliser l'IA pour personnaliser l'expérience client",
    "Analyser et interpréter les données clients",
    "Concevoir des parcours clients omnicanal",
  ],
  targetAudience: [
    "Professionnels du marketing digital",
    "Directeurs marketing et commerciaux",
    "Data analysts et business intelligence",
    "Entrepreneurs du secteur touristique",
  ],
  certification: true,
  language: "Français",
  subtitles: ["Français", "Anglais"],
  rating: 4.9,
  students: 2103,
  reviews: 156,
  lastUpdated: "2024-03-05",
  tags: ["IA", "Data", "Digital", "Customer Experience", "Innovation"],
};

// Cours 4: Revenue Management
export const revenueManagement: Course = {
  id: "revenue-management",
  title: "Revenue Management pour Établissements Touristiques",
  description:
    "Optimisation des revenus pour établissements touristiques. Apprenez les techniques avancées de revenue management pour maximiser la rentabilité de votre établissement hôtelier ou touristique.",
  category: "Revenue Management",
  level: "Expert",
  duration: "15h",
  price: 449,
  image: "/courses/revenue-management.jpg",
  instructor: {
    name: "Thomas Bernard",
    bio: "Revenue Manager expert avec 18 ans d'expérience dans l'optimisation des revenus pour des groupes hôteliers internationnels. Spécialiste en pricing dynamique et distribution électronique.",
    avatar: "/instructors/thomas-bernard.jpg",
    expertise: [
      "Revenue Management",
      "Pricing Strategy",
      "Distribution",
      "Analytics",
    ],
  },
  modules: [
    {
      id: "module-1",
      title: "Stratégies de Pricing et Yield Management",
      description: "Maîtrisez les techniques de tarification dynamique",
      duration: "3h",
      lessons: [
        {
          id: "lesson-1-1",
          title: "Fondamentaux du Revenue Management",
          description: "Les concepts clés et principes du RM",
          duration: "45 min",
          type: "video",
          order: 1,
        },
        {
          id: "lesson-1-2",
          title: "Pricing Dynamique et Yield Management",
          description: "Techniques avancées d'optimisation des prix",
          duration: "50 min",
          type: "video",
          order: 2,
        },
        {
          id: "lesson-1-3",
          title: "Forecasting et Prévision de la Demande",
          description: "Méthodes de prévision et analyse des tendances",
          duration: "45 min",
          type: "video",
          order: 3,
        },
      ],
      resources: [
        {
          id: "res-1-1",
          title: "Calculateur RM Excel",
          type: "template",
          url: "/resources/rm-calculator.xlsx",
          description: "Outil Excel pour le calcul des indicateurs RM",
        },
      ],
    },
  ],
  prerequisites: [
    "Expérience significative en management hôtelier",
    "Connaissances avancées en Excel",
    "Compétences en analyse financière",
    "Maîtrise des concepts statistiques",
  ],
  learningOutcomes: [
    "Développer des stratégies de pricing optimales",
    "Maîtriser les outils de distribution électronique",
    "Analyser et optimiser les canaux de distribution",
    "Maximiser le RevPAR et la rentabilité globale",
  ],
  targetAudience: [
    "Revenue Managers et Directeurs Commerciaux",
    "Directeurs d'hôtels et établissements touristiques",
    "Analystes financiers du secteur hôtelier",
    "Consultants en optimisation des revenus",
  ],
  certification: true,
  language: "Français",
  subtitles: ["Français", "Anglais"],
  rating: 4.7,
  students: 567,
  reviews: 43,
  lastUpdated: "2024-03-03",
  tags: [
    "Revenue Management",
    "Pricing",
    "Analytics",
    "Distribution",
    "Optimisation",
  ],
};

// Export de tous les cours
export const tourismCourses = [
  luxuryHotelManagement,
  ecotourismSustainable,
  digitalCustomerJourney,
  revenueManagement,
];

// Export par catégorie
export const coursesByCategory = {
  "Management Hôtelier": [luxuryHotelManagement],
  Écotourisme: [ecotourismSustainable],
  "Digital & Tech": [digitalCustomerJourney],
  "Revenue Management": [revenueManagement],
};
