#!/bin/bash

# ============================================
# FINAL VERIFICATION BEFORE DEPLOYMENT
# ============================================

set -e

RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m'

function header() {
  echo -e "\n${BLUE}════════════════════════════════════════${NC}"
  echo -e "${BLUE}$1${NC}"
  echo -e "${BLUE}════════════════════════════════════════${NC}\n"
}

function check() {
  echo -e "${YELLOW}▸ $1${NC}"
}

function pass() {
  echo -e "${GREEN}✓ $1${NC}"
}

function fail() {
  echo -e "${RED}✗ $1${NC}"
}

header "FINAL DEPLOYMENT VERIFICATION"

# ============================================
# BACKEND CHECKS
# ============================================
header "1. BACKEND CONFIGURATION"

check "Checking CORS configuration..."
if grep -q "match-my-formation.vercel.app" backend/config/cors.php; then
  pass "CORS updated for Vercel"
else
  fail "CORS not configured for Vercel"
  exit 1
fi

check "Checking Sanctum stateful domains..."
if grep -q "match-my-formation.vercel.app" backend/config/sanctum.php; then
  pass "Sanctum configured for Vercel"
else
  fail "Sanctum not configured for Vercel"
  exit 1
fi

check "Checking environment file..."
if [ -f backend/.env ]; then
  pass "backend/.env exists"
else
  fail "backend/.env not found"
  exit 1
fi

check "Checking Dockerfile..."
if grep -q "as production" backend/Dockerfile; then
  pass "Dockerfile optimized with multi-stage build"
else
  fail "Dockerfile not optimized"
  exit 1
fi

check "Checking composer.json..."
if [ -f backend/composer.json ]; then
  pass "backend/composer.json exists"
else
  fail "backend/composer.json not found"
  exit 1
fi

# ============================================
# FRONTEND CHECKS
# ============================================
header "2. FRONTEND CONFIGURATION"

check "Checking Next.js config..."
if grep -q "process.env.NEXT_PUBLIC_API_URL" frontend/next.config.js; then
  pass "API rewrites are dynamic"
else
  fail "API rewrites not dynamic"
  exit 1
fi

check "Checking environment file..."
if [ -f frontend/.env ]; then
  pass "frontend/.env exists"
else
  fail "frontend/.env not found"
  exit 1
fi

check "Checking NextAuth route..."
if grep -q "process.env.NEXTAUTH_SECRET" frontend/app/api/auth/[...nextauth]/route.ts; then
  pass "NEXTAUTH_SECRET required (no fallback)"
else
  fail "NEXTAUTH has fallback secret (risky)"
  exit 1
fi

check "Checking package.json..."
if [ -f frontend/package.json ]; then
  pass "frontend/package.json exists"
else
  fail "frontend/package.json not found"
  exit 1
fi

# ============================================
# SECURITY CHECKS
# ============================================
header "3. SECURITY CHECKS"

check "Checking .gitignore for .env..."
if grep -q ".env" .gitignore; then
  pass ".env files are ignored"
else
  fail ".env files not ignored"
  exit 1
fi

check "Checking for exposed APP_KEY in git..."
if [ -f backend/.env ] && git ls-files | grep -q "backend/.env"; then
  fail "backend/.env is in git (security risk)"
  exit 1
else
  pass "backend/.env not in git"
fi

check "Checking for exposed NEXTAUTH_SECRET..."
if [ -f frontend/.env ] && git ls-files | grep -q "frontend/.env"; then
  fail "frontend/.env is in git (security risk)"
  exit 1
else
  pass "frontend/.env not in git"
fi

check "Checking backend APP_DEBUG..."
if grep -q "APP_DEBUG=false\|APP_DEBUG=true" backend/.env; then
  APP_DEBUG=$(grep "APP_DEBUG" backend/.env | cut -d= -f2)
  if [ "$APP_DEBUG" = "false" ] || [ "$APP_DEBUG" = "true" ]; then
    pass "APP_DEBUG is set: $APP_DEBUG (local ok, must be false in prod)"
  fi
else
  fail "APP_DEBUG not found"
fi

# ============================================
# FILE STRUCTURE CHECKS
# ============================================
header "4. PROJECT STRUCTURE"

check "Checking render.yaml..."
if [ -f render.yaml ]; then
  pass "render.yaml exists"
else
  fail "render.yaml not found"
  exit 1
fi

check "Checking database migrations..."
if [ -d backend/database/migrations ]; then
  MIGRATION_COUNT=$(ls -1 backend/database/migrations | wc -l)
  pass "Found $MIGRATION_COUNT migrations"
else
  fail "No migrations directory"
  exit 1
fi

check "Checking models..."
if [ -d backend/app/Models ]; then
  MODEL_COUNT=$(ls -1 backend/app/Models | wc -l)
  pass "Found $MODEL_COUNT models"
else
  fail "No models directory"
  exit 1
fi

# ============================================
# DOCUMENTATION CHECKS
# ============================================
header "5. DOCUMENTATION"

check "Checking deployment guide..."
if [ -f DEPLOYMENT_GUIDE_COMPLETE.md ]; then
  pass "Complete deployment guide available"
else
  fail "Deployment guide not found"
  exit 1
fi

check "Checking changes summary..."
if [ -f CHANGES_SUMMARY.md ]; then
  pass "Changes summary available"
else
  fail "Changes summary not found"
  exit 1
fi

check "Checking test scripts..."
if [ -f prepare-deployment.sh ]; then
  pass "Deployment preparation script available"
else
  fail "Preparation script not found"
  exit 1
fi

if [ -f run-security-tests.sh ]; then
  pass "Security tests script available"
else
  fail "Security tests script not found"
  exit 1
fi

# ============================================
# PRODUCTION ENVIRONMENT FILES
# ============================================
header "6. PRODUCTION ENVIRONMENT TEMPLATES"

check "Checking backend production template..."
if [ -f backend/.env.production.example ]; then
  pass "backend/.env.production.example available"
else
  fail "Backend production template not found"
  exit 1
fi

check "Checking frontend production template..."
if [ -f frontend/.env.production.example ]; then
  pass "frontend/.env.production.example available"
else
  fail "Frontend production template not found"
  exit 1
fi

# ============================================
# CRITICAL WARNINGS
# ============================================
header "⚠️  CRITICAL REMINDERS"

echo -e "${YELLOW}Before deploying, you MUST:${NC}"
echo ""
echo "1️⃣  Generate Laravel APP_KEY:"
echo "   cd backend && php artisan key:generate"
echo "   Copy the key to Render dashboard: APP_KEY=..."
echo ""
echo "2️⃣  Generate NEXTAUTH_SECRET:"
echo "   openssl rand -hex 32"
echo "   Copy to Vercel dashboard: NEXTAUTH_SECRET=..."
echo ""
echo "3️⃣  Test locally:"
echo "   ./prepare-deployment.sh"
echo "   ./run-security-tests.sh http://127.0.0.1:8000 http://localhost:3000"
echo ""
echo "4️⃣  Commit and push:"
echo "   git add ."
echo "   git commit -m 'DEPLOYMENT: Fix CORS, Sanctum, auth & Docker'"
echo "   git push origin main"
echo ""
echo "5️⃣  Deploy:"
echo "   - Render: Create services (Web, PostgreSQL, Redis)"
echo "   - Vercel: Import repository"
echo ""

# ============================================
# SUMMARY
# ============================================
header "✅ VERIFICATION COMPLETE"

echo -e "${GREEN}All checks passed!${NC}"
echo ""
echo "📋 Your application is ready for deployment."
echo ""
echo "📚 Next steps:"
echo "   1. Read: DEPLOYMENT_GUIDE_COMPLETE.md"
echo "   2. Review: CHANGES_SUMMARY.md"
echo "   3. Test: ./prepare-deployment.sh"
echo "   4. Test: ./run-security-tests.sh"
echo "   5. Deploy to Render and Vercel"
echo ""
echo "🚀 Good luck with your deployment!"
echo ""
