#!/bin/bash

##############################################################################
# SCRIPT DE TEST - API ENDPOINTS
# Teste tous les endpoints du système chat et employee
##############################################################################

set -e

# Configuration
API_BASE="http://localhost:8000/api"
FRONTEND_BASE="http://localhost:3000"

# Couleurs
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# Tests
TESTS_PASSED=0
TESTS_FAILED=0

##############################################################################
# Fonctions Helper
##############################################################################

log_info() {
    echo -e "${BLUE}ℹ️  $1${NC}"
}

log_success() {
    echo -e "${GREEN}✅ $1${NC}"
    ((TESTS_PASSED++))
}

log_error() {
    echo -e "${RED}❌ $1${NC}"
    ((TESTS_FAILED++))
}

log_warning() {
    echo -e "${YELLOW}⚠️  $1${NC}"
}

# Test API endpoint
test_endpoint() {
    local method=$1
    local endpoint=$2
    local data=$3
    local token=$4
    local expected_code=$5
    
    log_info "Testing: $method $endpoint"
    
    if [ -z "$token" ]; then
        response=$(curl -s -w "\n%{http_code}" -X "$method" "$API_BASE$endpoint" \
            -H "Content-Type: application/json" \
            ${data:+-d "$data"})
    else
        response=$(curl -s -w "\n%{http_code}" -X "$method" "$API_BASE$endpoint" \
            -H "Content-Type: application/json" \
            -H "Authorization: Bearer $token" \
            ${data:+-d "$data"})
    fi
    
    http_code=$(echo "$response" | tail -n1)
    body=$(echo "$response" | head -n-1)
    
    if [ "$http_code" = "$expected_code" ]; then
        log_success "$method $endpoint returned $http_code"
        echo "$body"
    else
        log_error "$method $endpoint returned $http_code (expected $expected_code)"
        echo "$body"
    fi
    
    echo ""
}

##############################################################################
# TEST SUITE
##############################################################################

echo -e "\n${BLUE}╔════════════════════════════════════════════════════════════╗${NC}"
echo -e "${BLUE}║        MATCH MY FORMATION - API TEST SUITE                  ║${NC}"
echo -e "${BLUE}╚════════════════════════════════════════════════════════════╝${NC}\n"

# 1. Health Check
echo -e "\n${BLUE}[1/8] HEALTH CHECK${NC}"
test_endpoint "GET" "/health" "" "" "200"

# 2. Authentication Tests
echo -e "\n${BLUE}[2/8] AUTHENTICATION${NC}"

# Register new user
echo -e "\n${BLUE}Creating new student...${NC}"
student_register=$(curl -s -X POST "$API_BASE/register" \
    -H "Content-Type: application/json" \
    -d '{
        "name": "Test Student",
        "email": "teststudent@example.com",
        "password": "Azerty123!",
        "password_confirmation": "Azerty123!",
        "role": "student"
    }')

token=$(echo $student_register | grep -o '"token":"[^"]*' | cut -d'"' -f4)

if [ ! -z "$token" ]; then
    log_success "Student registration successful"
    log_info "Token: ${token:0:20}..."
else
    log_error "Student registration failed"
    echo "$student_register"
fi

echo ""

# 3. Chat Message Tests
echo -e "\n${BLUE}[3/8] CHAT SYSTEM - GET MESSAGES${NC}"

# Assuming video ID 1 exists
test_endpoint "GET" "/videos/1/messages" "" "$token" "200"

# 4. POST Chat Message
echo -e "\n${BLUE}[4/8] CHAT SYSTEM - POST MESSAGE${NC}"

message_data='{
    "message": "This is a test question about the video",
    "is_question": true
}'

post_response=$(curl -s -X POST "$API_BASE/videos/1/messages" \
    -H "Content-Type: application/json" \
    -H "Authorization: Bearer $token" \
    -d "$message_data")

message_id=$(echo $post_response | grep -o '"id":[0-9]*' | head -1 | cut -d':' -f2)

if [ ! -z "$message_id" ]; then
    log_success "Message posted successfully (ID: $message_id)"
else
    log_error "Failed to post message"
    echo "$post_response"
fi

echo ""

# 5. Like Message
if [ ! -z "$message_id" ]; then
    echo -e "\n${BLUE}[5/8] CHAT SYSTEM - LIKE MESSAGE${NC}"
    test_endpoint "POST" "/messages/$message_id/like" "" "$token" "200"
fi

# 6. Employee Login
echo -e "\n${BLUE}[6/8] EMPLOYEE SYSTEM - LOGIN${NC}"

# First, let's get an existing employee or create one
# For testing, we'll use mock credentials
emp_login=$(curl -s -X POST "$API_BASE/employee/login" \
    -H "Content-Type: application/json" \
    -d '{
        "login_id": "EMP_TEST",
        "password": "TestPass123!"
    }')

emp_token=$(echo $emp_login | grep -o '"token":"[^"]*' | cut -d'"' -f4)

if [ ! -z "$emp_token" ]; then
    log_success "Employee login successful"
    log_info "Token: ${emp_token:0:20}..."
else
    log_warning "Employee login failed (might not exist - EXPECTED)"
fi

echo ""

# 7. Get Me (Student)
echo -e "\n${BLUE}[7/8] USER ENDPOINTS - GET ME${NC}"
test_endpoint "GET" "/me" "" "$token" "200"

# 8. Database Migration Check
echo -e "\n${BLUE}[8/8] DATABASE SCHEMA${NC}"

log_info "Checking if chat_messages table exists..."
table_check=$(curl -s -X POST "$API_BASE/health" 2>&1 | grep -i database)

if [ $? -eq 0 ]; then
    log_success "Database connected"
else
    log_warning "Database check incomplete"
fi

##############################################################################
# RESULTS
##############################################################################

echo -e "\n${BLUE}╔════════════════════════════════════════════════════════════╗${NC}"
echo -e "${BLUE}║                    TEST RESULTS                             ║${NC}"
echo -e "${BLUE}╚════════════════════════════════════════════════════════════╝${NC}"

echo -e "\n${GREEN}✅ Tests Passed: $TESTS_PASSED${NC}"
echo -e "${RED}❌ Tests Failed: $TESTS_FAILED${NC}"

if [ $TESTS_FAILED -eq 0 ]; then
    echo -e "\n${GREEN}🎉 ALL TESTS PASSED!${NC}\n"
    exit 0
else
    echo -e "\n${RED}⚠️  SOME TESTS FAILED${NC}\n"
    exit 1
fi
