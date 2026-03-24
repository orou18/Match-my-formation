export interface Employee {
  id: number;
  creator_id: number;
  name: string;
  email: string;
  login_id: string;
  domain: string;
  is_active: boolean;
  last_login_at: string | null;
  created_at: string;
  updated_at: string;
}

export interface CreateEmployeeRequest {
  name: string;
  email: string;
  domain: string;
}

export interface UpdateEmployeeRequest {
  name?: string;
  email?: string;
  domain?: string;
  is_active?: boolean;
}

export interface EmployeeStats {
  total_employees: number;
  active_employees: number;
  inactive_employees: number;
  by_domain: Array<{
    domain: string;
    count: number;
  }>;
}

export interface LoginCredentials {
  login_id: string;
  password: string;
}
