#!/bin/bash

# Script de build complet pour PlanetHoster
echo "🚀 Build complet pour Match My Formation - PlanetHoster"

# Nettoyage pré-build
echo "🧹 Nettoyage des caches..."
rm -rf .next out node_modules/.cache
npm run clean

# Installation des dépendances
echo "📦 Installation des dépendances..."
npm ci

# Configuration pour PlanetHoster
echo "⚙️ Configuration pour PlanetHoster..."
cp env.planethoster .env.local

# Build optimisé
echo "🔨 Build optimisé..."
NODE_ENV=production npm run build

# Export statique
echo "📦 Export statique..."
npm run build:static

# Optimisation des images
echo "🖼️ Optimisation des images..."
find out -name "*.jpg" -exec jpegoptim --max=80 --strip-all {} \;
find out -name "*.png" -exec pngquant --quality=65-80 --ext=.png --force {} \;

# Compression Gzip
echo "🗜️ Compression Gzip..."
npm run compress

# Création du fichier .htaccess pour PlanetHoster
echo "📝 Configuration .htaccess..."
cat > out/.htaccess << 'EOF'
# Configuration PlanetHoster pour Next.js
Options -MultiViews
RewriteEngine On

# Forcer HTTPS
RewriteCond %{HTTPS} off
RewriteRule ^(.*)$ https://%{HTTP_HOST}%{REQUEST_URI} [L,R=301]

# Headers de cache
<IfModule mod_expires.c>
  ExpiresActive On
  ExpiresByType text/css "access plus 1 year"
  ExpiresByType application/javascript "access plus 1 year"
  ExpiresByType image/png "access plus 1 year"
  ExpiresByType image/jpg "access plus 1 year"
  ExpiresByType image/jpeg "access plus 1 year"
  ExpiresByType image/gif "access plus 1 year"
  ExpiresByType image/webp "access plus 1 year"
  ExpiresByType image/svg+xml "access plus 1 year"
  ExpiresByType application/font-woff "access plus 1 year"
  ExpiresByType application/font-woff2 "access plus 1 year"
</IfModule>

# Compression Gzip
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
  AddOutputFilterByType DEFLATE application/json
</IfModule>

# Headers de sécurité
<IfModule mod_headers.c>
  Header always set X-Content-Type-Options nosniff
  Header always set X-Frame-Options DENY
  Header always set X-XSS-Protection "1; mode=block"
  Header always set Referrer-Policy "strict-origin-when-cross-origin"
  Header always set Content-Security-Policy "default-src 'self'; script-src 'self' 'unsafe-inline' 'unsafe-eval'; style-src 'self' 'unsafe-inline'; img-src 'self' data: https:; font-src 'self' data:;"
</IfModule>

# Réécriture URL pour Next.js
RewriteCond %{REQUEST_FILENAME} !-f
RewriteCond %{REQUEST_FILENAME} !-d
RewriteRule ^(.*)$ /index.html [L,QSA]

# Pages d'erreur personnalisées
ErrorDocument 404 /404.html
ErrorDocument 500 /500.html
EOF

# Vérification finale
echo "✅ Vérification du build..."
if [ -d "out" ] && [ -f "out/index.html" ]; then
  echo "✅ Build réussi !"
  echo "📁 Fichiers générés dans : out/"
  echo "📊 Taille du build : $(du -sh out | cut -f1)"
  echo "🚀 Prêt pour le déploiement sur PlanetHoster"
else
  echo "❌ Erreur de build"
  exit 1
fi

# Création du rapport
echo "📊 Génération du rapport..."
cat > build-report.txt << EOF
=== Build Report - Match My Formation ===
Date: $(date)
Node: $(node --version)
NPM: $(npm --version)
Environment: Production
Target: PlanetHoster

Build Size: $(du -sh out | cut -f1)
Files: $(find out -type f | wc -l)

Images: $(find out -name "*.jpg" -o -name "*.png" -o -name "*.webp" | wc -l)
CSS: $(find out -name "*.css" | wc -l)
JS: $(find out -name "*.js" | wc -l)

Optimizations:
- Images compressées
- Gzip activé
- Cache headers configurés
- Security headers ajoutés
EOF

echo "🎉 Build terminé !"
echo "📋 Rapport disponible dans build-report.txt"
echo "🚀 Déployez avec : rsync -avz --delete out/ user@votre-domaine.planethoster.net:/public_html/"
