#!/bin/bash

# =============================================================================
# SCRIPT BUILD ET DÉPLOIEMENT FRONTEND - MATCH MY FORMATION
# =============================================================================
# Auteur: Assistant IA
# Date: 14/03/2026
# Version: 3.0
# Build local et déploiement sur PlanetHoster
# =============================================================================

set -e

# Couleurs
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m'

echo -e "${BLUE}🚀 BUILD ET DÉPLOIEMENT FRONTEND - MATCH MY FORMATION${NC}"
echo -e "${YELLOW}Ce script va build le frontend et préparer le déploiement${NC}\n"

# Étape 1: Installation des dépendances
echo -e "${BLUE}📦 Installation des dépendances...${NC}"
cd frontend
npm install

# Étape 2: Build du frontend
echo -e "${BLUE}🔨 Build du frontend...${NC}"
npm run build:webpack

# Étape 3: Vérification du build
echo -e "${BLUE}✅ Vérification du build...${NC}"
if [ ! -d ".next" ]; then
    echo -e "${RED}❌ Le build a échoué${NC}"
    exit 1
fi

echo -e "${GREEN}✅ Build réussi !${NC}"
ls -la .next/

# Étape 4: Préparation pour déploiement
echo -e "${BLUE}📦 Préparation des fichiers pour déploiement...${NC}"
cd ..
mkdir -p deploy-frontend
cp -r frontend/.next deploy-frontend/
cp -r frontend/public deploy-frontend/

# Étape 5: Création du script de déploiement
echo -e "${BLUE}📝 Création du script de déploiement...${NC}"
cat > deploy-frontend-planet.sh << 'EOF'
#!/bin/bash

echo "🚀 DÉPLOIEMENT FRONTEND SUR PLANETHOSTER"

# Variables
FTP_HOST="ftp.planethoster.net"
FTP_USER="jkmxcyrmdv"
FTP_PASS="25417Azer@"
FTP_PATH="/home/jkmxcyrmdv/public_html/matchmyformation"

# Installation lftp si nécessaire
if ! command -v lftp &> /dev/null; then
    echo "Installation de lftp..."
    sudo apt-get update && sudo apt-get install -y lftp
fi

# Déploiement
echo "Déploiement du frontend..."
lftp -u $FTP_USER,$FTP_PASS $FTP_HOST << EOF_FTP
set ftp:ssl-allow no
set ftp:passive-mode on
cd $FTP_PATH
mirror --reverse --delete --verbose ./deploy-frontend/.next/ .next/
mirror --reverse --delete --verbose ./deploy-frontend/public/ public/
quit
EOF_FTP

echo "✅ Déploiement frontend terminé"
EOF

chmod +x deploy-frontend-planet.sh

# Étape 6: Création du .htaccess
echo -e "${BLUE}⚙️ Création du .htaccess...${NC}"
cat > deploy-frontend/.htaccess << 'EOF'
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

echo -e "${GREEN}🎉 Build frontend terminé avec succès !${NC}"
echo -e "${YELLOW}📁 Fichiers prêts dans: deploy-frontend/${NC}"
echo -e "${YELLOW}🚀 Script de déploiement: deploy-frontend-planet.sh${NC}"
echo -e "${YELLOW}🌐 URL finale: https://matchmyformation-e-learning.com.matchmyformation.com${NC}\n"

echo -e "${BLUE}📋 Prochaines étapes:${NC}"
echo "1. ./deploy-frontend-planet.sh"
echo "2. Test: https://matchmyformation-e-learning.com.matchmyformation.com"
