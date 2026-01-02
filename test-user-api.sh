#!/bin/bash

# 🧪 User Management Testing Script
# Run this after Railway deployment completes

echo "🧪 Testing User Management API"
echo "================================"
echo ""

# Configuration
API_URL="https://dairy-management-lorraine-production.up.railway.app/api/v1"
ADMIN_EMAIL="admin@dairysystem.com"
ADMIN_PASSWORD="admin123"

echo "📍 API URL: $API_URL"
echo "👤 Admin: $ADMIN_EMAIL"
echo ""

# Step 1: Login as admin
echo "Step 1: Login as admin..."
LOGIN_RESPONSE=$(curl -s -X POST "$API_URL/auth/login" \
  -H "Content-Type: application/json" \
  -d "{\"email\":\"$ADMIN_EMAIL\",\"password\":\"$ADMIN_PASSWORD\"}")

TOKEN=$(echo $LOGIN_RESPONSE | grep -o '"token":"[^"]*' | cut -d'"' -f4)

if [ -z "$TOKEN" ]; then
  echo "❌ Login failed!"
  echo "Response: $LOGIN_RESPONSE"
  exit 1
fi

echo "✅ Login successful! Token received."
echo ""

# Step 2: Get all users
echo "Step 2: Get all users..."
USERS_RESPONSE=$(curl -s -X GET "$API_URL/users" \
  -H "Authorization: Bearer $TOKEN")

echo "$USERS_RESPONSE" | python3 -m json.tool 2>/dev/null || echo "$USERS_RESPONSE"
echo ""

# Check if successful
if echo "$USERS_RESPONSE" | grep -q '"success":true'; then
  echo "✅ GET /users - Working!"
  USER_COUNT=$(echo "$USERS_RESPONSE" | grep -o '"count":[0-9]*' | cut -d':' -f2)
  echo "📊 Found $USER_COUNT users in database"
else
  echo "❌ GET /users - Failed!"
  echo "Response: $USERS_RESPONSE"
fi

echo ""
echo "================================"
echo ""
echo "✅ Basic test complete!"
echo ""
echo "Next steps:"
echo "1. Open: https://dairy-management-lorraine-production.up.railway.app"
echo "2. Login with: $ADMIN_EMAIL / $ADMIN_PASSWORD"
echo "3. Go to Settings → Users tab"
echo "4. Try adding, editing, and deleting users"
echo ""
echo "All changes should now persist to the database! 🎉"
