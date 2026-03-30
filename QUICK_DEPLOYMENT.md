# ⚡ QUICK DEPLOYMENT COMMANDS

## 🚀 READY FOR DEPLOYMENT TODAY

### 1️⃣ GENERATE KEYS (CRITICAL)

```bash
# Generate Laravel APP_KEY
cd backend
php artisan key:generate
# Copy the output: base64:XXXX...

# Generate NEXTAUTH_SECRET
# macOS/Linux:
openssl rand -hex 32

# Windows (PowerShell):
[Convert]::ToHexString([System.Security.Cryptography.RandomNumberGenerator]::GetBytes(32))
```

### 2️⃣ VERIFY EVERYTHING IS READY

```bash
# Run all checks
chmod +x verify-ready-deployment.sh
./verify-ready-deployment.sh

# Run preparation script
chmod +x prepare-deployment.sh
./prepare-deployment.sh
```

### 3️⃣ TEST LOCALLY

```bash
# Terminal 1: Backend
cd backend
php artisan serve --host=127.0.0.1 --port=8000

# Terminal 2: Frontend
cd frontend
npm install
npm run dev

# Terminal 3: Tests
chmod +x run-security-tests.sh
./run-security-tests.sh http://127.0.0.1:8000 http://localhost:3000

# Browser: http://localhost:3000/fr/login
# Test with: student@matchmyformation.com / Azerty123!
```

### 4️⃣ GIT COMMIT & PUSH

```bash
# Add all changes
git add .

# Commit with proper message
git commit -m "DEPLOYMENT: Fix CORS, Sanctum, auth & Docker for production

- Update CORS for Vercel domain
- Configure Sanctum for production
- Optimize Dockerfile with multi-stage build
- Fix NextAuth security (remove mock tokens)
- Add dynamic API rewrites
- Create deployment guides and scripts"

# Push to main branch
git push origin main
```

### 5️⃣ RENDER DEPLOYMENT (Backend)

```bash
# 1. Go to render.com
# 2. Sign in with GitHub
# 3. New → Web Service
# 4. Select Match-my-formation repository
# 5. Configuration:
#    - Name: match-my-formation-api
#    - Root Directory: backend
#    - Environment: Docker
# 6. Add Environment Variables:
#    APP_KEY=base64:XXXX (from step 1)
# 7. Create services:
#    - PostgreSQL database (match-my-formation-db)
#    - Redis cache (match-my-formation-redis)
# 8. Deploy

# Test after deployment:
curl https://match-my-formation-api.onrender.com/api/health
```

### 6️⃣ VERCEL DEPLOYMENT (Frontend)

```bash
# 1. Go to vercel.com
# 2. Sign in with GitHub
# 3. Import Project → Match-my-formation
# 4. Root Directory: ./frontend
# 5. Add Environment Variables:
#    NEXT_PUBLIC_API_URL=https://match-my-formation-api.onrender.com
#    NEXT_PUBLIC_FRONTEND_URL=https://match-my-formation.vercel.app
#    NEXTAUTH_SECRET=XXXX (from step 1)
#    NEXTAUTH_URL=https://match-my-formation.vercel.app
# 6. Deploy

# Vercel deploys automatically when you confirm
```

### 7️⃣ POST-DEPLOYMENT TESTS

```bash
# Backend health check
curl https://match-my-formation-api.onrender.com/api/health

# Frontend is accessible
https://match-my-formation.vercel.app/fr/login

# Test CORS headers
curl -i -X OPTIONS https://match-my-formation-api.onrender.com/api/login \
  -H "Origin: https://match-my-formation.vercel.app" \
  -H "Access-Control-Request-Method: POST"

# Login test
curl -X POST https://match-my-formation-api.onrender.com/api/login \
  -H "Content-Type: application/json" \
  -d '{"email":"student@matchmyformation.com","password":"Azerty123!"}'
```

### 8️⃣ DATABASE MIGRATIONS (FIRST TIME ONLY)

```bash
# In Render web service console:
php artisan migrate
php artisan db:seed --class=EnhancedDatabaseSeeder

# Verify
php artisan migrate:status
```

---

## 📋 CHECKLIST

Before hitting deploy:

- [ ] verify-ready-deployment.sh passes
- [ ] prepare-deployment.sh passes
- [ ] run-security-tests.sh passes (local backend)
- [ ] Login works locally
- [ ] No .env files in git
- [ ] APP_KEY generated
- [ ] NEXTAUTH_SECRET generated
- [ ] Code pushed to main branch

---

## 📚 DOCUMENTATION FILES

- **DEPLOYMENT_GUIDE_COMPLETE.md** - Full step-by-step guide
- **CHANGES_SUMMARY.md** - All corrections made
- **verify-ready-deployment.sh** - Verification script
- **prepare-deployment.sh** - Pre-deployment checks
- **run-security-tests.sh** - Security & integration tests

---

## 🆘 TROUBLESHOOTING

### "CORS policy: Access to XMLHttpRequest blocked"

```bash
# Verify Vercel URL in CORS
curl https://match-my-formation-api.onrender.com/api/health \
  -H "Origin: https://match-my-formation.vercel.app" -I
```

### "Database connection failed"

```bash
# Check database connection in Render console
php artisan tinker
DB::connection()->statement("SELECT 1");
```

### "500 Internal Server Error"

```bash
# Check logs in Render
tail -f /var/log/laravel.log

# Check environment variables
php -r "print_r(getenv());"
```

### "Frontend blank page"

```bash
# Check Vercel logs
# Settings → Functions → View logs

# Build locally
npm run build
npm run start
```

---

## 🎯 EXPECTED RESULTS

After successful deployment:

✅ Backend API responds at https://match-my-formation-api.onrender.com/api/health  
✅ Frontend loads at https://match-my-formation.vercel.app  
✅ Login works with student credentials  
✅ CORS headers allow Vercel domain  
✅ Sanctum tokens are validated  
✅ Database is migrated and seeded  
✅ No errors in production logs

---

## 📞 SUPPORT

All guides are ready and documented. You have:

1. **DEPLOYMENT_GUIDE_COMPLETE.md** - Complete reference
2. **CHANGES_SUMMARY.md** - What was fixed
3. **Scripts** - Automated testing and verification
4. **Environment templates** - Ready to use
5. **Render.yaml** - Infrastructure as code

**Status: ✅ READY FOR DEPLOYMENT**

---

**Last Updated:** 30 March 2026  
**Status:** Production Ready  
**Tested:** ✅ Local verification scripts  
**Security:** ✅ All critical checks passed
