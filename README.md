# 🎓 Match My Formation

Plateforme de formation en tourisme avec Laravel 10 (Backend) et Next.js 16 (Frontend)

## 📋 Table des Matières

- [🏗️ Architecture du Projet](#-architecture-du-projet)
- [🚀 Installation Rapide](#-installation-rapide)
- [⚙️ Configuration Détaillée](#️-configuration-détaillée)
- [🔧 Développement](#-développement)
- [🐛 Dépannage](#-dépannage)
- [📚 Structure des Fichiers](#-structure-des-fichiers)
- [🔌 API Endpoints](#-api-endpoints)
- [🎨 Frontend Components](#-frontend-components)

---

## 🏗️ Architecture du Projet

```
Match-my-formation/
├── backend/                    # 🐘 Laravel 10 API
│   ├── app/
│   │   ├── Http/Controllers/   # Contrôleurs API
│   │   ├── Models/            # Modèles Eloquent
│   │   └── Providers/         # Service Providers
│   ├── config/                # Configuration Laravel
│   ├── database/             # Migrations & Seeders
│   ├── routes/               # Routes API
│   └── .env                  # Variables d'environnement
├── frontend/                  # ⚛️ Next.js 16 App
│   ├── app/                  # Pages et layouts
│   ├── components/           # Composants React
│   ├── lib/                 # Utilitaires
│   └── .env                 # Variables frontend
└── README.md                # 📖 Ce fichier
```

---

## 🚀 Installation Rapide

### Prérequis

- **PHP 8.2+** avec extensions : `pdo_mysql`, `mbstring`, `xml`, `curl`
- **Node.js 18+** et **npm**
- **MySQL 8.0+** ou **MariaDB**
- **Composer** (gestionnaire PHP)

### 1. Cloner le Projet

```bash
git clone <votre-repo-url>
cd Match-my-formation
```

### 2. Backend Laravel

```bash
cd backend

# Installer les dépendances PHP
composer install

# Configurer l'environnement
cp .env.example .env  # si .env.example existe
php artisan key:generate

# Configurer la base de données dans .env :
# DB_CONNECTION=mysql
# DB_HOST=127.0.0.1
# DB_PORT=3306
# DB_DATABASE=match_my_formation
# DB_USERNAME=votre_user
# DB_PASSWORD=votre_password

# Lancer les migrations
php artisan migrate

# Démarrer le serveur Laravel
php artisan serve --host=127.0.0.1 --port=8009
```

### 3. Frontend Next.js

```bash
cd ../frontend

# Installer les dépendances Node.js
npm install

# Configurer l'environnement
echo "NEXT_PUBLIC_API_URL=http://127.0.0.1:8009" > .env

# Démarrer le serveur de développement
npm run dev
```

### 4. Accéder à l'Application

- **Frontend** : http://localhost:3000
- **Backend API** : http://127.0.0.1:8009
- **API Documentation** : http://127.0.0.1:8009/api/public/videos

---

## ⚙️ Configuration Détaillée

### Backend (.env)

```bash
# Application
APP_NAME=MatchMyFormation
APP_ENV=local
APP_KEY=base64:votre_clé_générée
APP_DEBUG=true
APP_URL=http://127.0.0.1:8009

# Base de données
DB_CONNECTION=mysql
DB_HOST=127.0.0.1
DB_PORT=3306
DB_DATABASE=match_my_formation
DB_USERNAME=votre_user
DB_PASSWORD=votre_password

# CORS & Sécurité
FRONTEND_URL=http://localhost:3000
SANCTUM_STATEFUL_DOMAINS=localhost:3000,127.0.0.1:3000
SESSION_DOMAIN=localhost

# Cache & Sessions
CACHE_DRIVER=array
SESSION_DRIVER=array
QUEUE_CONNECTION=sync

# Logging
LOG_CHANNEL=stack
LOG_LEVEL=debug
```

### Frontend (.env)

```bash
# API Laravel
NEXT_PUBLIC_API_URL=http://127.0.0.1:8009

# NextAuth (si utilisé)
NEXTAUTH_URL=http://localhost:3000
NEXTAUTH_SECRET=votre_secret_key

# OAuth (optionnel)
GOOGLE_CLIENT_ID=votre_google_id
GOOGLE_CLIENT_SECRET=votre_google_secret
```

---

## 🔧 Développement

### Lancer les Serveurs

**Terminal 1 - Backend :**
```bash
cd backend
php artisan serve --host=127.0.0.1 --port=8009
```

**Terminal 2 - Frontend :**
```bash
cd frontend
npm run dev
```

### Commandes Utiles

**Backend Laravel :**
```bash
# Vider les caches
php artisan config:clear
php artisan cache:clear
php artisan route:clear

# Créer un controller
php artisan make:controller VideoController

# Créer une migration
php artisan make:migration create_videos_table

# Lancer les migrations
php artisan migrate

# Seeder la base de données
php artisan db:seed
```

**Frontend Next.js :**
```bash
# Installer un package
npm install @types/react

# Build de production
npm run build

# Lancer en production
npm start

# Linter le code
npm run lint
```

---

## 🐛 Dépannage

### Problèmes Communs

**1. Erreur "Empty reply from server"**
- ✅ **Déjà corrigé** : Le middleware throttle a été désactivé pour éviter les boucles infinies

**2. Erreur de connexion BDD**
```bash
# Vérifier la configuration
php artisan tinker
>>> DB::connection()->getPdo();
```

**3. CORS Errors**
- Vérifier `FRONTEND_URL` dans le .env backend
- Vérifier que le middleware `HandleCors` est activé

**4. Permissions Laravel**
```bash
# Donner les permissions nécessaires
sudo chown -R $USER:$USER storage bootstrap/cache
sudo chmod -R 775 storage bootstrap/cache
```

**5. Node_modules corrompus**
```bash
# Frontend
rm -rf node_modules package-lock.json
npm install

# Backend
rm -rf vendor composer.lock
composer install
```

### Debug Mode

**Backend :**
```bash
# Activer le debug
APP_DEBUG=true

# Voir les logs
tail -f storage/logs/laravel.log
```

**Frontend :**
```bash
# Voir la console navigateur (F12)
# Network tab pour les requêtes API
```

---

## 📚 Structure des Fichiers

### Backend Laravel

```
backend/
├── app/
│   ├── Http/
│   │   ├── Controllers/
│   │   │   ├── Auth/           # Authentification
│   │   │   ├── Course/         # Cours & Vidéos
│   │   │   ├── Analytics/      # Statistiques
│   │   │   └── Company/        # Entreprises
│   │   ├── Middleware/         # Middleware personnalisés
│   │   └── Kernel.php          # Configuration middleware
│   ├── Models/                 # Modèles Eloquent
│   │   ├── User.php
│   │   ├── Video.php
│   │   └── Company.php
│   └── Providers/              # Service Providers
├── config/                     # Fichiers de config
├── database/
│   ├── migrations/            # Structure BDD
│   └── seeders/              # Données de test
└── routes/
    ├── api.php                # Routes API
    └── web.php                # Routes web
```

### Frontend Next.js

```
frontend/
├── app/                       # App Router (Next.js 13+)
│   ├── layout.tsx             # Layout principal
│   ├── page.tsx               # Page d'accueil
│   └── globals.css            # Styles globaux
├── components/                 # Composants React
│   ├── ui/                    # Composants réutilisables
│   ├── forms/                 # Formulaires
│   └── layout/                # Layout components
├── lib/                       # Utilitaires et helpers
├── types/                     # Types TypeScript
└── public/                    # Fichiers statiques
```

---

## 🔌 API Endpoints

### Routes Publiques (sans authentification)

```http
GET    /api/public/videos       # Liste des vidéos publiques
GET    /api/test                # Endpoint de test
GET    /api/test-db             # Test connexion BDD
```

### Routes Protégées (nécessitent authentification)

```http
# Authentification
POST   /api/register            # Inscription
POST   /api/login               # Connexion
GET    /api/me                  # Profil utilisateur
POST   /api/logout              # Déconnexion

# Vidéos
GET    /api/videos              # Liste des vidéos
POST   /api/videos              # Créer une vidéo
GET    /api/videos/{id}         # Détails vidéo
PUT    /api/videos/{id}         # Modifier vidéo
DELETE /api/videos/{id}         # Supprimer vidéo
POST   /api/videos/upload       # Upload fichier vidéo

# Cours & Modules
GET    /api/courses             # Liste des cours
GET    /api/modules             # Liste des modules

# Statistiques (Admin)
GET    /api/admin/stats         # Dashboard admin
```

### Exemples d'Utilisation

**JavaScript/Frontend :**
```javascript
// Récupérer les vidéos publiques
const response = await fetch('/api/public/videos');
const videos = await response.json();

// Upload de vidéo (avec auth)
const formData = new FormData();
formData.append('title', 'Ma vidéo');
formData.append('video', fileInput.files[0]);
formData.append('visibility', 'public');

const uploadResponse = await fetch('/api/videos/upload', {
  method: 'POST',
  body: formData,
  headers: {
    'Authorization': `Bearer ${token}`
  }
});
```

---

## 🎨 Frontend Components

### Structure des Composants

```typescript
// Exemple de composant vidéo
interface Video {
  id: number;
  title: string;
  slug: string;
  url: string;
  visibility: 'public' | 'private';
  created_at: string;
}

// Composant de liste de vidéos
const VideoList = () => {
  const [videos, setVideos] = useState<Video[]>([]);
  
  useEffect(() => {
    fetch('/api/public/videos')
      .then(res => res.json())
      .then(data => setVideos(data));
  }, []);

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
      {videos.map(video => (
        <VideoCard key={video.id} video={video} />
      ))}
    </div>
  );
};
```

### Styles (Tailwind CSS)

Le projet utilise **Tailwind CSS** pour le styling :

```bash
# Installer un nouveau package Tailwind
npm install @tailwindcss/typography

# Configuration dans tailwind.config.js
```

---

## 🚀 Déploiement

### Production

**Backend :**
```bash
# Optimiser pour la production
composer install --optimize-autoloader --no-dev
php artisan config:cache
php artisan route:cache
php artisan view:cache
```

**Frontend :**
```bash
# Build de production
npm run build
npm start
```

### Variables d'Environnement Production

N'oubliez pas de configurer :
- `APP_ENV=production`
- `APP_DEBUG=false`
- Base de données production
- URLs de production
- Clés API/Secrets

---

## 🤝 Contribuer

1. Fork le projet
2. Créer une branche : `git checkout -b feature/nouvelle-fonctionnalité`
3. Commiter : `git commit -m 'Ajout de nouvelle fonctionnalité'`
4. Push : `git push origin feature/nouvelle-fonctionnalité`
5. Ouvrir une Pull Request

---

## 📄 Licence

Ce projet est sous licence MIT - voir le fichier LICENSE pour détails.

---

## 🆘 Support

Pour toute question ou problème :
- Vérifier la section [🐛 Dépannage](#-dépannage)
- Consulter les logs Laravel : `storage/logs/laravel.log`
- Ouvrir une issue sur le repository

---

**🎉 Bon développement !**
