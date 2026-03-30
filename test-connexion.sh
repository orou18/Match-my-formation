#!/bin/bash

echo "🔍 Test de connexion complète Frontend ↔ Backend"
echo "=================================================="

# Test 1: Vérifier que les serveurs tournent
echo "📍 1. Vérification des serveurs..."

# Backend Laravel
if ss -tlnp | grep -q :8000; then
    echo "✅ Backend Laravel: EN LIGNE (port 8000)"
else
    echo "❌ Backend Laravel: HORS LIGNE (port 8000)"
    exit 1
fi

# Frontend Next.js
if ss -tlnp | grep -q :3001; then
    echo "✅ Frontend Next.js: EN LIGNE (port 3001)"
elif ss -tlnp | grep -q :3000; then
    echo "✅ Frontend Next.js: EN LIGNE (port 3000)"
else
    echo "❌ Frontend Next.js: HORS LIGNE (ports 3000/3001)"
    exit 1
fi

echo ""

# Test 2: Health check du backend
echo "🏥 2. Health check du backend..."
HEALTH_RESPONSE=$(curl -s http://127.0.0.1:8000/api/health)
if echo "$HEALTH_RESPONSE" | grep -q '"status":"ok"'; then
    echo "✅ Backend health: OK"
else
    echo "❌ Backend health: ÉCHEC"
    echo "Réponse: $HEALTH_RESPONSE"
fi

echo ""

# Test 3: Test CORS (requête préflight)
echo "🌐 3. Test CORS (OPTIONS)..."
CORS_RESPONSE=$(curl -s -I -X OPTIONS -H "Origin: http://localhost:3001" -H "Access-Control-Request-Method: POST" -H "Access-Control-Request-Headers: Content-Type,Authorization" http://127.0.0.1:8000/api/auth/login)

if echo "$CORS_RESPONSE" | grep -q "Access-Control-Allow-Origin: http://localhost:3001"; then
    echo "✅ CORS: CONFIGURÉ CORRECTEMENT"
else
    echo "❌ CORS: MAL CONFIGURÉ"
    echo "Réponse: $CORS_RESPONSE"
fi

echo ""

# Test 4: Test d'authentification (POST)
echo "🔐 4. Test d'authentification..."
AUTH_RESPONSE=$(curl -s -w "%{http_code}" -X POST \
    -H "Content-Type: application/json" \
    -H "Accept: application/json" \
    -H "Origin: http://localhost:3001" \
    -d '{"email":"test@example.com","password":"testpassword"}' \
    http://127.0.0.1:8000/api/auth/login)

HTTP_CODE="${AUTH_RESPONSE: -3}"
RESPONSE_BODY="${AUTH_RESPONSE%???}"

if [ "$HTTP_CODE" = "401" ] || [ "$HTTP_CODE" = "422" ]; then
    echo "✅ Authentification: RÉSEAU OK (HTTP $HTTP_CODE - identifiants invalides, c'est normal)"
elif [ "$HTTP_CODE" = "200" ]; then
    echo "✅ Authentification: SUCCÈS (HTTP $HTTP_CODE)"
else
    echo "❌ Authentification: ERREUR (HTTP $HTTP_CODE)"
    echo "Réponse: $RESPONSE_BODY"
fi

echo ""
echo "🎯 Test de connexion terminé !"
echo ""
echo "📝 Prochaines étapes si tout est OK:"
echo "   1. Ouvrez http://localhost:3001 dans votre navigateur"
echo "   2. Essayez de vous connecter avec des identifiants de test"
echo "   3. Si ça ne marche pas, vérifiez les logs du navigateur (F12)"
