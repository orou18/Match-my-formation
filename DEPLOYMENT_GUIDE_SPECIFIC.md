# Guide de déploiement spécifique - Match My Formation

## 🎯 Configuration actuelle

### Backend (o2switch)
- **URL**: `https://matchmyformation-e-learning.com.matchmyformation.com`
- **API**: `https://matchmyformation-e-learning.com.matchmyformation.com/api`
- **Database**: `agto0195_matchmyformation_bdd`
- **User**: `agto0195_matchmyformation_user`

### Frontend (Vercel)
- **URL**: À déterminer après déploiement
- **API Backend**: `https://matchmyformation-e-learning.com.matchmyformation.com/api`

---

## 🚀 Déploiement du Backend

### Script automatisé
```bash
cd /home/kisoumare/Match-my-formation
./deploy-backend-o2switch-specific.sh
```

### Étapes manuelles
1. **Backup** de l'existant
2. **Copie** des fichiers backend
3. **Configuration** du .env avec vos URLs
4. **Installation** des dépendances
5. **Migration** de la base de données
6. **Optimisation** du cache
7. **Configuration** du .htaccess

### Vérification
```bash
curl https://matchmyformation-e-learning.com.matchmyformation.com/health.php
```

---

## 🌐 Déploiement du Frontend

### Script automatisé
```bash
cd /home/kisoumare/Match-my-formation
./deploy-frontend-vercel-specific.sh
```

### Configuration Vercel
Dans le dashboard Vercel, ajoutez ces variables d'environnement :
```
NEXT_PUBLIC_API_URL=https://matchmyformation-e-learning.com.matchmyformation.com/api
NEXT_PUBLIC_APP_URL=https://matchmyformation-e-learning.com.matchmyformation.com
NEXT_PUBLIC_ENVIRONMENT=production
NEXT_PUBLIC_WS_URL=wss://matchmyformation-e-learning.com.matchmyformation.com/ws
```

---

## 🔗 Configuration CORS

### Backend (déjà configuré)
Le fichier `backend/config/cors.php` contient :
```php
'allowed_origins' => [
    'https://matchmyformation-e-learning.com.matchmyformation.com',
    'https://*.vercel.app', // Pour Vercel
    'http://localhost:3000', // Développement
],
'allowed_origins_patterns' => [
    'https://*.matchmyformation.com',
    'https://*.vercel.app',
],
```

### Après déploiement Vercel
Ajoutez l'URL de Vercel au CORS :
```bash
# Dans le .env du backend
CORS_ALLOWED_ORIGINS=https://matchmyformation-e-learning.com.matchmyformation.com,https://votre-domaine-vercel.vercel.app
```

---

## 🧪 Tests de communication

### 1. Health Check Backend
```bash
curl https://matchmyformation-e-learning.com.matchmyformation.com/health.php
```

### 2. Health Check Frontend
```bash
curl https://votre-domaine-vercel.vercel.app/api/health
```

### 3. Test d'authentification
```javascript
// Dans la console du navigateur sur Vercel
fetch('https://matchmyformation-e-learning.com.matchmyformation.com/api/auth/login', {
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

## 📊 Monitoring

### Logs Backend
```bash
# Sur o2switch
tail -f ~/www/storage/logs/laravel.log
```

### Logs Vercel
```bash
vercel logs
```

### Health Monitoring
```bash
# Script de monitoring
#!/bin/bash
while true; do
  response=$(curl -s -o /dev/null -w "%{http_code}" https://matchmyformation-e-learning.com.matchmyformation.com/health.php)
  if [ $response -ne 200 ]; then
    echo "❌ Backend down: $response"
  fi
  sleep 60
done
```

---

## 🔄 Mises à jour

### Backend
```bash
./deploy-backend-o2switch-specific.sh
```

### Frontend
```bash
./deploy-frontend-vercel-specific.sh
```

---

## 📝 Checklist finale

### Backend ✅
- [x] Base de données configurée
- [x] Variables d'environnement prêtes
- [x] CORS configuré pour Vercel
- [x] Headers de sécurité
- [x] Health check endpoint
- [x] Script de déploiement

### Frontend ✅
- [x] Configuration API prête
- [x] Variables Vercel configurées
- [x] CORS headers
- [x] Scripts de déploiement
- [x] Health check endpoint

### Communication 🔗
- [x] URLs synchronisées
- [x] CORS bidirectionnel
- [x] Headers de sécurité
- [x] Error handling
- [x] Retry logic

---

## 🎉 Résultat attendu

Après déploiement :

1. **Backend**: `https://matchmyformation-e-learning.com.matchmyformation.com`
2. **API**: `https://matchmyformation-e-learning.com.matchmyformation.com/api`
3. **Frontend**: `https://votre-domaine-vercel.vercel.app`
4. **Health Backend**: `https://matchmyformation-e-learning.com.matchmyformation.com/health.php`
5. **Health Frontend**: `https://votre-domaine-vercel.vercel.app/api/health`

## 🚨 Dépannage

### Si CORS error
1. Vérifier le fichier `backend/config/cors.php`
2. Ajouter l'URL Vercel à `allowed_origins`
3. Redéployer le backend

### Si upload ne fonctionne pas
1. Vérifier les permissions sur `storage/app/public/uploads`
2. Configurer `upload_max_filesize` dans `.htaccess`
3. Vérifier les types MIME autorisés

### Si authentification échoue
1. Vérifier que `supports_credentials` est `true`
2. Vérifier les cookies SameSite
3. Vérifier les headers Authorization

---

## 📞 Support

### URLs utiles
- **Dashboard o2switch**: https://www.o2switch.fr/support
- **Dashboard Vercel**: https://vercel.com/dashboard
- **Documentation Laravel**: https://laravel.com/docs
- **Documentation Next.js**: https://nextjs.org/docs

### Outils
- **Postman**: Pour tester l'API
- **Chrome DevTools**: Pour debugger
- **Vercel CLI**: `vercel logs`
- **SSH o2switch**: Pour accéder au serveur

---

## ✅ Prochaines étapes

1. **Déployer le backend** avec le script spécifique
2. **Déployer le frontend** avec le script spécifique  
3. **Mettre à jour le CORS** avec l'URL Vercel
4. **Tester la communication** complète
5. **Configurer le monitoring** et les alertes

Votre configuration est maintenant prête pour un déploiement production réussi ! 🚀
