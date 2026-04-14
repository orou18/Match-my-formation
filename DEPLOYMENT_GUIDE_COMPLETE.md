# 🚀 GUIDE DE DÉPLOIEMENT COMPLET - MATCH MY FORMATION

**Date préparation:** 30 Mars 2026  
**Statut:** ✅ Prêt pour déploiement production  
**Environnements:** Render (Backend) + Vercel (Frontend)

---

## 📋 TABLE DES MATIÈRES

1. [Prérequis](#prérequis)
2. [Étape 1: Préparation Locale](#étape-1--préparation-locale)
3. [Étape 2: Déploiement Backend (Render)](#étape-2--déploiement-backend-render)
4. [Étape 3: Déploiement Frontend (Vercel)](#étape-3--déploiement-frontend-vercel)
5. [Étape 4: Tests de Production](#étape-4--tests-de-production)
6. [Dépannage](#dépannage)

---

## ✅ PRÉREQUIS

Avant de déployer, assurez-vous que:

- [ ] Compte **Render.com** actif (gratuit)
- [ ] Compte **Vercel.app** actif (gratuit)
- [ ] Accès admin au repository GitHub
- [ ] Laravel CLI installé localement: `composer install`
- [ ] Node.js 18+ installé: `node --version`

**Vérifier que tout est correct:**

```bash
chmod +x prepare-deployment.sh
./prepare-deployment.sh
```

---

## 🔑 CRÉATION DES CLÉS SECRÈTES

### 1. Générer Laravel APP_KEY

```bash
cd backend
php artisan key:generate
# Copier la clé générée: base64:XXXX...
cd ..
```

### 2. Générer NEXTAUTH_SECRET

```bash
# Sur macOS/Linux
openssl rand -hex 32

# Sur Windows (PowerShell)
[Convert]::ToHexString([System.Security.Cryptography.RandomNumberGenerator]::GetBytes(32))

# Sauvegarder cette clé pour Vercel
```

---

## ÉTAPE 1 : PRÉPARATION LOCALE

### ✅ Vérifications finales

```bash
# 1. Vérifier la structure
ls -la backend/config/cors.php     # Doit avoir Vercel URL
ls -la backend/config/sanctum.php  # Doit avoir Vercel URL
ls -la frontend/next.config.js     # Rewrites dynamique
ls -la backend/Dockerfile          # Multi-stage production
```

### ✅ Tester localement

```bash
# Terminal 1: Backend
cd backend
php artisan serve --host=127.0.0.1 --port=8000

# Terminal 2: Frontend (nouveau terminal)
cd frontend
npm install
npm run dev

# Browser: http://localhost:3000/fr/login
# Test login avec les identifiants dans la base
```

### ✅ Vérifier les migrations

```bash
cd backend

# Vérifier que les migrations sont à jour
php artisan migrate:status

# Si besoin, lancer les migrations
php artisan migrate --seed

cd ..
```

---

## ÉTAPE 2 : DÉPLOIEMENT BACKEND (RENDER)

### 2.1. Créer le Service Principal sur Render

1. **Allez sur [render.com](https://render.com)**
2. **Sign in** avec votre compte GitHub
3. **New +** → **Web Service**
4. **Sélectionnez** le repository `Match-my-formation`
5. **Configuration:**
   - **Name:** `match-my-formation-api`
   - **Environment:** `Docker`
   - **Branch:** `main`
   - **Root Directory:** `backend`
   - **Plan:** `Free`

### 2.2. Ajouter la Clé APP_KEY

Dans Render Dashboard:

- **Settings** → **Environment**
- **Add Environment Variable:**
  ```
  APP_KEY = base64:VOTRE_CLE_GENEREE
  ```

### 2.3. Créer la Base de Données PostgreSQL

1. **New +** → **PostgreSQL**
   - **Name:** `match-my-formation-db`
   - **Database:** `match_my_formation`
   - **Plan:** `Free`
   - **Region:** Même région que le web service

2. **Sauvegarder les identifiants** (Render les génère automatiquement)

### 2.4. Créer le Cache Redis

1. **New +** → **Redis**
   - **Name:** `match-my-formation-redis`
   - **Plan:** `Free`
   - **Region:** Même région

2. **Noter la clé d'accès**

### 2.5. Vérifier les Variables d'Environnement

**Render devrait automatiquement configurer:**

- `DB_HOST`, `DB_DATABASE`, `DB_USERNAME`, `DB_PASSWORD` (PostgreSQL)
- `REDIS_HOST`, `REDIS_PORT` (Redis)

**Ajouter manuellement les autres:**

- `FRONTEND_URL=https://match-my-formation.vercel.app`
- `SANCTUM_STATEFUL_DOMAINS=match-my-formation.vercel.app,localhost:3000`
- `LOG_LEVEL=error`

### 2.6. Déployer le Backend

1. **Aller dans le web service**: `match-my-formation-api`
2. **Manual Deploy** → **Deploy latest commit**
3. **Attendre** que le build se termine (5-10 min)

**Vérifier le déploiement:**

```bash
# Test health check
curl https://match-my-formation-api.onrender.com/api/health

# Résultat attendu:
# {"status":"ok","timestamp":"2026-03-30T...","version":"1.0.0",...}
```

---

## ÉTAPE 3 : DÉPLOIEMENT FRONTEND (VERCEL)

### 3.1. Connecter le Repository à Vercel

1. **Allez sur [vercel.com](https://vercel.com)**
2. **Sign in** avec GitHub
3. **Import Project** → **Import Git Repository**
4. **Sélectionnez** `Match-my-formation`

### 3.2. Configuration du Projet

1. **Framework:** Next.js
2. **Root Directory:** `./frontend`
3. **Build Command:** `npm run build`
4. **Start Command:** `npm run start`

### 3.3. Ajouter les Variables d'Environnement

Dans Vercel:

- **Settings** → **Environment Variables**

**Ajouter:**

```
NEXT_PUBLIC_API_URL=https://match-my-formation-api.onrender.com
NEXT_PUBLIC_FRONTEND_URL=https://match-my-formation.vercel.app
NEXTAUTH_URL=https://match-my-formation.vercel.app
NEXTAUTH_SECRET=VOTRE_CLEF_GENEREE_AVEC_OPENSSL
```

### 3.4. Déployer le Frontend

1. **Vercel déploie automatiquement** quand vous confirmez
2. **Attendre** que le build se termine (3-5 min)
3. **Vérifier l'URL générée** par Vercel

---

## ÉTAPE 4 : TESTS DE PRODUCTION

### ✅ Test 1: API Health Check

```bash
curl https://match-my-formation-api.onrender.com/api/health
```

**Résultat attendu:**

```json
{
  "status": "ok",
  "version": "1.0.0",
  "environment": "production",
  "database": "connected"
}
```

### ✅ Test 2: CORS Headers

```bash
curl -i -X OPTIONS https://match-my-formation-api.onrender.com/api/login \
  -H "Origin: https://match-my-formation.vercel.app" \
  -H "Access-Control-Request-Method: POST"
```

**Vérifier les headers:**

```
Access-Control-Allow-Origin: https://match-my-formation.vercel.app
Access-Control-Allow-Methods: GET, POST, PUT, DELETE, OPTIONS
```

### ✅ Test 3: Authentification

1. **Ouvrir:** `https://match-my-formation.vercel.app/fr/login`
2. **Essayer de se connecter** avec:
   - Email: `student@matchmyformation.com`
   - Password: `Azerty123!`
3. **Vérifier la redirection** vers le dashboard

### ✅ Test 4: CORS et Cookies

Dans le navigateur (Console du Developer):

```javascript
// Vérifier que les cookies sont reçus
console.log(document.cookie);

// Vérifier que le token est stocké
console.log(localStorage.getItem("token"));
```

### ✅ Test 5: API Calls depuis Frontend

```bash
# Tester la route /me
curl -X GET https://match-my-formation-api.onrender.com/api/me \
  -H "Authorization: Bearer YOUR_TOKEN" \
  -H "Origin: https://match-my-formation.vercel.app"
```

---

## 📝 MIGRATION DE LA BASE DE DONNÉES

### Première déploiement

Sur Render, une fois le service déployé:

1. **Ouvrir la console Render** du web service
2. **Exécuter:**

   ```bash
   php artisan migrate
   php artisan db:seed --class=EnhancedDatabaseSeeder
   ```

3. **Vérifier que tout est OK:**
   ```bash
   php artisan migrate:status
   ```

---

## 🔒 SÉCURITÉ - CHECKLIST FINALE

- [ ] `.env` files **NE SONT PAS** en git (vérifier `.gitignore`)
- [ ] **APP_KEY** défini en Render (pas en git)
- [ ] **NEXTAUTH_SECRET** défini en Vercel (pas en git)
- [ ] **CORS** configuré pour Vercel URL uniquement
- [ ] **SANCTUM_STATEFUL_DOMAINS** inclut domaine production
- [ ] **APP_DEBUG** = `false` en production
- [ ] **LOG_LEVEL** = `error` en production
- [ ] Tous les **OAuth credentials vides** (sauf si configurés)

---

## 🧪 TESTS SUPPLÉMENTAIRES RECOMMANDÉS

### Test de Charge

```bash
# Installer Apache Bench
ab -n 100 -c 10 https://match-my-formation.vercel.app/fr

# Vérifier que les temps de réponse sont < 1s
```

### Test HTTPS/SSL

```bash
# Vérifier que le certificat est valide
curl -I https://match-my-formation-api.onrender.com/api/health
```

### Test d'Uptime

- Laisser tourner 24h et vérifier les logs
- Monitorer les erreurs dans Render/Vercel dashboards

---

## ⚙️ CONFIGURATION POST-DÉPLOIEMENT

### 1. Email Configuration (Optionnel)

Si vous avez besoin d'envoyer des emails:

```bash
# Dans Render, ajouter dans Environment:
MAIL_MAILER=smtp
MAIL_HOST=smtp.gmail.com
MAIL_PORT=587
MAIL_USERNAME=your-email@gmail.com
MAIL_PASSWORD=your-app-password
MAIL_ENCRYPTION=tls
```

### 2. File Storage (Optionnel)

Pour les uploads de fichiers:

```bash
# Utiliser Render Disk est limité, préférer:
# - AWS S3
# - Google Cloud Storage
# - Cloudinary

# Exemple avec S3:
AWS_ACCESS_KEY_ID=your-key
AWS_SECRET_ACCESS_KEY=your-secret
AWS_DEFAULT_REGION=us-east-1
AWS_BUCKET=your-bucket
```

---

## 🐛 DÉPANNAGE

### Erreur: "CORS policy: Access to XMLHttpRequest blocked"

**Solution:**

```bash
# Vérifier que Vercel URL est dans CORS
curl https://match-my-formation-api.onrender.com/api/health \
  -H "Origin: https://match-my-formation.vercel.app" -I
```

### Erreur: "Sanctum token mismatch"

**Solution:**

- Vérifier `SANCTUM_STATEFUL_DOMAINS` inclut `match-my-formation.vercel.app`
- Nettoyer et régénérer les tokens

### Erreur: "Database connection failed"

**Solution:**

```bash
# Dans Render console:
php artisan tinker
DB::connection()->statement("SELECT 1");
```

### Frontend page blanche

**Solution:**

1. Vérifier NEXT_PUBLIC_API_URL est correct
2. Vérifier les logs: **Vercel Logs** dans le dashboard
3. Vérifier que le bundle est compilé: `npm run build`

### Migrations échouées

**Solution:**

```bash
# Dans Render console:
php artisan migrate:refresh --seed  # ⚠️ Attention: drop + recreate
# ou
php artisan migrate:status  # Pour voir l'état
```

---

## 📞 SUPPORT & RESSOURCES

- **Render Docs:** https://render.com/docs
- **Vercel Docs:** https://vercel.com/docs
- **Laravel Sanctum:** https://laravel.com/docs/sanctum
- **Next.js Auth:** https://next-auth.js.org

---

## ✅ CHECKLIST FINALE DE DÉPLOIEMENT

**Avant de mettre en production:**

- [ ] Tests locaux passent
- [ ] `.prepare-deployment.sh` passe sans erreurs
- [ ] Backend déployé et `health` OK
- [ ] Frontend déployé et charge
- [ ] Login fonctionne
- [ ] CORS headers correct
- [ ] Base données migrée
- [ ] Pas de `.env` en git
- [ ] Variables secrets en Render/Vercel
- [ ] SSL/HTTPS actif sur les deux services

---

**🎉 Prêt pour le déploiement!**

Pour des questions ou problèmes, consultez les logs:

- **Render:** Dashboard → Web Service → Logs
- **Vercel:** Dashboard → Project → Deployments → Logs
