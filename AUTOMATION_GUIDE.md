# 🤖 Guide d'Automatisation Déploiement PlanetHoster

## 📋 Vue d'ensemble

Deux solutions d'automatisation complètes pour déployer **Match My Formation** sur PlanetHoster :

1. **Script Local** : `auto-deploy-planethoster.sh`
2. **GitHub Actions** : `auto-deploy-planethoster.yml`

---

## 🖥️ **Option 1: Script Local Automatisé**

### 🎯 **Quand l'utiliser ?**
- Déploiement depuis votre machine locale
- Tests en environnement de développement
- Déploiement manuel avec contrôle total

### 📦 **Prérequis**
```bash
# Commandes nécessaires
git, mysql, ssh, rsync, curl, php, composer, npm

# Installation sur Ubuntu/Debian
sudo apt update
sudo apt install git mysql-client ssh rsync curl php php-cli composer nodejs npm
```

### 🚀 **Utilisation**

#### 1. **Configuration Initiale**
```bash
# Rendre le script exécutable
chmod +x auto-deploy-planethoster.sh

# Éditer les variables de configuration
nano auto-deploy-planethoster.sh
```

#### 2. **Variables à Configurer**
```bash
# Dans le script, modifiez ces lignes :
PLANETHOSTER_DOMAIN="matchmyformation-e-learning.com.matchmyformation.com"
PLANETHOSTER_HOST="ftp.planethoster.net"
PLANETHOSTER_USER="agto0195"
PLANETHOSTER_PASSWORD="25417Azer@"
PLANETHOSTER_PORT="21"
PLANETHOSTER_PATH="/home/agto0195/public_html/matchmyformation"

DB_NAME="agto0195_matchmyformation_bdd"
DB_USER="agto0195_matchmyformation_user"
DB_PASSWORD="25417Azer@"
```

#### 3. **Exécution du Déploiement**
```bash
# Lancer le déploiement complet
./auto-deploy-planethoster.sh

# Le script va :
# 1. ✅ Vérifier les prérequis
# 2. ✅ Cloner la branche prod_hoster
# 3. ✅ Build le frontend Next.js
# 4. ✅ Configurer le backend Laravel
# 5. ✅ Importer la base de données
# 6. ✅ Optimiser le build
# 7. ✅ Déployer sur PlanetHoster
# 8. ✅ Configurer le serveur
# 9. ✅ Générer un rapport
```

#### 4. **Rapport de Déploiement**
```bash
# Le script génère :
- deployment-report.txt (rapport détaillé)
- deploy-config.env (configuration sauvegardée)
- build-deploy/ (fichiers de build)
```

---

## 🔄 **Option 2: GitHub Actions Automatisé**

### 🎯 **Quand l'utiliser ?**
- Déploiement automatique à chaque push
- Environnement de production
- Équipe de développement multiple
- CI/CD complet

### 📦 **Prérequis**

#### 1. **Secrets GitHub**
Allez dans : `GitHub Repository > Settings > Secrets and variables > Actions`

```yaml
# Secrets à créer :
PLANETHOSTER_DOMAIN=matchmyformation-e-learning.com.matchmyformation.com
PLANETHOSTER_HOST=ssh.planethoster.net
PLANETHOSTER_USER=agto0195
PLANETHOSTER_PASSWORD=25417Azer@
PLANETHOSTER_PORT=22
PLANETHOSTER_PATH=/home/agto0195/public_html/matchmyformation

DB_NAME=agto0195_matchmyformation_bdd
DB_USER=agto0195_matchmyformation_user
DB_PASSWORD=25417Azer@
```

#### 2. **Configuration SSH (Optionnel)**
```bash
# Pour une connexion SSH sécurisée, utilisez des clés :
ssh-keygen -t rsa -b 4096 -C "github-actions"

# Ajoutez la clé publique à PlanetHoster
# Ajoutez la clé privée dans les secrets GitHub (SSH_PRIVATE_KEY)
```

### 🚀 **Utilisation**

#### 1. **Déclenchement Automatique**
```bash
# Le workflow se déclenche automatiquement sur :
- Push sur la branche prod_hoster
- Pull Request sur prod_hoster
- Déclenchement manuel via l'interface GitHub
```

#### 2. **Déclenchement Manuel**
1. Allez dans `GitHub Repository > Actions`
2. Sélectionnez `🚀 Auto-Deploy PlanetHoster`
3. Cliquez sur `Run workflow`
4. Choisissez l'environnement (production/staging)

#### 3. **Étapes du Workflow**
```yaml
🔨 Build & Validation:
  - Checkout code
  - Setup Node.js + PHP
  - Install dependencies
  - Build frontend
  - Validate backend
  - Generate build report

🚀 Deploy to PlanetHoster:
  - Download artifacts
  - Configure environment
  - Deploy files via SCP
  - Setup on server via SSH
  - Create .htaccess
  - Test deployment

📢 Notify Deployment:
  - Send success/failure notification
```

---

## 🔧 **Configuration Avancée**

### 📁 **Structure des Fichiers**
```
Match-my-formation/
├── auto-deploy-planethoster.sh          # Script local
├── .github/workflows/
│   └── auto-deploy-planethoster.yml    # GitHub Actions
├── deploy-config.env                    # Config générée
├── build-deploy/                        # Build temporaire
├── deployment-report.txt                # Rapport de déploiement
└── database-complete.sql                # Base de données
```

### 🎯 **Personnalisation**

#### Script Local
```bash
# Ajouter des étapes personnalisées dans auto-deploy-planethoster.sh
custom_backup() {
    # Backup avant déploiement
    mysqldump -u $DB_USER -p$DB_PASSWORD $DB_NAME > backup-$(date +%Y%m%d).sql
}

custom_tests() {
    # Tests personnalisés
    npm run test
}
```

#### GitHub Actions
```yaml
# Ajouter des jobs personnalisés dans auto-deploy-planethoster.yml
custom-tests:
  runs-on: ubuntu-latest
  steps:
    - name: Run Custom Tests
      run: |
        npm run test:e2e
        npm run test:performance
```

---

## 🚨 **Dépannage**

### ❌ **Erreurs Communes**

#### 1. **Connexion SSH/FTP**
```bash
# Erreur : Permission denied
# Solution : Vérifiez les identifiants et la configuration SSH

# Test de connexion :
ssh $PLANETHOSTER_USER@$PLANETHOSTER_HOST
```

#### 2. **Base de Données**
```bash
# Erreur : Access denied
# Solution : Vérifiez que la BDD existe et les permissions

# Test BDD :
mysql -u $DB_USER -p$DB_PASSWORD $DB_NAME -e "SHOW TABLES;"
```

#### 3. **Build Frontend**
```bash
# Erreur : Build failed
# Solution : Vérifiez les dépendances Node.js

# Solution :
cd frontend
rm -rf node_modules package-lock.json
npm install
npm run build
```

#### 4. **Permissions**
```bash
# Erreur : Permission denied
# Solution : Corrigez les permissions sur le serveur

chmod -R 755 /home/agto0195/public_html/matchmyformation
chmod -R 755 /home/agto0195/public_html/matchmyformation/backend/storage
```

### 🔍 **Logs et Debug**

#### Script Local
```bash
# Activer le mode debug
set -x  # Au début du script

# Logs détaillés
exec > >(tee -a deploy.log) 2>&1
```

#### GitHub Actions
```bash
# Voir les logs dans l'interface GitHub
# Actions > Select workflow > View job logs
```

---

## 📊 **Monitoring et Maintenance**

### 📈 **Après Déploiement**
```bash
# Tests automatisés
curl -I https://matchmyformation-e-learning.com.matchmyformation.com
curl -I https://matchmyformation-e-learning.com.matchmyformation.com/api/health

# Vérifier les logs
tail -f ~/logs/error_log
tail -f backend/storage/logs/laravel.log
```

### 🔄 **Mises à Jour**
```bash
# Pour mettre à jour le site :
git pull origin prod_hoster
./auto-deploy-planethoster.sh

# Ou via GitHub Actions :
git push origin prod_hoster
```

---

## 🎉 **Bonnes Pratiques**

### ✅ **Avant Déploiement**
1. **Tester en local** : `npm run build`
2. **Vérifier les secrets** : GitHub Secrets
3. **Backup la base de données** : `mysqldump`
4. **Vérifier les permissions** : SSH/FTP

### ✅ **Pendant Déploiement**
1. **Surveiller les logs** : En temps réel
2. **Tester les URLs** : Automatiquement
3. **Vérifier le rapport** : deployment-report.txt

### ✅ **Après Déploiement**
1. **Tests manuels** : Login, navigation
2. **Performance** : Lighthouse
3. **Sécurité** : Headers SSL
4. **Monitoring** : Uptime monitoring

---

## 🚀 **Déploiement Rapide**

### 🎯 **En 5 Minutes**
```bash
# 1. Configuration rapide
cp auto-deploy-planethoster.sh.template auto-deploy-planethoster.sh
# Éditer les variables

# 2. Lancement
./auto-deploy-planethoster.sh

# 3. Attente (5-10 minutes)
# Le script fait tout automatiquement

# 4. Test
curl https://matchmyformation-e-learning.com.matchmyformation.com
```

### 🎯 **GitHub Actions (1 minute)**
```bash
# 1. Configurer les secrets GitHub
# 2. Push sur prod_hoster
git add .
git commit -m "Deploy to production"
git push origin prod_hoster

# 3. Le workflow s'exécute automatiquement
# 4. Site déployé en 5-10 minutes
```

---

## 📞 **Support**

### 🆘 **En cas de problème**
1. **Vérifier les logs** : `deployment-report.txt`
2. **Tester manuellement** : Étapes individuelles
3. **Consulter la documentation** : `PLANETHOSTER_DEPLOYMENT.md`
4. **Contact support** : PlanetHoster + GitHub Support

### 📚 **Ressources**
- **Documentation PlanetHoster** : https://docs.planethoster.com
- **GitHub Actions Docs** : https://docs.github.com/actions
- **Laravel Deployment** : https://laravel.com/docs/deployment
- **Next.js Deployment** : https://nextjs.org/docs/deployment

---

**🎉 Avec ces scripts, votre déploiement est 100% automatisé et fiable !**
