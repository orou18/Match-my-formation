# Déploiement Propre via GitHub

## 🎯 Objectif
Faire un déploiement 100% GitHub sans fichiers ZIP, scripts manuels ou configurations locales.

## ✅ Nettoyage Effectué

### 1. Suppression des fichiers inutiles
- ❌ Tous les scripts shell `deploy*.sh`
- ❌ Tous les fichiers de configuration `*production*`
- ❌ Tous les fichiers ZIP et archives

### 2. Configuration GitHub propre
- ✅ `.gitignore` mis à jour pour exclure les artifacts
- ✅ GitHub Actions avec tests et déploiement automatique
- ✅ Workflow avec backup automatique sur le serveur

## 🚀 Workflow de Déploiement

### Backend Laravel (o2switch)
1. **Trigger** : Push sur `main`
2. **Tests** : PHPUnit automatiques
3. **Build** : Composer + NPM optimisé
4. **Package** : Archive tar.gz propre
5. **Déploiement** : FTP vers o2switch
6. **Setup** : Migration + optimisation

### Frontend Next.js (Vercel)
1. **Trigger** : Push sur `main`
2. **Build** : Next.js automatique
3. **Déploiement** : Vercel instantané

## 🔧 Configuration Requise

### Secrets GitHub (Backend)
```bash
APP_KEY=base64:VOTRE_CLE_LARAVEL
DB_PASSWORD=25417Azer@
MAIL_USERNAME=contact@matchmyformation-e-learning.com.matchmyformation.com
MAIL_PASSWORD=VOTRE_MOT_DE_PASSE_EMAIL
JWT_SECRET=VOTRE_SECRET_JWT
FTP_HOST=VOTRE_SERVEUR_O2SWITCH
FTP_USERNAME=VOTRE_IDENTIFIANT_FTP
FTP_PASSWORD=VOTRE_MOT_DE_PASSE_FTP
```

### Variables Vercel (Frontend)
```bash
NEXT_PUBLIC_API_URL=https://matchmyformation-e-learning.com.matchmyformation.com/api
NEXT_PUBLIC_APP_URL=https://matchmyformation-e-learning.com.matchmyformation.com
NEXT_PUBLIC_ENVIRONMENT=production
```

## 📋 Instructions Détaillées

### 1. Préparer les Repositories

#### Backend
```bash
cd backend
git init
git add .
git commit -m "Initial backend setup"
git branch -M main
git remote add origin https://github.com/votre-username/match-my-formation-backend.git
git push -u origin main
```

#### Frontend  
```bash
cd frontend
git init
git add .
git commit -m "Initial frontend setup"
git branch -M main
git remote add origin https://github.com/votre-username/match-my-formation-frontend.git
git push -u origin main
```

### 2. Configurer les Secrets

1. Allez sur GitHub → Repository → Settings → Secrets
2. Ajoutez tous les secrets listés ci-dessus
3. Activez "Actions" dans les repository settings

### 3. Connecter Vercel

1. Allez sur [vercel.com](https://vercel.com)
2. "New Project" → Importez le repository frontend
3. Ajoutez les variables d'environnement
4. Déployez automatiquement

### 4. Premier Déploiement

1. **Backend** : Push sur `main` → GitHub Actions s'exécute
2. **Frontend** : Push sur `main` → Vercel build automatique

## 🔍 Monitoring

### GitHub Actions
- Allez dans l'onglet "Actions" de votre repository
- Vérifiez que les tests passent
- Suivez les logs de déploiement

### Vercel Dashboard
- Monitoring en temps réel
- Analytics et performances
- Rollback en 1 clic

## 🛡️ Sécurité

- ✅ Aucun secret dans le code
- ✅ Variables d'environnement isolées
- ✅ Backup automatique avant déploiement
- ✅ Tests obligatoires avant production

## 🎉 Résultat

Vous avez maintenant :
- Un déploiement 100% automatisé
- Zéro manipulation manuelle
- Pipeline CI/CD professionnel
- Monitoring et rollback faciles

Plus besoin de ZIP ou de scripts locaux ! 🚀
