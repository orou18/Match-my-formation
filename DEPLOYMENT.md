# Match My Formation - Guide de Déploiement

## Architecture du Projet
- **Backend**: Laravel 11 déployé sur Render
- **Frontend**: Next.js 16 déployé sur Vercel
- **Base de données**: PostgreSQL sur Render
- **Cache**: Redis sur Render
- **File Storage**: Local/Render Disk

## Structure du Repository
```
Match-my-formation/
├── backend/          # Application Laravel
│   ├── app/          # Controllers, Models, etc.
│   ├── config/       # Configuration Laravel
│   ├── database/     # Migrations, Seeders
│   ├── routes/       # Routes API
│   ├── public/       # Point d'entrée Laravel
│   ├── composer.json # Dépendances PHP
│   └── .env          # Variables Laravel
├── frontend/         # Application Next.js
│   ├── app/          # Pages Next.js
│   ├── components/   # Composants React
│   ├── lib/          # Utilitaires TypeScript
│   ├── public/       # Static files
│   ├── package.json  # Dépendances Node.js
│   ├── vercel.json   # Configuration Vercel
│   └── .env          # Variables Next.js
├── render.yaml       # Configuration Render
└── DEPLOYMENT.md     # Ce guide
```

## Prérequis
- Compte GitHub avec le repository
- Compte Vercel (gratuit)
- Compte Render (gratuit)
- Composer installé localement
- Node.js 18+ installé localement

## Étape 1: Configuration des Variables d'Environnement

### Variables Vercel (Frontend Next.js)
```bash
# URLs de l'API Laravel
NEXT_PUBLIC_API_URL=https://match-my-formation-api.onrender.com
NEXT_PUBLIC_FRONTEND_URL=https://match-my-formation.vercel.app

# Authentification
NEXTAUTH_URL=https://match-my-formation.vercel.app
NEXTAUTH_SECRET=votre-secret-key-ici

# Configuration Laravel Sanctum
SANCTUM_STATEFUL_DOMAINS=https://match-my-formation.vercel.app
SESSION_DOMAIN=.match-my-formation.vercel.app
```

### Variables Render (Backend Laravel)
```bash
# Configuration Laravel
APP_NAME=MatchMyFormation
APP_ENV=production
APP_KEY=base64:votre-app-key-ici
APP_DEBUG=false
APP_URL=https://match-my-formation-api.onrender.com

# Base de données
DB_CONNECTION=pgsql
DB_HOST=host-postgresql-render
DB_PORT=5432
DB_DATABASE=match_my_formation
DB_USERNAME=username
DB_PASSWORD=password

# Cache
CACHE_DRIVER=redis
REDIS_HOST=host-redis-render
REDIS_PASSWORD=null
REDIS_PORT=6379

# File Storage
FILESYSTEM_DISK=local

# Session et Auth
SESSION_DRIVER=database
SESSION_LIFETIME=120
SANCTUM_STATEFUL_DOMAINS=https://match-my-formation-api.onrender.com

# Mail (optionnel)
MAIL_MAILER=smtp
MAIL_HOST=smtp.gmail.com
MAIL_PORT=587
MAIL_USERNAME=votre-email@gmail.com
MAIL_PASSWORD=votre-app-password
```

## Étape 2: Déploiement du Backend Laravel sur Render

### 2.1 Configuration du Service Web
1. Allez sur [Render.com](https://render.com)
2. Connectez votre compte GitHub
3. Cliquez sur "New +" → "Web Service"
4. Sélectionnez le repository `Match-my-formation`
5. Configurez:
   - **Name**: `match-my-formation-api`
   - **Runtime**: `Docker`
   - **Root Directory**: `backend`
   - **Dockerfile Path**: `./Dockerfile`
   - **Instance Type**: `Free`
   - **Region**: Choisissez la plus proche

### 2.2 Création du Dockerfile Laravel
Créez `backend/Dockerfile`:
```dockerfile
FROM php:8.2-fpm

# Install dependencies
RUN apt-get update && apt-get install -y \
    git \
    curl \
    libpng-dev \
    libonig-dev \
    libxml2-dev \
    zip \
    unzip

# Install PHP extensions
RUN docker-php-ext-install pdo_mysql mbstring exif pcntl bcmath gd

# Install Composer
COPY --from=composer:latest /usr/bin/composer /usr/bin/composer

# Set working directory
WORKDIR /var/www/html

# Copy existing application directory permissions
COPY --chown=www-data:www-data . /var/www/html

# Run composer install
RUN composer install --no-dev --optimize-autoloader

# Copy .env
RUN cp .env.example .env

# Generate app key
RUN php artisan key:generate --force

# Set permissions
RUN chown -R www-data:www-data /var/www/html
RUN chmod -R 755 /var/www/html/storage

# Expose port
EXPOSE 9000

# Start PHP-FPM
CMD ["php-fpm"]
```

### 2.3 Services de Base de Données
1. Dans le service web, ajoutez les services:
   - **PostgreSQL**: `match-my-formation-db`
   - **Redis**: `match-my-formation-redis`
2. Configurez les variables d'environnement avec les connection strings

### 2.4 Commandes de Build et Start
- **Build Command**: `docker build -t laravel-app .`
- **Start Command**: `php-fpm`

## Étape 3: Déploiement du Frontend Next.js sur Vercel

### 3.1 Configuration du Projet
1. Allez sur [Vercel.com](https://vercel.com)
2. Connectez votre compte GitHub
3. Cliquez sur "Add New..." → "Project"
4. Sélectionnez le repository `Match-my-formation`
5. Configurez:
   - **Framework Preset**: `Next.js`
   - **Root Directory**: `frontend`
   - **Build Command**: `npm run build`
   - **Output Directory**: `.next`
   - **Install Command**: `npm install`

### 3.2 Configuration CORS dans Laravel
Dans `backend/app/Http/Middleware/CorsMiddleware.php`:
```php
<?php

namespace App\Http\Middleware;

use Closure;
use Illuminate\Http\Request;

class CorsMiddleware
{
    public function handle(Request $request, Closure $next)
    {
        $response = $next($request);
        
        $response->headers->set('Access-Control-Allow-Origin', '*');
        $response->headers->set('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
        $response->headers->set('Access-Control-Allow-Headers', 'Content-Type, Authorization, X-Requested-With');
        
        return $response;
    }
}
```

### 3.3 Configuration Vercel (vercel.json)
```json
{
  "version": 2,
  "builds": [
    {
      "src": "package.json",
      "use": "@vercel/next"
    }
  ],
  "routes": [
    {
      "src": "/(.*)",
      "dest": "/frontend/$1"
    }
  ],
  "env": {
    "NEXT_PUBLIC_API_URL": "@match-my-formation-api-url"
  },
  "headers": [
    {
      "source": "/(.*)",
      "headers": [
        {
          "key": "Access-Control-Allow-Origin",
          "value": "*"
        }
      ]
    }
  ]
}
```

## Étape 4: Configuration de la Base de Données

### 4.1 Migration Laravel
Après le déploiement du backend:
1. Allez sur le service Render
2. Utilisez "Shell" pour exécuter:
```bash
php artisan migrate --force
php artisan db:seed --force
```

## Étape 5: Test de l'Application

### 5.1 Tests d'API
```bash
# Test de l'API Laravel
curl https://match-my-formation-api.onrender.com/api/health

# Test de connexion
curl -X POST https://match-my-formation-api.onrender.com/api/login \
  -H "Content-Type: application/json" \
  -d '{"email": "test@example.com", "password": "password"}'
```

### 5.2 Tests Frontend
1. Accédez à `https://match-my-formation.vercel.app`
2. Testez l'inscription/connexion
3. Testez l'upload de fichiers
4. Vérifiez la communication avec l'API Laravel

## URLs Finales
- **Frontend**: `https://match-my-formation.vercel.app`
- **Backend API**: `https://match-my-formation-api.onrender.com`
- **Base de données**: `https://dashboard.render.com/d/...`
- **Admin Laravel**: `https://match-my-formation-api.onrender.com/admin`

## Dépannage

### Erreurs Communes
1. **CORS**: Vérifiez le middleware Laravel et les headers Vercel
2. **Database Connection**: Vérifiez les connection strings PostgreSQL
3. **File Uploads**: Vérifiez les permissions storage et PHP uploads
4. **Sanctum Auth**: Configurez correctement les domaines stateful

### Debug Commands
```bash
# Laravel logs
php artisan log:clear
tail -f storage/logs/laravel.log

# Cache clear
php artisan cache:clear
php artisan config:clear
php artisan route:clear
```

## Maintenance

### Mises à Jour Automatiques
1. Push sur la branche `main`
2. Render et Vercel déploient automatiquement
3. Vérifiez les logs après déploiement

### Backups
- Render backup automatique PostgreSQL quotidien
- Export manuel: `php artisan db:backup`
