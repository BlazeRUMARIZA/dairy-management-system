#!/bin/bash

# Frontend-Backend Integration Test Script
# This script tests the connection between frontend and backend

echo "🔗 Testing Frontend-Backend Integration"
echo "========================================"
echo ""

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# Configuration
BACKEND_URL="http://localhost:5000"
API_URL="http://localhost:5000/api/v1"
FRONTEND_URL="http://localhost:5173"

# Test backend health
echo -e "${BLUE}1. Testing Backend Health...${NC}"
HEALTH_CHECK=$(curl -s -o /dev/null -w "%{http_code}" $BACKEND_URL/health)

if [ "$HEALTH_CHECK" -eq 200 ]; then
    echo -e "${GREEN}✓ Backend is running on $BACKEND_URL${NC}"
else
    echo -e "${RED}✗ Backend is not responding (HTTP $HEALTH_CHECK)${NC}"
    echo -e "${YELLOW}  Please start backend: cd backend && npm run dev${NC}"
    exit 1
fi

echo ""

# Test API endpoint
echo -e "${BLUE}2. Testing API Endpoint...${NC}"
API_CHECK=$(curl -s $BACKEND_URL/ | grep "Dairy Management System API")

if [ -n "$API_CHECK" ]; then
    echo -e "${GREEN}✓ API endpoint is accessible${NC}"
else
    echo -e "${RED}✗ API endpoint not responding${NC}"
    exit 1
fi

echo ""

# Test login endpoint
echo -e "${BLUE}3. Testing Login Endpoint...${NC}"
LOGIN_RESPONSE=$(curl -s -X POST $API_URL/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"admin@dairy.com","password":"password123"}')

if echo "$LOGIN_RESPONSE" | grep -q "token"; then
    echo -e "${GREEN}✓ Login endpoint working${NC}"
    TOKEN=$(echo "$LOGIN_RESPONSE" | grep -o '"token":"[^"]*' | cut -d'"' -f4)
    echo -e "  Token: ${TOKEN:0:20}..."
else
    echo -e "${RED}✗ Login failed${NC}"
    echo -e "  Response: $LOGIN_RESPONSE"
    echo -e "${YELLOW}  Make sure you've run: npm run db:seed${NC}"
    exit 1
fi

echo ""

# Test protected endpoint
echo -e "${BLUE}4. Testing Protected Endpoint (Products)...${NC}"
PRODUCTS_RESPONSE=$(curl -s -H "Authorization: Bearer $TOKEN" $API_URL/products)

if echo "$PRODUCTS_RESPONSE" | grep -q "success"; then
    PRODUCT_COUNT=$(echo "$PRODUCTS_RESPONSE" | grep -o '"count":[0-9]*' | cut -d':' -f2)
    echo -e "${GREEN}✓ Protected endpoint working${NC}"
    echo -e "  Found $PRODUCT_COUNT products"
else
    echo -e "${RED}✗ Protected endpoint failed${NC}"
    echo -e "  Response: $PRODUCTS_RESPONSE"
    exit 1
fi

echo ""

# Test CORS
echo -e "${BLUE}5. Testing CORS Configuration...${NC}"
CORS_CHECK=$(curl -s -I -X OPTIONS $API_URL/products \
  -H "Origin: $FRONTEND_URL" \
  -H "Access-Control-Request-Method: GET" | grep "Access-Control-Allow-Origin")

if [ -n "$CORS_CHECK" ]; then
    echo -e "${GREEN}✓ CORS is configured correctly${NC}"
else
    echo -e "${YELLOW}⚠ CORS might need configuration${NC}"
    echo -e "  Check backend .env: FRONTEND_URL=$FRONTEND_URL"
fi

echo ""

# Check if frontend is running
echo -e "${BLUE}6. Checking Frontend Server...${NC}"
FRONTEND_CHECK=$(curl -s -o /dev/null -w "%{http_code}" $FRONTEND_URL)

if [ "$FRONTEND_CHECK" -eq 200 ]; then
    echo -e "${GREEN}✓ Frontend is running on $FRONTEND_URL${NC}"
else
    echo -e "${YELLOW}⚠ Frontend is not running (HTTP $FRONTEND_CHECK)${NC}"
    echo -e "  Start frontend: npm run dev${NC}"
fi

echo ""

# Test all main endpoints
echo -e "${BLUE}7. Testing All Main Endpoints...${NC}"

endpoints=(
  "GET|/dashboard/stats|Dashboard"
  "GET|/products|Products"
  "GET|/clients|Clients"
  "GET|/orders|Orders"
  "GET|/batches|Batches"
  "GET|/invoices|Invoices"
)

for endpoint in "${endpoints[@]}"; do
  IFS='|' read -r method path name <<< "$endpoint"
  
  HTTP_CODE=$(curl -s -o /dev/null -w "%{http_code}" \
    -X $method \
    -H "Authorization: Bearer $TOKEN" \
    $API_URL$path)
  
  if [ "$HTTP_CODE" -eq 200 ]; then
    echo -e "  ${GREEN}✓${NC} $name ($path) - HTTP $HTTP_CODE"
  else
    echo -e "  ${RED}✗${NC} $name ($path) - HTTP $HTTP_CODE"
  fi
done

echo ""

# Summary
echo -e "${GREEN}========================================"
echo -e "✅ Integration Test Complete!"
echo -e "========================================${NC}"
echo ""
echo -e "Next Steps:"
echo -e "1. Open ${BLUE}$FRONTEND_URL${NC} in your browser"
echo -e "2. Login with:"
echo -e "   Email: ${YELLOW}admin@dairy.com${NC}"
echo -e "   Password: ${YELLOW}password123${NC}"
echo -e "3. Check browser console for API calls"
echo -e "4. Update frontend components to use API service"
echo ""
echo -e "Documentation:"
echo -e "- API Integration Guide: ${BLUE}FRONTEND_BACKEND_INTEGRATION.md${NC}"
echo -e "- API Documentation: ${BLUE}backend/API_DOCUMENTATION.md${NC}"
echo -e "- Quick Start: ${BLUE}backend/QUICK_START.md${NC}"
echo ""
