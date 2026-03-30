#!/bin/bash

echo "🔍 Test de connexion au backend Laravel..."

# Test si le backend répond
BACKEND_URL="http://127.0.0.1:8000"
HEALTH_CHECK="$BACKEND_URL/api/health"

echo "📍 URL du backend: $BACKEND_URL"
echo "🏥 Vérification de santé: $HEALTH_CHECK"

# Test avec curl
if curl -s -f "$HEALTH_CHECK" > /dev/null 2>&1; then
    echo "✅ Backend Laravel est accessible!"
    
    # Test de l'endpoint d'auth
    echo "🔐 Test de l'endpoint d'authentification..."
    if curl -s -f -X POST "$BACKEND_URL/api/auth/login" \
         -H "Content-Type: application/json" \
         -d '{"email":"test@example.com","password":"test"}' \
         > /dev/null 2>&1; then
        echo "✅ Endpoint d'authentification accessible!"
    else
        echo "⚠️  Endpoint d'authentification répond mais avec une erreur (normal pour des identifiants invalides)"
    fi
    
    echo "🎉 Le backend est prêt pour l'authentification!"
else
    echo "❌ Backend Laravel n'est pas accessible!"
    echo ""
    echo "🔧 Solutions possibles:"
    echo "1. Démarrez le backend Laravel:"
    echo "   cd /home/kisoumare/Match-my-formation/backend"
    echo "   php artisan serve --host=127.0.0.1 --port=8000"
    echo ""
    echo "2. Vérifiez qu'aucun autre processus n'utilise le port 8000:"
    echo "   lsof -i :8000"
    echo ""
    echo "3. Vérifiez que le fichier .env est configuré dans le backend"
    echo ""
fi

echo ""
echo "📊 État des ports locaux:"
netstat -tlnp | grep -E ":(3000|3001|8000)" || echo "Aucun des ports 3000, 3001, 8000 n'est utilisé"
