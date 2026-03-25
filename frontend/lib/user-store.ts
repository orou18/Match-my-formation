// Base de données partagée pour les utilisateurs
let sharedUsers: any[] = [
  {
    id: 1,
    name: 'Student Test',
    email: 'student@match.com',
    password: 'Azerty123!',
    role: 'student'
  },
  {
    id: 2,
    name: 'Creator Test',
    email: 'creator@match.com',
    password: 'Azerty123!',
    role: 'creator'
  },
  {
    id: 3,
    name: 'Admin Test',
    email: 'admin@match.com',
    password: 'Azerty123!',
    role: 'admin'
  }
];

export class UserStore {
  static getUsers() {
    return sharedUsers;
  }
  
  static addUser(user: any) {
    console.log('👤 UserStore - Ajout utilisateur:', user.email);
    sharedUsers.push(user);
    console.log('👤 UserStore - Total utilisateurs:', sharedUsers.length);
  }
  
  static findUserByEmail(email: string) {
    return sharedUsers.find(u => u.email === email);
  }
  
  static findUserById(id: number) {
    return sharedUsers.find(u => u.id === id);
  }
  
  static getNextId() {
    return Math.max(...sharedUsers.map(u => u.id)) + 1;
  }
}
