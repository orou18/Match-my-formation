import { readJsonStore, writeJsonStore } from "@/lib/server/json-store";

const DEFAULT_USERS: any[] = [
  {
    id: 1,
    name: "Student Test",
    email: "student@match.com",
    password: "Azerty123!",
    role: "student",
  },
  {
    id: 2,
    name: "Creator Test",
    email: "creator@match.com",
    password: "Azerty123!",
    role: "creator",
  },
  {
    id: 3,
    name: "Admin Test",
    email: "admin@match.com",
    password: "Azerty123!",
    role: "admin",
  },
];

export class UserStore {
  static getUsers() {
    return readJsonStore("users.json", DEFAULT_USERS);
  }

  static addUser(user: any) {
    console.log("👤 UserStore - Ajout utilisateur:", user.email);
    const users = this.getUsers();
    users.push(user);
    writeJsonStore("users.json", users);
    console.log("👤 UserStore - Total utilisateurs:", users.length);
  }

  static findUserByEmail(email: string) {
    return this.getUsers().find((u) => u.email === email);
  }

  static findUserById(id: number) {
    return this.getUsers().find((u) => u.id === id);
  }

  static getNextId() {
    return Math.max(...this.getUsers().map((u) => u.id), 0) + 1;
  }
}
