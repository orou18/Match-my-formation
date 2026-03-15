#!/bin/bash

# 🚀 Script de build optimisé pour PlanetHoster
echo "🚀 DÉMARRAGE DU BUILD OPTIMISÉ POUR PLANETHOSTER"

# Variables
FRONTEND_DIR="/home/kisoumare/Match-my-formation/frontend"
BUILD_DIR="$FRONTEND_DIR/out"
DEPLOY_DIR="/home/kisoumare/Match-my-formation/deploy-frontend"

# Nettoyage
echo "🧹 Nettoyage des anciens builds..."
rm -rf "$FRONTEND_DIR/.next"
rm -rf "$FRONTEND_DIR/out"
rm -rf "$DEPLOY_DIR"
mkdir -p "$DEPLOY_DIR"

# Installation des dépendances
echo "📦 Installation des dépendances..."
cd "$FRONTEND_DIR"
npm ci --prefer-offline --no-audit --no-fund

# Optimisation des images si nécessaire
echo "🖼️ Optimisation des images..."
if [ -d "public/images" ]; then
    echo "   → Images déjà optimisées (PNG/JPEG conservés)"
fi

# Build statique optimisé
echo "⚡ Build statique optimisé..."
NODE_ENV=production npm run build

# Export statique
echo "📦 Export statique..."
npm run export

# Copie des fichiers
echo "📂 Copie des fichiers de build..."
cp -r "$FRONTEND_DIR/out/"* "$DEPLOY_DIR/"

# Copie des assets publics
echo "🎨 Copie des assets publics..."
cp -r "$FRONTEND_DIR/public/"* "$DEPLOY_DIR/"

# Optimisation des fichiers
echo "⚡ Optimisation des fichiers..."
find "$DEPLOY_DIR" -name "*.js" -exec gzip -k {} \;
find "$DEPLOY_DIR" -name "*.css" -exec gzip -k {} \;
find "$DEPLOY_DIR" -name "*.html" -exec gzip -k {} \;

# Création du .htaccess optimisé
echo "⚙️ Création du .htaccess optimisé..."
cat > "$DEPLOY_DIR/.htaccess" << 'EOF'
# 🚀 Configuration optimisée pour PlanetHoster
RewriteEngine On

# Compression Gzip/Brotli
<IfModule mod_deflate.c>
    AddOutputFilterByType DEFLATE text/plain
    AddOutputFilterByType DEFLATE text/html
    AddOutputFilterByType DEFLATE text/xml
    AddOutputFilterByType DEFLATE text/css
    AddOutputFilterByType DEFLATE application/xml
    AddOutputFilterByType DEFLATE application/xhtml+xml
    AddOutputFilterByType DEFLATE application/rss+xml
    AddOutputFilterByType DEFLATE application/javascript
    AddOutputFilterByType DEFLATE application/x-javascript
</IfModule>

# Cache navigateur
<IfModule mod_expires.c>
    ExpiresActive On
    ExpiresByType text/css "access plus 1 year"
    ExpiresByType application/javascript "access plus 1 year"
    ExpiresByType image/png "access plus 1 year"
    ExpiresByType image/jpg "access plus 1 year"
    ExpiresByType image/jpeg "access plus 1 year"
    ExpiresByType image/gif "access plus 1 year"
    ExpiresByType image/svg+xml "access plus 1 year"
    ExpiresByType image/webp "access plus 1 year"
    ExpiresByType image/avif "access plus 1 year"
    ExpiresByType font/woff "access plus 1 year"
    ExpiresByType font/woff2 "access plus 1 year"
    ExpiresByType text/html "access plus 1 hour"
</IfModule>

# Headers de cache
<IfModule mod_headers.c>
    <FilesMatch "\.(css|js|png|jpg|jpeg|gif|svg|webp|avif|woff|woff2)$">
        Header set Cache-Control "public, max-age=31536000, immutable"
    </FilesMatch>
    <FilesMatch "\.(html)$">
        Header set Cache-Control "public, max-age=3600"
    </FilesMatch>
    
    # Sécurité
    Header set X-Content-Type-Options nosniff
    Header set X-Frame-Options DENY
    Header set X-XSS-Protection "1; mode=block"
    Header set Referrer-Policy "strict-origin-when-cross-origin"
</IfModule>

# Réécriture URL pour Next.js statique
RewriteCond %{REQUEST_FILENAME} !-f
RewriteCond %{REQUEST_FILENAME} !-d
RewriteRule ^(.*)$ /index.html [L,QSA]

# Servir les fichiers statiques
RewriteCond %{REQUEST_URI} ^/_next/
RewriteRule ^_next/(.*)$ /_next/$1 [L]

RewriteCond %{REQUEST_URI} ^/images/
RewriteRule ^images/(.*)$ /images/$1 [L]

RewriteCond %{REQUEST_URI} ^/videos/
RewriteRule ^videos/(.*)$ /videos/$1 [L]

EOF

# Création de l'index.html avec redirection
echo "📄 Création de l'index.html..."
cat > "$DEPLOY_DIR/index.html" << 'EOF'
<!DOCTYPE html>
<html lang="fr">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Match My Formation - Plateforme E-Learning</title>
    <meta http-equiv="refresh" content="0; url=/fr">
    <style>
        body { 
            font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', 'Roboto', sans-serif; 
            display: flex; 
            justify-content: center; 
            align-items: center; 
            height: 100vh; 
            margin: 0; 
            background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); 
            color: white; 
        }
        .loader { 
            text-align: center; 
        }
        .spinner { 
            border: 4px solid rgba(255,255,255,0.3); 
            border-radius: 50%; 
            border-top: 4px solid white; 
            width: 40px; 
            height: 40px; 
            animation: spin 1s linear infinite; 
            margin: 20px auto; 
        }
        @keyframes spin { 
            0% { transform: rotate(0deg); } 
            100% { transform: rotate(360deg); } 
        }
    </style>
</head>
<body>
    <div class="loader">
        <h2>Match My Formation</h2>
        <div class="spinner"></div>
        <p>Chargement de la plateforme optimisée...</p>
    </div>
</body>
</html>
EOF

# Vérification du build
echo "🔍 Vérification du build..."
BUILD_SIZE=$(du -sh "$DEPLOY_DIR" | cut -f1)
FILE_COUNT=$(find "$DEPLOY_DIR" -type f | wc -l)

echo "✅ Build optimisé terminé !"
echo "📊 Taille du build: $BUILD_SIZE"
echo "📁 Nombre de fichiers: $FILE_COUNT"
echo "🌐 URL de déploiement: https://node22-eu.n0c.com/~jkmxcyrmdv/matchmyformation/"
echo "🚀 Prêt pour le déploiement sur PlanetHoster !"

# Création du script de déploiement
echo "📜 Création du script de déploiement..."
cat > "/home/kisoumare/deploy-optimized.sh" << EOF
#!/bin/bash

# 🚀 Script de déploiement optimisé pour PlanetHoster
FTP_HOST="node22-eu.n0c.com"
FTP_USER="jkmxcyrmdv@matchmyformation-e-learning.com"
FTP_PASS="221Azer/3e6'"
FTP_PATH="/home/jkmxcyrmdv/public_html/matchmyformation"
LOCAL_PATH="$DEPLOY_DIR"

echo "🚀 DÉPLOIEMENT OPTIMISÉ SUR PLANETHOSTER"

lftp -u "\$FTP_USER","\$FTP_PASS" "\$FTP_HOST" << 'EOF_FTP'
set ftp:ssl-allow no
set ftp:passive-mode on
cd "\$FTP_PATH"
rm -rf *
mirror --reverse --delete --verbose "\$LOCAL_PATH/" .
ls -la
quit
EOF_FTP

echo "✅ Déploiement terminé avec succès !"
echo "🌐 URL: https://node22-eu.n0c.com/~jkmxcyrmdv/matchmyformation/"
EOF

chmod +x "/home/kisoumare/deploy-optimized.sh"

echo "🎉 PRÊT POUR LE DÉPLOIEMENT !"
echo "👉 Exécutez: /home/kisoumare/deploy-optimized.sh"
