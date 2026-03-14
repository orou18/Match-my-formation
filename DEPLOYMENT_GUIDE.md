# Guide de déploiement complet

## 📋 Prérequis

### Backend (o2switch)
- PHP 8.2+
- MySQL 5.7+ ou 8.0+
- Composer
- Accès SSH au serveur o2switch

### Frontend (Vercel)
- Node.js 18+
- npm ou yarn
- Compte Vercel

---

## 🚀 Déploiement du Backend sur o2switch

### 1. Préparation des fichiers

Les fichiers de configuration ont été créés :
- `backend/env.production` - Variables d'environnement
- `backend/config/app.production.php` - Configuration Laravel
- `backend/config/cors.production.php` - Configuration CORS
- `backend/index.production.php` - Point d'entrée optimisé
- `deploy-backend-o2switch.sh` - Script de déploiement

### 2. Configuration manuelle

#### a) Base de données
```bash
# Connectez-vous à votre panel o2switch
# Créez la base de données : agto0195_match_my_formation
# Créez l'utilisateur : agto0195_user
# Notez les identifiants
```

#### b) Variables d'environnement
Éditez `backend/env.production` avec vos vraies valeurs :
```env
DB_DATABASE=agto0195_match_my_formation
DB_USERNAME=agto0195_user
DB_PASSWORD=VOTRE_MOT_DE_PASSE
CORS_ALLOWED_ORIGINS=https://votre-domaine-vercel.vercel.app
```

#### c) Déploiement automatisé
```bash
cd /home/kisoumare/Match-my-formation
./deploy-backend-o2switch.sh
```

#### d) Déploiement manuel (alternative)
```bash
# Upload des fichiers sur o2switch
scp -r backend/* agto0195@agto0195.o2switch.net:~/www/

# Configuration sur le serveur
cd ~/www
cp env.production .env
composer install --no-dev --optimize-autoloader
php artisan key:generate
php artisan migrate --force
php artisan config:cache
php artisan route:cache
php artisan view:cache
php artisan storage:link

# Permissions
chmod -R 755 .
chmod -R 777 storage
chmod -R 777 bootstrap/cache
```

### 3. Vérification
```bash
# Health check
curl https://agto0195.o2switch.net/health.php

# Test API
curl https://agto0195.o2switch.net/api/health
```

---

## 🌐 Déploiement du Frontend sur Vercel

### 1. Préparation des fichiers

Les fichiers de configuration ont été créés :
- `frontend/vercel.json` - Configuration Vercel
- `frontend/.env.production` - Variables d'environnement
- `frontend/next.config.production.js` - Configuration Next.js
- `frontend/package.production.json` - Dépendances optimisées
- `deploy-frontend-vercel.sh` - Script de déploiement

### 2. Configuration Vercel

#### a) Installation Vercel CLI
```bash
npm install -g vercel
```

#### b) Connexion à Vercel
```bash
cd frontend
vercel login
```

#### c) Configuration du projet
```bash
vercel link
```

#### d) Variables d'environnement
Dans le dashboard Vercel, ajoutez :
```
NEXT_PUBLIC_API_URL=https://agto0195.o2switch.net/api
NEXT_PUBLIC_APP_URL=https://votre-domaine-vercel.vercel.app
NEXT_PUBLIC_ENVIRONMENT=production
```

### 3. Déploiement

#### a) Automatisé
```bash
cd /home/kisoumare/Match-my-formation
./deploy-frontend-vercel.sh
```

#### b) Manuel (alternative)
```bash
cd frontend
npm ci
npm run build
vercel --prod
```

### 4. Configuration du domaine personnalisé (optionnel)
```bash
vercel domains add votre-domaine.com
```

---

## 🔗 Configuration de la communication API

### 1. CORS Backend

Le backend est configuré pour accepter les requêtes de Vercel :
```php
// backend/config/cors.production.php
'allowed_origins' => [
    'https://votre-domaine-vercel.vercel.app',
    'https://agto0195.o2switch.net',
],
```

### 2. Frontend API Service

Le frontend utilise un service API configuré :
```typescript
// frontend/lib/api-config.ts
baseURL: 'https://agto0195.o2switch.net/api'
```

### 3. Headers de sécurité

Les deux applications incluent des headers de sécurité :
- X-Frame-Options
- X-Content-Type-Options
- X-XSS-Protection
- Referrer-Policy

---

## 🧪 Tests de communication

### 1. Health Check Backend
```bash
curl https://agto0195.o2switch.net/health.php
```

### 2. Health Check Frontend
```bash
curl https://votre-domaine-vercel.vercel.app/api/health
```

### 3. Test d'authentification
```javascript
// Dans la console du navigateur sur Vercel
fetch('https://agto0195.o2switch.net/api/auth/login', {
  method: 'POST',
  headers: {
    'Content-Type': 'application/json',
    'Origin': 'https://votre-domaine-vercel.vercel.app'
  },
  body: JSON.stringify({
    email: 'test@example.com',
    password: 'password'
  })
})
```

---

## 📊 Monitoring et Debug

### 1. Logs Backend
```bash
# Sur o2switch
tail -f ~/www/storage/logs/laravel.log
```

### 2. Logs Vercel
```bash
vercel logs
```

### 3. Health Monitoring
```bash
# Script de monitoring
#!/bin/bash
while true; do
  response=$(curl -s -o /dev/null -w "%{http_code}" https://agto0195.o2switch.net/health.php)
  if [ $response -ne 200 ]; then
    echo "❌ Backend down: $response"
    # Envoyer une alerte
  fi
  sleep 60
done
```

---

## 🔄 Mises à jour

### Backend
```bash
./deploy-backend-o2switch.sh
```

### Frontend
```bash
./deploy-frontend-vercel.sh
```

---

## 🚨 Dépannage

### Problèmes courants

#### 1. CORS Error
```bash
# Vérifier la configuration CORS dans backend/config/cors.production.php
# Assurer que le domaine Vercel est dans allowed_origins
```

#### 2. Upload de fichiers
```bash
# Vérifier les permissions sur storage/app/public/uploads
# Configurer upload_max_filesize et post_max_size dans .htaccess
```

#### 3. Session/Authentication
```bash
# Vérifier que SESSION_DOMAIN correspond au domaine o2switch
# Configurer SANCTUM_STATEFUL_DOMAINS correctement
```

#### 4. Build failed
```bash
# Vérifier les versions de Node.js et npm
# Nettoyer le cache : npm cache clean --force
# Supprimer node_modules et réinstaller
```

---

## 📞 Support

### Documentation utile
- [Documentation Laravel](https://laravel.com/docs)
- [Documentation Next.js](https://nextjs.org/docs)
- [Documentation Vercel](https://vercel.com/docs)
- [Documentation o2switch](https://www.o2switch.fr/support)

### Outils de debug
- [Postman](https://www.postman.com/) pour tester l'API
- [Browser DevTools](https://developer.chrome.com/docs/devtools/)
- [Vercel Dashboard](https://vercel.com/dashboard)

---

## ✅ Checklist de déploiement

- [ ] Base de données créée sur o2switch
- [ ] Variables d'environnement configurées
- [ ] Backend déployé et fonctionnel
- [ ] Frontend déployé sur Vercel
- [ ] Communication API testée
- [ ] CORS configuré correctement
- [ ] Headers de sécurité en place
- [ ] Monitoring configuré
- [ ] Logs accessibles
- [ ] Health checks fonctionnels

---

## 🎉 Résultat final

- **Backend** : `https://agto0195.o2switch.net`
- **Frontend** : `https://votre-domaine-vercel.vercel.app`
- **API** : `https://agto0195.o2switch.net/api`
- **Health** : `https://agto0195.o2switch.net/health.php`

La communication entre les deux plateformes est maintenant entièrement configurée et sécurisée !
