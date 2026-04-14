import {
  createStudentAccount,
  findAccountByEmail,
  findAccountById,
  getAccounts,
} from "@/lib/server/account-store";

export class UserStore {
  static getUsers() {
    return getAccounts().map((account) => ({
      id: Number(account.id),
      name: account.name,
      email: account.email,
      password: account.password,
      role: account.role,
      created_at: account.created_at,
    }));
  }

  static addUser(user: { name: string; email: string; password: string }) {
    return createStudentAccount({
      name: String(user.name || ""),
      email: String(user.email || ""),
      password: String(user.password || ""),
    });
  }

  static findUserByEmail(email: string) {
    const account = findAccountByEmail(email);
    if (!account) return undefined;
    return {
      id: Number(account.id),
      name: account.name,
      email: account.email,
      password: account.password,
      role: account.role,
      created_at: account.created_at,
    };
  }

  static findUserById(id: number) {
    const account = findAccountById(String(id));
    if (!account) return undefined;
    return {
      id: Number(account.id),
      name: account.name,
      email: account.email,
      password: account.password,
      role: account.role,
      created_at: account.created_at,
    };
  }

  static getNextId() {
    return Math.max(...this.getUsers().map((u) => u.id), 0) + 1;
  }
}
