# 🗄️ BASE DE DONNÉES ENRICHIE - MATCH MY FORMATION

## 📊 STATISTIQUES DE LA BASE

### 👥 UTILISATEURS
- **122 utilisateurs totaux**
  - 2 administrateurs
  - 20 créateurs de contenu
  - 100 étudiants

### 📚 CONTENU PÉDAGOGIQUE
- **16 cours publiés**
  - 7 catégories différentes
  - 3 niveaux (beginner, intermediate, advanced)
  - Prix de 199.99€ à 599.99€

### 🎥 VIDÉOS ET MODULES
- **80+ modules** (5-10 par cours)
- **400+ vidéos** (3-8 par module)
  - Durée : 5 à 30 minutes
  - Vues : 100 à 5000 par vidéo

### 🏢 ENTREPRISES
- **10 entreprises partenaires**
  - Hôtels de luxe parisiens
  - Restaurants étoilés
  - Palaces et établissements prestige

### 💬 COMMUNAUTÉ
- **200 messages de chat**
- **300+ inscriptions** aux cours
- **5 parcours d'apprentissage**

---

## 🎯 CATÉGORIES DE COURS

### 🍽️ Cuisine (3 cours)
- Techniques de Cuisine Française
- Pâtisserie Professionnelle
- Cuisine Moléculaire

### 🍷 Œnologie (3 cours)
- Initiation à la Dégustation de Vin
- Vins de Bordeaux - Maîtrise
- Vins du Monde

### 🛎️ Service (2 cours)
- Art du Service Restaurant
- Management de Restaurant

### 🏨 Hôtellerie (2 cours)
- Gestion Hôtelière Fondamentale
- Revenue Management Hôtelier

### 🗺️ Tourisme (2 cours)
- Guide Touristique Certifié
- Tourisme Durable

### 📈 Marketing (2 cours)
- Marketing Hôtelier Digital
- Réseaux Sociaux pour l'Hôtellerie

### 🎉 Événementiel (2 cours)
- Organisation d'Événements
- Gestion de Projets Événementiels

---

## 👤 PROFILS UTILISATEURS

### 🔑 IDENTIFIANTS DE TEST
```
Admin: admin@matchmyformation.com / Azerty123!
Créateur: chef@matchmyformation.com / Azerty123!
Étudiant: student1@matchmyformation.com / Azerty123!
```

### 👨‍🍳 CRÉATEURS EXPERTS
- Jean Dupont - Chef étoilé (15 ans d'expérience)
- Sophie Martin - Sommelier (MS en sommellerie)
- Pierre Bernard - Restaurateur (3 restaurants)
- Marie Dubois - Directrice d'hhôtel (Hôtel 5 étoiles)
- ... et 16 autres experts

### 🎓 ÉTUDIANTS DIVERS
- 100 étudiants avec des profils variés
- Progressions aléatoires (0-100%)
- Statuts : active ou completed

---

## 🏆 PARCOURS D'APPRENTISSAGE

### 🍽️ Par Chef Étoilé
- 3 cours de cuisine
- 180 heures de formation
- 1299.99€

### 🍷 Expert en Œnologie
- 3 cours d'œnologie
- 150 heures de formation
- 999.99€

### 🏨 Manager Hôtelier
- 3 cours hôtellerie/service
- 165 heures de formation
- 1399.99€

### 🌍 Tourisme Durable
- 2 cours tourisme
- 90 heures de formation
- 699.99€

### 📱 Marketing Hôtelier Digital
- 2 cours marketing
- 85 heures de formation
- 699.99€

---

## 💰 DONNÉES FINANCIÈRES

### 📈 REVENUS POTENTIELS
- **Cours individuels** : 4 799.84€ (si tous vendus)
- **Parcours complets** : 5 098.95€ (si tous vendus)
- **Total potentiel** : 9 898.79€

### 🎯 TARIFICATION
- **Cours débutants** : 199.99€ - 299.99€
- **Cours intermédiaires** : 349.99€ - 449.99€
- **Cours avancés** : 499.99€ - 599.99€
- **Parcours** : 699.99€ - 1 399.99€

---

## 🔧 TECHNIQUES DE BASE DE DONNÉES

### 📋 TABLES CRÉÉES
- `users` - Utilisateurs et rôles
- `companies` - Entreprises partenaires
- `courses` - Cours et contenu
- `modules` - Modules par cours
- `videos` - Vidéos par module
- `enrollments` - Inscriptions aux cours
- `pathways` - Parcours d'apprentissage
- `chat_messages` - Messages entre utilisateurs
- `creator_profiles` - Profils détaillés des créateurs

### 🔗 RELATIONS
- Users → Courses (Many-to-Many via enrollments)
- Courses → Modules (One-to-Many)
- Modules → Videos (One-to-Many)
- Users → Chat Messages (One-to-Many)
- Users → Creator Profiles (One-to-One)

---

## 🚀 UTILISATION

### 📦 INSTALLATION
```bash
# Exécuter les migrations
php artisan migrate

# Lancer le seeder enrichi
php artisan db:seed --class=EnhancedDatabaseSeeder
```

### 🎯 RÉSULTATS
- Base de données complète et fonctionnelle
- Contenu riche et varié
- Données réalistes pour tests
- Prête pour production

---

## 📈 MÉTRIQUES CLÉ

- **122 utilisateurs** actifs
- **16 cours** publiés
- **80+ modules** disponibles
- **400+ vidéos** de contenu
- **300+ inscriptions** en cours
- **200 messages** échangés
- **5 parcours** d'apprentissage
- **10 entreprises** partenaires

**Votre base de données est maintenant enrichie et prête à enrichir votre site !** 🎉
