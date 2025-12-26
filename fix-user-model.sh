#!/bin/bash
# Quick fix for User model field names in backend files
set -e

echo "🔧 Fixing User model references in backend code..."

# Fix authController.ts
echo "  Fixing authController.ts..."
sed -i 's/user\.name/user.username/g' backend/src/controllers/authController.ts
sed -i 's/user\.status !== .active./!user.isActive/g' backend/src/controllers/authController.ts  
sed -i 's/user\.avatar,//g' backend/src/controllers/authController.ts
sed -i 's/role: role || .viewer./role: role || '\''staff'\'',/g' backend/src/controllers/authController.ts
sed -i 's/name: name,/username: name, firstName: name.split('\'' '\'')[0], lastName: name.split('\'' '\'').slice(1).join('\'' '\'') || '\'''\'',/g' backend/src/controllers/authController.ts

# Fix auth middleware
echo "  Fixing auth.ts..."
sed -i 's/user\.status !== .active./!user.isActive/g' backend/src/middleware/auth.ts

# Fix cronJobs
echo "  Fixing cronJobs.ts..."
sed -i 's/admin\.name/admin.username/g' backend/src/services/cronJobs.ts

echo "✅ All fixes applied!"
echo ""
echo "Now building..."
cd backend && npm run build
