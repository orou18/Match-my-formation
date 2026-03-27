import { readJsonStore, writeJsonStore } from "@/lib/server/json-store";

type PathwayVideo = {
  id: number;
  title: string;
  description: string;
  duration: string;
  thumbnail: string;
};

export type LearningPathway = {
  id: number;
  title: string;
  description: string;
  domain: string;
  duration_hours: number;
  difficulty_level: string;
  is_active: boolean;
  videos_count: number;
  assigned_employees: number;
  created_at: string;
  videos?: PathwayVideo[];
};

type RecentModule = {
  id: number;
  title: string;
  course: string;
  date: string;
  duration: string;
  type: string;
  completed: boolean;
  score: number | null;
  certificate: {
    earned: boolean;
    downloadUrl: string | null;
  };
};

export type StudentParcours = {
  coursesInProgress: Array<{
    id: number;
    title: string;
    module: string;
    progress: number;
    image: string;
    totalModules: number;
    completedModules: number;
    estimatedTime: string;
    difficulty: string;
    instructor: {
      name: string;
      avatar: string;
      specialty: string;
    };
    nextModule?: {
      title: string;
      duration: string;
      type: string;
    };
  }>;
  recentModules: RecentModule[];
  certifications: Array<{
    id: number;
    title: string;
    description: string;
    date?: string;
    progress?: number;
    status: string;
    score: number | null;
    downloadUrl: string | null;
    issuer: string;
    credentialId: string;
    expiresAt: string | null;
    skills: string[];
    nextMilestone?: {
      title: string;
      date: string;
      type: string;
    };
  }>;
  globalStats: {
    totalCourses: number;
    completedCourses: number;
    inProgressCourses: number;
    totalHours: number;
    completedHours: number;
    averageScore: number;
    streak: number;
    rank: number;
    totalStudents: number;
  };
};

const DEFAULT_PATHWAYS: LearningPathway[] = [
  {
    id: 1,
    title: "Formation Complete Hotellerie",
    description:
      "Parcours complet pour former les employes a tous les aspects de l'hotellerie, de l'accueil a la gestion",
    domain: "Hotellerie",
    duration_hours: 40,
    difficulty_level: "beginner",
    is_active: true,
    videos_count: 12,
    assigned_employees: 25,
    created_at: "2026-03-20T08:00:00.000Z",
    videos: [
      {
        id: 1,
        title: "Introduction a l'hotellerie",
        description: "Decouvrez les bases du metier",
        duration: "15:30",
        thumbnail: "/hotel-intro.jpg",
      },
      {
        id: 2,
        title: "Techniques de service client",
        description: "Apprenez a gerer les clients",
        duration: "22:45",
        thumbnail: "/customer-service.jpg",
      },
    ],
  },
  {
    id: 2,
    title: "Restauration Excellence",
    description:
      "Formation complete en restauration pour les chefs de cuisine et le personnel de restaurant",
    domain: "Restauration",
    duration_hours: 60,
    difficulty_level: "intermediate",
    is_active: true,
    videos_count: 18,
    assigned_employees: 15,
    created_at: "2026-03-19T08:00:00.000Z",
  },
  {
    id: 3,
    title: "Tourisme et Accueil",
    description:
      "Parcours specialise dans l'accueil touristique et la gestion des visites",
    domain: "Tourisme",
    duration_hours: 35,
    difficulty_level: "beginner",
    is_active: true,
    videos_count: 10,
    assigned_employees: 30,
    created_at: "2026-03-18T08:00:00.000Z",
  },
];

const DEFAULT_PARCOURS: StudentParcours = {
  coursesInProgress: [
    {
      id: 1,
      title: "Histoire des sites touristiques du Benin",
      module: "Module 4 sur 8 termine",
      progress: 50,
      image: "/guide1.jpg",
      totalModules: 8,
      completedModules: 4,
      estimatedTime: "12h",
      difficulty: "Intermediaire",
      instructor: {
        name: "Dr. Marie Laurent",
        avatar: "/avatars/creator1.jpg",
        specialty: "Histoire du Tourisme",
      },
      nextModule: {
        title: "Les royaumes d'Abomey",
        duration: "1h30",
        type: "video",
      },
    },
    {
      id: 2,
      title: "Techniques de communication touristique",
      module: "Module 7 sur 10 termine",
      progress: 70,
      image: "/guide2.jpg",
      totalModules: 10,
      completedModules: 7,
      estimatedTime: "15h",
      difficulty: "Avance",
      instructor: {
        name: "Sophie Martin",
        avatar: "/avatars/creator2.jpg",
        specialty: "Communication Touristique",
      },
      nextModule: {
        title: "Gestion des groupes multiculturels",
        duration: "2h",
        type: "interactive",
      },
    },
    {
      id: 3,
      title: "Patrimoine culturel et traditions locales",
      module: "Module 2 sur 6 termine",
      progress: 33,
      image: "/guide1.jpg",
      totalModules: 6,
      completedModules: 2,
      estimatedTime: "8h",
      difficulty: "Debutant",
      instructor: {
        name: "Julie Bernard",
        avatar: "/avatars/creator3.jpg",
        specialty: "Patrimoine Culturel",
      },
      nextModule: {
        title: "Les ceremonies traditionnelles",
        duration: "1h45",
        type: "video",
      },
    },
  ],
  recentModules: [
    {
      id: 1,
      title: "Les palais royaux d'Abomey",
      course: "Histoire des sites touristiques du Benin",
      date: "12 janvier 2026",
      duration: "1h30",
      type: "video",
      completed: true,
      score: 85,
      certificate: {
        earned: true,
        downloadUrl: "/certificates/palais-abomey.pdf",
      },
    },
    {
      id: 2,
      title: "L'art de la narration touristique",
      course: "Techniques de communication touristique",
      date: "11 janvier 2026",
      duration: "2h",
      type: "interactive",
      completed: true,
      score: 92,
      certificate: {
        earned: false,
        downloadUrl: null,
      },
    },
  ],
  certifications: [
    {
      id: 1,
      title: "Certification Guide Touristique Professionnel",
      description:
        "Formation complete sur les techniques de guide touristique professionnel",
      date: "15 decembre 2024",
      status: "Obtenu",
      score: 88,
      downloadUrl: "/certificates/guide-touristique-pro.pdf",
      issuer: "MatchMyFormation",
      credentialId: "MTF-GTP-2024-001",
      expiresAt: null,
      skills: [
        "Communication touristique",
        "Gestion de groupes",
        "Connaissance historique",
        "Secourisme",
      ],
    },
    {
      id: 2,
      title: "Specialisation Patrimoine Culturel",
      description:
        "Approfondissement des connaissances sur le patrimoine culturel beninois",
      progress: 68,
      status: "En cours",
      score: null,
      downloadUrl: null,
      issuer: "MatchMyFormation",
      credentialId: "MTF-SPC-2025-002",
      expiresAt: "2025-12-31",
      skills: [
        "Histoire du Benin",
        "Patrimoine UNESCO",
        "Traditions locales",
        "Mediation culturelle",
      ],
      nextMilestone: {
        title: "Examen final",
        date: "15 fevrier 2026",
        type: "exam",
      },
    },
  ],
  globalStats: {
    totalCourses: 3,
    completedCourses: 0,
    inProgressCourses: 3,
    totalHours: 35,
    completedHours: 15.5,
    averageScore: 85,
    streak: 7,
    rank: 12,
    totalStudents: 1250,
  },
};

const DEFAULT_ASSIGNMENTS: Array<{
  pathway_id: number;
  employee_id: number;
  assigned_at: string;
}> = [];

export function getCreatorPathways() {
  return readJsonStore("creator-pathways.json", DEFAULT_PATHWAYS);
}

export function saveCreatorPathways(pathways: LearningPathway[]) {
  return writeJsonStore("creator-pathways.json", pathways);
}

export function getPathwayAssignments() {
  return readJsonStore("creator-pathway-assignments.json", DEFAULT_ASSIGNMENTS);
}

export function savePathwayAssignments(
  assignments: typeof DEFAULT_ASSIGNMENTS
) {
  return writeJsonStore("creator-pathway-assignments.json", assignments);
}

export function getStudentParcours() {
  return readJsonStore("student-parcours.json", DEFAULT_PARCOURS);
}

export function saveStudentParcours(parcours: StudentParcours) {
  return writeJsonStore("student-parcours.json", parcours);
}
