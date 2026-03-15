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
