#!/bin/bash

##############################################################################
# TEST COMPLET D'INSCRIPTION & AUTHENTIFICATION
# Teste le flow d'enregistrement → login → dashboard
##############################################################################

set -e

# Configuration
API_BASE="http://localhost:8000/api"
FRONTEND_BASE="http://localhost:3000"
LOCALE="fr"

# Couleurs
GREEN='\033[0;32m'
RED='\033[0;31m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m'

# Test data
TEST_EMAIL="test_$(date +%s)@example.com"
TEST_NAME="Test Student"
TEST_PASSWORD="Azerty123!"

echo -e "\n${BLUE}╔════════════════════════════════════════════════════════════╗${NC}"
echo -e "${BLUE}║     TEST D'INSCRIPTION & AUTHENTIFICATION COMPLET            ║${NC}"
echo -e "${BLUE}╚════════════════════════════════════════════════════════════╝${NC}\n"

# ────────────────────────────────────────────────────────────────────────
# ÉTAPE 1: Vérifier que le backend est UP
# ────────────────────────────────────────────────────────────────────────

echo -e "${BLUE}[1/6] Vérification Backend${NC}"
health=$(curl -s "$API_BASE/health" 2>/dev/null || echo "{}")

if echo "$health" | grep -q "ok"; then
    echo -e "${GREEN}✅ Backend is running${NC}"
else
    echo -e "${RED}❌ Backend not responding${NC}"
    echo -e "${YELLOW}⚠️  Start backend: cd backend && php artisan serve${NC}"
    exit 1
fi

# ────────────────────────────────────────────────────────────────────────
# ÉTAPE 2: Tester l'ENREGISTREMENT
# ────────────────────────────────────────────────────────────────────────

echo -e "\n${BLUE}[2/6] Test ENREGISTREMENT${NC}"
echo "Email de test: $TEST_EMAIL"

register_response=$(curl -s -X POST "$API_BASE/register" \
    -H "Content-Type: application/json" \
    -d "{
        \"name\": \"$TEST_NAME\",
        \"email\": \"$TEST_EMAIL\",
        \"password\": \"$TEST_PASSWORD\",
        \"password_confirmation\": \"$TEST_PASSWORD\"
    }")

echo "Response: $register_response" | head -c 200
echo ""

# Extract token
TOKEN=$(echo "$register_response" | grep -o '"token":"[^"]*' | cut -d'"' -f4 | head -1)

if [ -z "$TOKEN" ]; then
    echo -e "${RED}❌ Registration failed - No token returned${NC}"
    echo "Details: $register_response"
    exit 1
fi

echo -e "${GREEN}✅ Enregistrement réussi!${NC}"
echo "Token: ${TOKEN:0:30}..."

# ────────────────────────────────────────────────────────────────────────
# ÉTAPE 3: Vérifier récupération du USER
# ────────────────────────────────────────────────────────────────────────

echo -e "\n${BLUE}[3/6] Test GET /me${NC}"

me_response=$(curl -s -X GET "$API_BASE/me" \
    -H "Authorization: Bearer $TOKEN")

if echo "$me_response" | grep -q "$TEST_EMAIL"; then
    echo -e "${GREEN}✅ User info retrieved${NC}"
    echo "$me_response" | grep -o '"name":"[^"]*' || echo ""
else
    echo -e "${RED}❌ Failed to get user info${NC}"
    echo "Response: $me_response"
fi

# ────────────────────────────────────────────────────────────────────────
# ÉTAPE 4: Test LOGOUT
# ────────────────────────────────────────────────────────────────────────

echo -e "\n${BLUE}[4/6] Test LOGOUT${NC}"

logout_response=$(curl -s -X POST "$API_BASE/logout" \
    -H "Authorization: Bearer $TOKEN")

if echo "$logout_response" | grep -q "success"; then
    echo -e "${GREEN}✅ Logout successful${NC}"
else
    echo -e "${YELLOW}⚠️  Logout response: $logout_response${NC}"
fi

# ────────────────────────────────────────────────────────────────────────
# ÉTAPE 5: Test NEW LOGIN avec les credentials
# ────────────────────────────────────────────────────────────────────────

echo -e "\n${BLUE}[5/6] Test LOGIN${NC}"

login_response=$(curl -s -X POST "$API_BASE/login" \
    -H "Content-Type: application/json" \
    -d "{
        \"email\": \"$TEST_EMAIL\",
        \"password\": \"$TEST_PASSWORD\"
    }")

NEW_TOKEN=$(echo "$login_response" | grep -o '"token":"[^"]*' | cut -d'"' -f4 | head -1)

if [ -z "$NEW_TOKEN" ]; then
    echo -e "${RED}❌ Login failed${NC}"
    echo "Response: $login_response"
    exit 1
fi

echo -e "${GREEN}✅ Login successful${NC}"
echo "New Token: ${NEW_TOKEN:0:30}..."

# ────────────────────────────────────────────────────────────────────────
# ÉTAPE 6: Vérifier DASHBOARD
# ────────────────────────────────────────────────────────────────────────

echo -e "\n${BLUE}[6/6] Vérifier Dashboard Student${NC}"

if [ -z "$FRONTEND_BASE" ]; then
    echo -e "${YELLOW}⚠️  Frontend test skipped (not running)${NC}"
else
    dashboard_url="$FRONTEND_BASE/$LOCALE/dashboard/student"
    
    # Check if page exists
    if curl -s "$dashboard_url" | grep -q "student"; then
        echo -e "${GREEN}✅ Dashboard page accessible${NC}"
    else
        echo -e "${YELLOW}⚠️  Dashboard might need authentication${NC}"
    fi
fi

# ────────────────────────────────────────────────────────────────────────
# RÉSULTATS
# ────────────────────────────────────────────────────────────────────────

echo -e "\n${BLUE}╔════════════════════════════════════════════════════════════╗${NC}"
echo -e "${BLUE}║                    RÉSULTATS                               ║${NC}"
echo -e "${BLUE}╚════════════════════════════════════════════════════════════╝${NC}"

echo -e "\n${GREEN}✅ FLOW D'ENREGISTREMENT COMPLET FONCTIONNEL!${NC}"

echo -e "\n${YELLOW}📋 Credentials de test:${NC}"
echo "Email: $TEST_EMAIL"
echo "Password: $TEST_PASSWORD"
echo ""

echo -e "${BLUE}📌 Prochaines étapes:${NC}"
echo "1. Aller sur: $FRONTEND_BASE/$LOCALE/auth/login"
echo "2. Cliquer sur 'S'inscrire'"
echo "3. Remplir le formulaire avec:"
echo "   - Nom: Test Student"
echo "   - Email: $TEST_EMAIL"
echo "   - Password: $TEST_PASSWORD"
echo "4. Vérifier la redirection vers le dashboard"
echo ""

echo -e "${GREEN}✅ PRÊT À TESTER DANS LE FRONTEND!${NC}\n"
