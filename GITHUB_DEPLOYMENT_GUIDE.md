# GitHub Deployment Guide

## Configuration du Déploiement via GitHub

Ce guide vous explique comment déployer votre application Match My Formation via GitHub Actions pour le backend Laravel (o2switch) et le frontend Next.js (Vercel).

---

## 1. Backend Laravel - Déploiement sur o2switch

### 1.1 Configuration du Repository

1. **Créez un nouveau repository GitHub** pour votre backend :
   ```bash
   git init
   git add .
   git commit -m "Initial commit"
   git branch -M main
   git remote add origin https://github.com/votre-username/match-my-formation-backend.git
   git push -u origin main
   ```

### 1.2 GitHub Actions pour le Backend

Créez le fichier `.github/workflows/deploy-backend.yml` :

```yaml
name: Deploy Backend to o2switch

on:
  push:
    branches: [ main ]
  pull_request:
    branches: [ main ]

jobs:
  deploy:
    runs-on: ubuntu-latest
    
    steps:
    - uses: actions/checkout@v3
    
    - name: Setup PHP
      uses: shivammathur/setup-php@v2
      with:
        php-version: '8.2'
        extensions: mbstring, xml, bcmath, curl, zip, pdo, sqlite, pdo_sqlite
        coverage: none
    
    - name: Copy environment file
      run: |
        echo "APP_NAME=MatchMyFormation" > .env
        echo "APP_ENV=production" >> .env
        echo "APP_KEY=base64:${{ secrets.APP_KEY }}" >> .env
        echo "APP_DEBUG=false" >> .env
        echo "APP_URL=https://matchmyformation-e-learning.com.matchmyformation.com" >> .env
        echo "APP_LOCALE=fr" >> .env
        echo "APP_FALLBACK_LOCALE=en" >> .env
        echo "APP_TIMEZONE=Europe/Paris" >> .env
        echo "DB_CONNECTION=mysql" >> .env
        echo "DB_HOST=127.0.0.1" >> .env
        echo "DB_PORT=3306" >> .env
        echo "DB_DATABASE=agto0195_matchmyformation_bdd" >> .env
        echo "DB_USERNAME=agto0195_matchmyformation_user" >> .env
        echo "DB_PASSWORD=${{ secrets.DB_PASSWORD }}" >> .env
        echo "BROADCAST_DRIVER=log" >> .env
        echo "CACHE_DRIVER=file" >> .env
        echo "FILESYSTEM_DISK=local" >> .env
        echo "QUEUE_CONNECTION=sync" >> .env
        echo "SESSION_DRIVER=file" >> .env
        echo "SESSION_LIFETIME=120" >> .env
        echo "SESSION_DOMAIN=matchmyformation-e-learning.com.matchmyformation.com" >> .env
        echo "SANCTUM_STATEFUL_DOMAINS=matchmyformation-e-learning.com.matchmyformation.com" >> .env
        echo "CORS_ALLOWED_ORIGINS=https://matchmyformation-e-learning.com.matchmyformation.com,https://*.vercel.app" >> .env
        echo "MAIL_MAILER=smtp" >> .env
        echo "MAIL_HOST=smtp.o2switch.fr" >> .env
        echo "MAIL_PORT=587" >> .env
        echo "MAIL_USERNAME=${{ secrets.MAIL_USERNAME }}" >> .env
        echo "MAIL_PASSWORD=${{ secrets.MAIL_PASSWORD }}" >> .env
        echo "MAIL_ENCRYPTION=tls" >> .env
        echo "MAIL_FROM_ADDRESS=contact@matchmyformation-e-learning.com.matchmyformation.com" >> .env
        echo "MAIL_FROM_NAME=MatchMyFormation" >> .env
        echo "JWT_SECRET=${{ secrets.JWT_SECRET }}" >> .env
    
    - name: Install Composer dependencies
      run: composer install --no-dev --optimize-autoloader
    
    - name: Setup Node.js
      uses: actions/setup-node@v3
      with:
        node-version: '18'
        cache: 'npm'
        cache-dependency-path: 'backend/package-lock.json'
    
    - name: Install NPM dependencies
      run: npm ci && npm run build
    
    - name: Optimize Laravel
      run: |
        php artisan config:cache
        php artisan route:cache
        php artisan view:cache
    
    - name: Create deployment package
      run: |
        tar -czf backend-deploy.tar.gz \
          --exclude='.git' \
          --exclude='node_modules' \
          --exclude='tests' \
          --exclude='.github' \
          --exclude='*.log' \
          .
    
    - name: Deploy to o2switch
      uses: appleboy/scp-action@v0.1.4
      with:
        host: ${{ secrets.FTP_HOST }}
        username: ${{ secrets.FTP_USERNAME }}
        password: ${{ secrets.FTP_PASSWORD }}
        source: "backend-deploy.tar.gz"
        target: "/www"
        strip_components: 0
    
    - name: Extract and setup on server
      uses: appleboy/ssh-action@v0.1.5
      with:
        host: ${{ secrets.FTP_HOST }}
        username: ${{ secrets.FTP_USERNAME }}
        password: ${{ secrets.FTP_PASSWORD }}
        script: |
          cd /www
          tar -xzf backend-deploy.tar.gz
          rm backend-deploy.tar.gz
          chmod -R 755 storage bootstrap/cache
          chmod -R 777 storage bootstrap/cache
          php artisan migrate --force
          php artisan storage:link
          php artisan config:clear
          php artisan cache:clear
          php artisan view:clear
```

### 1.3 Configuration des Secrets GitHub

Dans votre repository GitHub, allez dans `Settings > Secrets and variables > Actions` et ajoutez :

- `APP_KEY` : Clé d'application Laravel (générée avec `php artisan key:generate --show`)
- `DB_PASSWORD` : `25417Azer@`
- `MAIL_USERNAME` : `contact@matchmyformation-e-learning.com.matchmyformation.com`
- `MAIL_PASSWORD` : Votre mot de passe email
- `JWT_SECRET` : Secret JWT (généré avec `php artisan jwt:secret --show`)
- `FTP_HOST` : Votre serveur o2switch
- `FTP_USERNAME` : Votre identifiant FTP o2switch
- `FTP_PASSWORD` : Votre mot de passe FTP o2switch

---

## 2. Frontend Next.js - Déploiement sur Vercel

### 2.1 Configuration du Repository

1. **Créez un repository séparé** pour le frontend :
   ```bash
   cd ../frontend
   git init
   git add .
   git commit -m "Initial commit"
   git branch -M main
   git remote add origin https://github.com/votre-username/match-my-formation-frontend.git
   git push -u origin main
   ```

### 2.2 Configuration Vercel

1. **Connectez Vercel à GitHub** :
   - Allez sur [vercel.com](https://vercel.com)
   - Connectez votre compte GitHub
   - Importez le repository `match-my-formation-frontend`

2. **Configurez les variables d'environnement** dans Vercel :
   ```
   NEXT_PUBLIC_API_URL=https://matchmyformation-e-learning.com.matchmyformation.com/api
   NEXT_PUBLIC_APP_URL=https://matchmyformation-e-learning.com.matchmyformation.com
   NEXT_PUBLIC_ENVIRONMENT=production
   ```

3. **Configurez le Build Command** :
   ```
   npm run build
   ```

4. **Configurez le Output Directory** :
   ```
   .next
   ```

### 2.3 Vercel JSON

Assurez-vous que votre fichier `vercel.json` est correctement configuré :

```json
{
  "version": 2,
  "name": "match-my-formation",
  "builds": [
    {
      "src": "package.json",
      "use": "@vercel/next"
    }
  ],
  "env": {
    "NEXT_PUBLIC_API_URL": "https://matchmyformation-e-learning.com.matchmyformation.com/api",
    "NEXT_PUBLIC_APP_URL": "https://matchmyformation-e-learning.com.matchmyformation.com",
    "NEXT_PUBLIC_ENVIRONMENT": "production"
  },
  "build": {
    "env": {
      "NEXT_PUBLIC_API_URL": "https://matchmyformation-e-learning.com.matchmyformation.com/api",
      "NEXT_PUBLIC_APP_URL": "https://matchmyformation-e-learning.com.matchmyformation.com",
      "NEXT_PUBLIC_ENVIRONMENT": "production"
    }
  },
  "routes": [
    {
      "src": "/api/(.*)",
      "dest": "https://matchmyformation-e-learning.com.matchmyformation.com/api/$1"
    },
    {
      "src": "/(.*)",
      "dest": "/$1"
    }
  ],
  "headers": [
    {
      "source": "/api/(.*)",
      "headers": [
        {
          "key": "Access-Control-Allow-Origin",
          "value": "https://matchmyformation-e-learning.com.matchmyformation.com"
        },
        {
          "key": "Access-Control-Allow-Methods",
          "value": "GET, POST, PUT, DELETE, OPTIONS"
        },
        {
          "key": "Access-Control-Allow-Headers",
          "value": "Content-Type, Authorization"
        }
      ]
    }
  ],
  "rewrites": [
    {
      "source": "/api/(.*)",
      "destination": "https://matchmyformation-e-learning.com.matchmyformation.com/api/$1"
    }
  ]
}
```

---

## 3. Workflow de Déploiement Automatisé

### 3.1 Déploiement Backend

Chaque `push` sur la branche `main` du backend déclenchera :
1. Installation des dépendances PHP et Node.js
2. Build des assets
3. Optimisation Laravel
4. Création du package de déploiement
5. Transfert vers o2switch via FTP
6. Extraction et configuration automatique sur le serveur

### 3.2 Déploiement Frontend

Chaque `push` sur la branche `main` du frontend déclenchera :
1. Build automatique par Vercel
2. Déploiement sur l'URL Vercel
3. Mise à jour des variables d'environnement

---

## 4. Monitoring et Logs

### 4.1 Backend Monitoring

- **GitHub Actions** : Vérifiez les logs dans l'onglet "Actions" de votre repository
- **Logs serveur** : Connectez-vous en SSH pour vérifier les logs Laravel
- **Monitoring o2switch** : Utilisez le panneau de contrôle o2switch

### 4.2 Frontend Monitoring

- **Vercel Dashboard** : Monitoring en temps réel des performances
- **Vercel Logs** : Logs détaillés des erreurs et warnings
- **Analytics** : Statistiques d'utilisation et performance

---

## 5. Sécurité

### 5.1 Bonnes Pratiques

- Ne jamais committer de secrets ou mots de passe
- Utiliser les secrets GitHub pour les informations sensibles
- Activer la double authentification sur les comptes
- Limiter les permissions des clés API

### 5.2 HTTPS et Certificats

- o2switch fournit automatiquement des certificats SSL/TLS
- Vercel gère automatiquement le HTTPS
- Assurez-vous que toutes les URLs utilisent HTTPS

---

## 6. Rollback et Gestion des Erreurs

### 6.1 Backend Rollback

En cas de problème avec le backend :
1. Annulez le dernier commit : `git revert HEAD`
2. Push : `git push origin main`
3. Le workflow GitHub Actions redéploiera automatiquement la version précédente

### 6.2 Frontend Rollback

Vercel permet facilement de revenir à une version précédente :
1. Allez dans le dashboard Vercel
2. Cliquez sur votre projet
3. Allez dans l'onglet "Deployments"
4. Trouvez le déploiement précédent et cliquez sur "Promote to Production"

---

## 7. Checklist de Déploiement

Avant chaque déploiement en production :

- [ ] Tests passants localement
- [ ] Variables d'environnement à jour
- [ ] Backup de la base de données
- [ ] Documentation mise à jour
- [ ] Review du code par un autre développeur
- [ ] Vérification des performances

---

## 8. Support et Dépannage

### 8.1 Problèmes Communs

**Backend ne se déploie pas** :
- Vérifiez les secrets GitHub
- Vérifiez la connexion FTP
- Consultez les logs GitHub Actions

**Frontend ne se connecte pas au backend** :
- Vérifiez les variables d'environnement Vercel
- Vérifiez la configuration CORS
- Testez l'API directement

### 8.2 Ressources

- [Documentation GitHub Actions](https://docs.github.com/en/actions)
- [Documentation Vercel](https://vercel.com/docs)
- [Documentation Laravel](https://laravel.com/docs)
- [Support o2switch](https://www.o2switch.fr/support)

---

## 9. Conclusion

Avec cette configuration, vous avez un pipeline de déploiement continu robuste qui :
- Déploie automatiquement le backend sur o2switch
- Déploie automatiquement le frontend sur Vercel
- Maintient la communication entre les deux services
- Assure la sécurité et la fiabilité des déploiements

N'hésitez pas à adapter ce guide selon vos besoins spécifiques !
