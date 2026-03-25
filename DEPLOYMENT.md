# Match My Formation - Guide de Déploiement

## Architecture
- **Frontend**: Next.js 16 déployé sur Vercel
- **Backend**: API Next.js déployée sur Render
- **Base de données**: PostgreSQL sur Render
- **Cache**: Redis sur Render

## Prérequis
- Compte GitHub avec le repository
- Compte Vercel (gratuit)
- Compte Render (gratuit)

## Étape 1: Configuration des variables d'environnement

### Variables Vercel (Frontend)
```
NEXT_PUBLIC_API_URL=https://match-my-formation.onrender.com
NEXT_PUBLIC_FRONTEND_URL=https://match-my-formation.vercel.app
NEXTAUTH_URL=https://match-my-formation.vercel.app
NEXTAUTH_SECRET=votre-secret-key
```

### Variables Render (Backend)
```
NODE_ENV=production
PORT=3000
DATABASE_URL=postgresql://...
REDIS_URL=redis://...
NEXTAUTH_URL=https://match-my-formation.onrender.com
NEXTAUTH_SECRET=votre-secret-key
NEXT_PUBLIC_API_URL=https://match-my-formation.onrender.com
NEXT_PUBLIC_FRONTEND_URL=https://match-my-formation.vercel.app
```

## Étape 2: Déploiement du Backend sur Render

1. Allez sur [Render.com](https://render.com)
2. Connectez votre compte GitHub
3. Cliquez sur "New +" → "Web Service"
4. Sélectionnez le repository `Match-my-formation`
5. Configurez:
   - **Name**: `match-my-formation-api`
   - **Runtime**: `Node`
   - **Build Command**: `cd frontend && npm install && npm run build`
   - **Start Command**: `cd frontend && npm start`
   - **Instance Type**: `Free`
6. Ajoutez les variables d'environnement
7. Créez les services:
   - PostgreSQL (`match-my-formation-db`)
   - Redis (`match-my-formation-redis`)
8. Cliquez sur "Create Web Service"

## Étape 3: Déploiement du Frontend sur Vercel

1. Allez sur [Vercel.com](https://vercel.com)
2. Connectez votre compte GitHub
3. Cliquez sur "Add New..." → "Project"
4. Sélectionnez le repository `Match-my-formation`
5. Configurez:
   - **Framework Preset**: `Next.js`
   - **Root Directory**: `frontend`
   - **Build Command**: `npm run build`
   - **Output Directory**: `.next`
6. Ajoutez les variables d'environnement
7. Cliquez sur "Deploy"

## Étape 4: Configuration du domaine personnalisé (optionnel)

### Sur Vercel
1. Allez dans les settings du projet
2. Cliquez sur "Domains"
3. Ajoutez votre domaine (ex: `match-my-formation.com`)
4. Configurez les enregistrements DNS

### Sur Render
1. Allez dans les settings du service
2. Cliquez on "Custom Domains"
3. Ajoutez votre domaine API (ex: `api.match-my-formation.com`)

## Étape 5: Configuration de la base de données

1. Sur Render, allez sur votre service PostgreSQL
2. Utilisez "psql Shell" pour exécuter:
```sql
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";
```

3. Configurez les tables initiales si nécessaire

## Étape 6: Test de l'application

1. Vérifiez que le frontend est accessible sur Vercel
2. Vérifiez que l'API est accessible sur Render
3. Testez l'inscription/connexion
4. Testez l'upload de vidéos
5. Vérifiez la communication entre les services

## URLs finales
- **Frontend**: `https://match-my-formation.vercel.app`
- **Backend API**: `https://match-my-formation.onrender.com`
- **Base de données**: `https://dashboard.render.com/d/...`

## Monitoring

### Sur Vercel
- Logs et métriques dans le dashboard
- Analytics des performances

### Sur Render
- Logs dans le service dashboard
- Métriques de performance
- Monitoring de la base de données

## Dépannage

### Erreurs communes
1. **CORS**: Configurez les headers dans vercel.json
2. **Timeout**: Augmentez `maxDuration` dans les fonctions
3. **Memory limit**: Optimisez les images et vidéos
4. **Database connection**: Vérifiez les connection strings

### Debug
- Utilisez les logs de Vercel et Render
- Testez localement avec les variables de production
- Vérifiez la configuration CORS

## Maintenance

### Mises à jour
1. Push sur la branche main
2. Déploiement automatique sur Vercel et Render
3. Vérifiez le bon fonctionnement

### Backups
- Render backup automatique de PostgreSQL
- Export manuel des données si nécessaire
