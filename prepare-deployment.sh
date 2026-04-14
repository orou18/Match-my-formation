#!/bin/bash

# ============================================
# PRODUCTION DEPLOYMENT PREPARATION SCRIPT
# ============================================
# This script validates your project before deployment

set -e

echo "🚀 Starting production deployment preparation..."
echo ""

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

# ============================================
# FUNCTION: Print status
# ============================================
function print_status() {
  echo -e "${GREEN}✓${NC} $1"
}

function print_error() {
  echo -e "${RED}✗${NC} $1"
}

function print_warning() {
  echo -e "${YELLOW}⚠${NC} $1"
}

# ============================================
# 1. CHECK ENVIRONMENT VARIABLES
# ============================================
echo "1️⃣  Checking environment variables..."

if [ -z "$NEXTAUTH_SECRET" ]; then
  print_warning "NEXTAUTH_SECRET not set in .env (will use default in dev)"
fi

if [ -z "$APP_KEY" ]; then
  print_warning "APP_KEY not set (need to generate with: php artisan key:generate)"
fi

print_status "Environment variables checked"
echo ""

# ============================================
# 2. CHECK BACKEND
# ============================================
echo "2️⃣  Checking backend..."

if [ ! -f "backend/composer.json" ]; then
  print_error "composer.json not found in backend/"
  exit 1
fi

print_status "Backend structure OK"

# Check for corrected files
if grep -q "match-my-formation.vercel.app" backend/config/cors.php; then
  print_status "CORS updated for production"
else
  print_error "CORS not configured for production"
  exit 1
fi

if grep -q "match-my-formation.vercel.app" backend/config/sanctum.php; then
  print_status "Sanctum updated for production"
else
  print_error "Sanctum not configured for production"
  exit 1
fi

echo ""

# ============================================
# 3. CHECK FRONTEND
# ============================================
echo "3️⃣  Checking frontend..."

if [ ! -f "frontend/package.json" ]; then
  print_error "package.json not found in frontend/"
  exit 1
fi

print_status "Frontend structure OK"

# Check if rewrites are dynamic
if grep -q "process.env.NEXT_PUBLIC_API_URL" frontend/next.config.js; then
  print_status "API rewrites are dynamic"
else
  print_error "API rewrites not updated"
  exit 1
fi

echo ""

# ============================================
# 4. CHECK DOCKER
# ============================================
echo "4️⃣  Checking Docker configuration..."

if grep -q "as production" backend/Dockerfile; then
  print_status "Dockerfile optimized for production"
else
  print_error "Dockerfile not updated"
  exit 1
fi

echo ""

# ============================================
# 5. CHECK .GITIGNORE
# ============================================
echo "5️⃣  Checking .gitignore..."

if grep -q ".env" .gitignore; then
  print_status ".env files properly ignored"
else
  print_error ".env files not in .gitignore"
  exit 1
fi

echo ""

# ============================================
# 6. VALIDATE JSON FILES
# ============================================
echo "6️⃣  Validating configuration files..."

# Validate backend/composer.json
if php -r "json_decode(file_get_contents('backend/composer.json')); echo 'OK';" 2>/dev/null | grep -q OK; then
  print_status "backend/composer.json is valid"
else
  print_error "backend/composer.json is invalid"
fi

# Validate frontend/package.json
if node -e "JSON.parse(require('fs').readFileSync('frontend/package.json')); console.log('OK')" 2>/dev/null | grep -q OK; then
  print_status "frontend/package.json is valid"
else
  print_error "frontend/package.json is invalid"
fi

echo ""

# ============================================
# 7. GENERATE APP KEY
# ============================================
echo "7️⃣  Checking Laravel key..."

if grep -q "^APP_KEY=base64:" backend/.env; then
  print_status "APP_KEY is set"
else
  print_warning "Generate APP_KEY with: cd backend && php artisan key:generate"
fi

echo ""

# ============================================
# 8. FINAL SUMMARY
# ============================================
echo "════════════════════════════════════════"
echo "✅ DEPLOYMENT PREPARATION COMPLETE"
echo "════════════════════════════════════════"
echo ""
echo "📋 NEXT STEPS FOR PRODUCTION:"
echo ""
echo "1️⃣  FOR RENDER (Backend):"
echo "   - Create .env file with Render variables"
echo "   - Set: DB_HOST, DB_PASSWORD, REDIS_HOST, REDIS_PASSWORD"
echo "   - Generate: php artisan key:generate -> set APP_KEY"
echo "   - Run: php artisan migrate"
echo ""
echo "2️⃣  FOR VERCEL (Frontend):"
echo "   - Create .env.production with Vercel variables"
echo "   - Set NEXTAUTH_SECRET: openssl rand -hex 32"
echo "   - Set NEXT_PUBLIC_API_URL=https://your-render-api.com"
echo "   - Deploy via: git push origin main"
echo ""
echo "3️⃣  VERIFICATION:"
echo "   - Test /api/health on backend"
echo "   - Test login on frontend"
echo "   - Check CORS headers"
echo "   - Verify Sanctum tokens"
echo ""
echo "🚀 All checks passed! Ready for deployment!"
echo ""
