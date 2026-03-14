# 🚀 GUIDE COMPLET DÉPLOIEMENT PLANETHOSTER - MATCH MY FORMATION
# Auteur: Assistant IA
# Date: 14/03/2026
# Version: 2.0

## 📋 VOS INFORMATIONS PLANETHOSTER
- Domaine: matchmyformation-e-learning.com.matchmyformation.com
- Base de données: jkmxcyrmdv_matchmyformation_bdd
- Utilisateur BDD: jkmxcyrmdv_match_user
- Utilisateur FTP: jkmxcyrmdv
- Mot de passe: 25417Azer@

---

## ⚡ ÉTAPE 1: PRÉPARATION SUR VOTRE MACHINE LOCALE

### 1.1 Vérification et Installation Node.js
```bash
# Vérifier si Node.js est installé
node --version
npm --version

# Si Node.js n'est pas installé, installez-le :
curl -fsSL https://deb.nodesource.com/setup_18.x | sudo -E bash -
sudo apt-get install -y nodejs

# Vérifier à nouveau
node --version
npm --version
```

### 1.2 Nettoyage des anciens fichiers
```bash
# Nettoyer les anciens builds
rm -rf ./Match-my-formation
rm -rf ./deploy-final
rm -rf ./build-temp
```

### 1.3 Clonage du code source
```bash
# Cloner la branche prod_hoster
git clone -b prod_hoster https://github.com/orou18/Match-my-formation.git

# Vérifier que le code est bien cloné
cd Match-my-formation
ls -la
cd ..
```

### 1.4 Build du frontend Next.js
```bash
# Aller dans le frontend
cd Match-my-formation/frontend

# Installation des dépendances
npm ci

# Build du frontend
npm run build --webpack

# Vérifier que le build a réussi
ls -la .next/

# Retour au répertoire principal
cd ../..
```

### 1.5 Préparation des fichiers pour déploiement
```bash
# Créer le dossier de déploiement
mkdir -p deploy-final

# Copier les fichiers nécessaires
cp -r Match-my-formation/frontend/.next deploy-final/
cp -r Match-my-formation/frontend/public deploy-final/
cp -r Match-my-formation/backend deploy-final/
cp Match-my-formation/database-complete.sql deploy-final/

# Vérifier le contenu
ls -la deploy-final/
```

### 1.6 Création du fichier .htaccess
```bash
# Créer le fichier .htaccess dans deploy-final/
cat > deploy-final/.htaccess << 'EOF'
# Configuration PlanetHoster pour Match My Formation
Options -MultiViews
RewriteEngine On

# Forcer HTTPS
RewriteCond %{HTTPS} off
RewriteRule ^(.*)$ https://%{HTTP_HOST}%{REQUEST_URI} [L,R=301]

# Redirection vers frontend
RewriteCond %{REQUEST_URI} !^/api/
RewriteCond %{REQUEST_URI} !^/storage/
RewriteCond %{REQUEST_FILENAME} !-f
RewriteCond %{REQUEST_FILENAME} !-d
RewriteRule ^(.*)$ /index.html [L,QSA]

# API Laravel
RewriteCond %{REQUEST_URI} ^/api/
RewriteRule ^api/(.*)$ backend/public/index.php/$1 [L]

# Headers de sécurité
<IfModule mod_headers.c>
  Header always set X-Content-Type-Options nosniff
  Header always set X-Frame-Options DENY
  Header always set X-XSS-Protection "1; mode=block"
  Header always set Content-Security-Policy "default-src 'self'; script-src 'self' 'unsafe-inline' 'unsafe-eval'; style-src 'self' 'unsafe-inline'; img-src 'self' data: https:; font-src 'self' data:;"
</IfModule>

# Compression
<IfModule mod_deflate.c>
  AddOutputFilterByType DEFLATE text/plain text/html text/xml text/css application/javascript application/json
</IfModule>

# Cache
<IfModule mod_expires.c>
  ExpiresActive On
  ExpiresByType text/css "access plus 1 year"
  ExpiresByType application/javascript "access plus 1 year"
  ExpiresByType image/png "access plus 1 year"
  ExpiresByType image/jpg "access plus 1 year"
  ExpiresByType image/webp "access plus 1 year"
</IfModule>
EOF
```

---

## 🌐 ÉTAPE 2: DÉPLOIEMENT FTP SUR PLANETHOSTER

### 2.1 Option A: Via FileZilla (Recommandé)
```
1. Ouvrir FileZilla
2. Connexion:
   - Hôte: ftp.planethoster.net
   - Utilisateur: jkmxcyrmdv
   - Mot de passe: 25417Azer@
   - Port: 21
3. Naviguer vers: /home/jkmxcyrmdv/public_html/matchmyformation
4. Uploadez TOUT le contenu de deploy-final/ dans ce dossier
```

### 2.2 Option B: Via Script FTP (si lftp installé)
```bash
# Installation de lftp (si nécessaire)
sudo apt-get install -y lftp

# Script de déploiement FTP
cat > deploy-ftp.sh << 'EOF'
#!/bin/bash
echo "🚀 Déploiement FTP sur PlanetHoster"
lftp -u jkmxcyrmdv,25417Azer@ ftp.planethoster.net << EOF
set ftp:ssl-allow no
set ftp:passive-mode on
cd /home/jkmxcyrmdv/public_html/matchmyformation
mirror --reverse --delete --verbose ./deploy-final/ .
quit
EOF
echo "✅ Déploiement FTP terminé"

chmod +x deploy-ftp.sh
./deploy-ftp.sh
```

---

## 🔧 ÉTAPE 3: CONFIGURATION SERVEUR PLANETHOSTER

### 3.1 Connexion SSH
```bash
# Se connecter en SSH à PlanetHoster
ssh jkmxcyrmdv@ssh.planethoster.net

# Ou via Terminal cPanel
```

### 3.2 Configuration du backend Laravel
```bash
# Naviguer vers le répertoire du backend
cd /home/jkmxcyrmdv/public_html/matchmyformation/backend

# Copier la configuration
cp env.planethoster .env

# Installer les dépendances PHP
composer install --no-dev --optimize-autoloader --no-interaction

# Configuration Laravel
php artisan key:generate --force
php artisan storage:link

# Configuration des permissions
chmod -R 755 storage bootstrap/cache
chmod -R 755 public/storage

# Nettoyage des caches
php artisan cache:clear
php artisan view:clear
php artisan route:clear
php artisan config:clear

# Optimisation
php artisan config:cache
php artisan route:cache
php artisan view:cache

# Vérification
php artisan about
```

---

## 🗄️ ÉTAPE 4: BASE DE DONNÉES

### 4.1 Importation via phpMyAdmin
```
1. Se connecter à cPanel
2. Allez dans "Bases de données MySQL" > "phpMyAdmin"
3. Sélectionner: jkmxcyrmdv_matchmyformation_bdd
4. Cliquer sur "Importer"
5. Choisir le fichier: database-complete.sql
6. Cliquer sur "Exécuter"
```

### 4.2 Finalisation des migrations
```bash
# Via SSH sur PlanetHoster
cd /home/jkmxcyrmdv/public_html/matchmyformation/backend

# Migration finale
php artisan migrate --force

# Vérification finale
php artisan about
```

---

## 🧪 ÉTAPE 5: TESTS FINAUX

### 5.1 Tests des URLs
```bash
# Test de l'URL principale
curl -I https://matchmyformation-e-learning.com.matchmyformation.com

# Test de l'API
curl -I https://matchmyformation-e-learning.com.matchmyformation.com/api/health

# Test de la page de login
curl -I https://matchmyformation-e-learning.com.matchmyformation.com/fr/login
```

### 5.2 Tests manuels dans le navigateur
```
1. URL principale: https://matchmyformation-e-learning.com.matchmyformation.com
2. Page de login: https://matchmyformation-e-learning.com.matchmyformation.com/fr/login
3. Test des comptes:
   - student@match.com / Azerty123!
   - creator@match.com / Azerty123!
   - admin@match.com / Azerty123!
```

---

## 📊 RÉSULTAT ATTENDU

### ✅ Ce que vous aurez:
- Site entièrement fonctionnel sur PlanetHoster
- Base de données riche avec 50+ cours et 20+ vidéos
- Images libres de droits optimisées
- Authentification sociale fonctionnelle
- Dashboard complet pour étudiants/créateurs
- Performance optimisée

### 🎯 Structure finale sur PlanetHoster:
```
/home/jkmxcyrmdv/public_html/matchmyformation/
├── .next/                    (build Next.js)
├── public/                   (images, css, js)
├── backend/                  (Laravel)
│   ├── .env                 (configuré)
│   ├── storage/             (liens symboliques)
│   └── vendor/              (dépendances PHP)
├── .htaccess                (configuration Apache)
└── database-complete.sql    (importé)
```

---

## 🚨 DÉPANNAGE

### Erreurs communes:
1. **Permission denied**: `chmod -R 755 storage bootstrap/cache`
2. **Database connection**: Vérifiez les identifiants dans .env
3. **Build failed**: Assurez-vous que Node.js est installé localement
4. **Images not loading**: Vérifiez les permissions du dossier public

### Logs à vérifier:
```bash
# Logs Laravel
tail -f /home/jkmxcyrmdv/public_html/matchmyformation/backend/storage/logs/laravel.log

# Logs Apache
tail -f /home/jkmxcyrmdv/logs/error_log
```

---

## 🎉 DÉPLOIEMENT TERMINÉ

### ✅ Votre site est en production!
- **URL**: https://matchmyformation-e-learning.com.matchmyformation.com
- **Admin**: admin@match.com / Azerty123!
- **Support**: Contactez PlanetHoster si problème serveur

### 🔄 Pour les futures mises à jour:
```bash
# 1. Build local
cd Match-my-formation/frontend
npm run build --webpack

# 2. Upload du nouveau .next/
# 3. Configuration serveur si nécessaire
```

---

**🚀 Félicitations! Votre site Match My Formation est maintenant déployé sur PlanetHoster!**
