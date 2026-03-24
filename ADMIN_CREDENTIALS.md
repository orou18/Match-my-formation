# 🔐 **IDENTIFIANTS DE CONNEXION ADMIN**

## 👤 **COMPTES ADMINISTRATEURS DISPONIBLES**

### **1. Admin Principal**
```
📧 Email: admin@matchmyformation.com
🔑 Mot de passe: Azerty123!
👤 Nom: Admin Principal
🎯 Rôle: admin
✅ Email vérifié: Oui
```

### **2. Admin Secondaire**
```
📧 Email: marie.laurent@matchmyformation.com
🔑 Mot de passe: Azerty123!
👤 Nom: Marie Laurent
🎯 Rôle: admin
✅ Email vérifié: Oui
```

---

## 🚀 **ACCÈS AU DASHBOARD ADMIN**

### **URL d'accès**
```
🌐 http://localhost:3000/fr/dashboard/admin/enhanced
```

### **Étapes de connexion**
1. **Ouvrir le navigateur**
2. **Aller à l'URL**: `http://localhost:3000/fr/login`
3. **Utiliser les identifiants** ci-dessus
4. **Redirection automatique** vers le dashboard admin

---

## 🎯 **AUTRES COMPTES DISPONIBLES**

### **Créateurs (20 comptes)**
```
📧 chef@matchmyformation.com          🔑 Azerty123!
📧 sommelier@matchmyformation.com     🔑 Azerty123!
📧 restaurant@matchmyformation.com   🔑 Azerty123!
📧 hotel@matchmyformation.com        🔑 Azerty123!
📧 barman@matchmyformation.com       🔑 Azerty123!
... (et 15 autres)
```

### **Étudiants (50 comptes)**
```
Format: etudiant{1..50}@matchmyformation.com
Mot de passe: Azerty123!
```

---

## 🔧 **CONFIGURATION REQUISE**

### **1. Base de données**
```bash
# Lancer le seeder
php artisan db:seed --class=EnhancedDatabaseSeeder
```

### **2. Variables d'environnement**
```env
NEXTAUTH_URL=http://localhost:3000
NEXTAUTH_SECRET=votre_secret_key
```

### **3. Démarrage des serveurs**
```bash
# Backend Laravel
php artisan serve

# Frontend Next.js
npm run dev
```

---

## 🎉 **ACCÈS DIRECT**

### **Dashboard Admin Amélioré**
```
🔗 http://localhost:3000/fr/dashboard/admin/enhanced
👤 Utiliser: admin@matchmyformation.com
🔑 Mot de passe: Azerty123!
```

### **Dashboard Creator**
```
🔗 http://localhost:3000/fr/dashboard/creator/enhanced
👤 Utiliser: chef@matchmyformation.com
🔑 Mot de passe: Azerty123!
```

---

## ⚠️ **NOTES IMPORTANTES**

### **🔐 Sécurité**
- **Mot de passe par défaut**: `Azerty123!`
- **À changer** après première connexion
- **Email vérifié** automatiquement dans le seeder

### **🎯 Rôles**
- **admin**: Accès complet au dashboard admin
- **creator**: Accès au dashboard creator
- **student**: Accès au dashboard student

### **🔄 Redirection**
- **Admin** → `/dashboard/admin/enhanced`
- **Creator** → `/dashboard/creator/enhanced`
- **Student** → `/dashboard/student`

---

## 🚀 **PRÊT À UTILISER !**

**Utilisez ces identifiants pour accéder à tous les dashboards améliorés avec les nouvelles fonctionnalités !** ✨

### **Accès rapide admin**
```
📧 admin@matchmyformation.com
🔑 Azerty123!
🔗 http://localhost:3000/fr/dashboard/admin/enhanced
```
