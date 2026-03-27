// Système de stockage des employés avec persistance

export interface Employee {
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

export class EmployeeStorage {
  private static readonly STORAGE_KEY = "creator_employees";

  // Obtenir tous les employés
  static getEmployees(): Employee[] {
    if (typeof window === "undefined") return [];

    try {
      const stored = localStorage.getItem(this.STORAGE_KEY);
      return stored ? JSON.parse(stored) : this.getDefaultEmployees();
    } catch (error) {
      console.error("Erreur lors de la lecture des employés:", error);
      return this.getDefaultEmployees();
    }
  }

  // Obtenir un employé par ID
  static getEmployeeById(id: number): Employee | null {
    const employees = this.getEmployees();
    return employees.find((emp) => emp.id === id) || null;
  }

  // Ajouter un employé
  static addEmployee(
    employeeData: Omit<
      Employee,
      "id" | "created_at" | "completion_rate" | "progress"
    >
  ): Employee {
    const employees = this.getEmployees();

    // Vérifier si l'email existe déjà
    if (employees.some((emp) => emp.email === employeeData.email)) {
      throw new Error("Cet email est déjà utilisé par un employé");
    }

    const newEmployee: Employee = {
      ...employeeData,
      id: Math.max(...employees.map((e) => e.id), 0) + 1,
      completion_rate: 0,
      progress: 0,
      created_at: new Date().toISOString(),
    };

    employees.push(newEmployee);
    this.saveEmployees(employees);

    return newEmployee;
  }

  // Mettre à jour un employé
  static updateEmployee(
    id: number,
    updates: Partial<Employee>
  ): Employee | null {
    const employees = this.getEmployees();
    const index = employees.findIndex((emp) => emp.id === id);

    if (index === -1) return null;

    employees[index] = { ...employees[index], ...updates };
    this.saveEmployees(employees);

    return employees[index];
  }

  // Supprimer un employé
  static deleteEmployee(id: number): boolean {
    const employees = this.getEmployees();
    const filteredEmployees = employees.filter((emp) => emp.id !== id);

    if (filteredEmployees.length === employees.length) return false;

    this.saveEmployees(filteredEmployees);
    return true;
  }

  // Sauvegarder les employés dans localStorage
  private static saveEmployees(employees: Employee[]): void {
    if (typeof window === "undefined") return;

    try {
      localStorage.setItem(this.STORAGE_KEY, JSON.stringify(employees));
    } catch (error) {
      console.error("Erreur lors de la sauvegarde des employés:", error);
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
        created_at: "2023-01-15T00:00:00Z",
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
        created_at: "2023-03-20T00:00:00Z",
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
        created_at: "2023-02-10T00:00:00Z",
      },
    ];
  }

  // Obtenir les départements uniques
  static getDepartments(): string[] {
    const employees = this.getEmployees();
    return [...new Set(employees.map((emp) => emp.department))];
  }

  // Obtenir les positions uniques
  static getPositions(): string[] {
    const employees = this.getEmployees();
    return [...new Set(employees.map((emp) => emp.position))];
  }

  // Exporter les données
  static exportData(): string {
    const employees = this.getEmployees();
    return JSON.stringify(employees, null, 2);
  }

  // Importer les données
  static importData(jsonData: string): boolean {
    try {
      const employees = JSON.parse(jsonData);
      if (Array.isArray(employees)) {
        this.saveEmployees(employees);
        return true;
      }
      return false;
    } catch (error) {
      console.error("Erreur lors de l'importation des données:", error);
      return false;
    }
  }
}
