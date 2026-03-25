import { NextRequest, NextResponse } from 'next/server';

// Système de stockage des employés avec persistance
interface Employee {
  id: number;
  name: string;
  email: string;
  phone: string;
  department: string;
  position: string;
  role: "employee" | "manager";
  status: "active" | "inactive";
  hire_date: string;
  completion_rate: number;
  progress: number;
  created_at: string;
  creator_id?: string;
}

class EmployeeStorage {
  private static readonly STORAGE_KEY = 'creator_employees';
  
  // Obtenir tous les employés
  static getEmployees(): Employee[] {
    try {
      const stored = process.env.EMPLOYEES_DATA || '[]';
      return stored ? JSON.parse(stored) : this.getDefaultEmployees();
    } catch (error) {
      console.error('Erreur lors de la lecture des employés:', error);
      return this.getDefaultEmployees();
    }
  }
  
  // Ajouter un employé
  static addEmployee(employeeData: Omit<Employee, 'id' | 'created_at' | 'completion_rate' | 'progress'>): Employee {
    const employees = this.getEmployees();
    
    // Vérifier si l'email existe déjà
    if (employees.some(emp => emp.email === employeeData.email)) {
      throw new Error('Cet email est déjà utilisé par un employé');
    }
    
    const newEmployee: Employee = {
      ...employeeData,
      id: Math.max(...employees.map(e => e.id), 0) + 1,
      completion_rate: 0,
      progress: 0,
      created_at: new Date().toISOString()
    };
    
    employees.push(newEmployee);
    this.saveEmployees(employees);
    
    return newEmployee;
  }
  
  // Sauvegarder les employés (simulation pour l'API)
  private static saveEmployees(employees: Employee[]): void {
    try {
      // En production, sauvegarder dans une vraie base de données
      // Pour l'instant, on simule avec une variable d'environnement
      process.env.EMPLOYEES_DATA = JSON.stringify(employees);
    } catch (error) {
      console.error('Erreur lors de la sauvegarde des employés:', error);
    }
  }
  
  // Obtenir les employés par défaut
  private static getDefaultEmployees(): Employee[] {
    return [
      {
        id: 1,
        name: "Marie Dubois",
        email: "marie.dubois@entreprise.com",
        phone: "+33 6 12 34 56 78",
        department: "Hôtellerie",
        position: "Réceptionniste",
        role: "employee",
        status: "active",
        hire_date: "2023-01-15",
        completion_rate: 85,
        progress: 72,
        created_at: "2023-01-15T00:00:00Z"
      },
      {
        id: 2,
        name: "Jean Martin",
        email: "jean.martin@entreprise.com",
        phone: "+33 6 23 45 67 89",
        department: "Restauration",
        position: "Chef de rang",
        role: "employee",
        status: "active",
        hire_date: "2023-03-20",
        completion_rate: 92,
        progress: 88,
        created_at: "2023-03-20T00:00:00Z"
      },
      {
        id: 3,
        name: "Sophie Bernard",
        email: "sophie.bernard@entreprise.com",
        phone: "+33 6 34 56 78 90",
        department: "Tourisme",
        position: "Guide touristique",
        role: "manager",
        status: "active",
        hire_date: "2023-02-10",
        completion_rate: 78,
        progress: 65,
        created_at: "2023-02-10T00:00:00Z"
      }
    ];
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const {
      name,
      email,
      phone,
      department,
      position,
      role,
      password,
      hire_date,
      status = 'active'
    } = body;

    // Validation des données
    if (!name || !email || !phone || !department || !position || !password) {
      return NextResponse.json(
        { success: false, message: 'Tous les champs obligatoires doivent être remplis' },
        { status: 400 }
      );
    }

    // Validation de l'email
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return NextResponse.json(
        { success: false, message: 'Veuillez entrer une adresse email valide' },
        { status: 400 }
      );
    }

    // Validation du téléphone
    const phoneRegex = /^[+]?[\d\s\-\(\)]+$/;
    if (!phoneRegex.test(phone)) {
      return NextResponse.json(
        { success: false, message: 'Veuillez entrer un numéro de téléphone valide' },
        { status: 400 }
      );
    }

    // Validation du mot de passe
    if (password.length < 8) {
      return NextResponse.json(
        { success: false, message: 'Le mot de passe doit contenir au moins 8 caractères' },
        { status: 400 }
      );
    }

    // Créer le nouvel employé avec persistance
    const newEmployee = EmployeeStorage.addEmployee({
      name,
      email,
      phone,
      department,
      position,
      role: role || 'employee',
      status,
      hire_date
    });

    return NextResponse.json({
      success: true,
      message: 'Employé ajouté avec succès',
      data: newEmployee
    });

  } catch (error) {
    console.error('Add employee error:', error);
    
    // Gérer les erreurs spécifiques
    if (error instanceof Error && error.message.includes('email est déjà utilisé')) {
      return NextResponse.json(
        { success: false, message: error.message },
        { status: 409 }
      );
    }
    
    return NextResponse.json(
      { success: false, message: 'Erreur serveur lors de l\'ajout de l\'employé' },
      { status: 500 }
    );
  }
}

export async function GET(request: NextRequest) {
  try {
    // Récupérer les employés avec persistance
    const employees = EmployeeStorage.getEmployees();

    return NextResponse.json({
      success: true,
      message: 'Employés récupérés avec succès',
      data: employees
    });

  } catch (error) {
    console.error('Get employees error:', error);
    return NextResponse.json(
      { success: false, message: 'Erreur serveur lors de la récupération des employés' },
      { status: 500 }
    );
  }
}
