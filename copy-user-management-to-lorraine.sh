#!/bin/bash

# 🔄 Copy User Management Updates to dairy-management-lorraine
# This script copies all user management functionality to the lorraine project

set -e

echo "🔄 Copying User Management Updates to dairy-management-lorraine"
echo "================================================================"
echo ""

SOURCE_PROJECT="/home/rumariza/dairy-management-system"
TARGET_PROJECT="/home/rumariza/Documents/GitHub/dairy-management-lorraine"

# Check if target project exists
if [ ! -d "$TARGET_PROJECT" ]; then
    echo "❌ Error: Target project not found at $TARGET_PROJECT"
    exit 1
fi

echo "✅ Target project found"
echo ""

# 1. Copy userController.ts
echo "📦 Step 1: Copying userController.ts..."
if [ -f "$SOURCE_PROJECT/backend/src/controllers/userController.ts" ]; then
    mkdir -p "$TARGET_PROJECT/backend/src/controllers"
    cp "$SOURCE_PROJECT/backend/src/controllers/userController.ts" \
       "$TARGET_PROJECT/backend/src/controllers/userController.ts"
    echo "   ✅ userController.ts copied"
else
    echo "   ❌ Source file not found!"
fi

echo ""

# 2. Copy userRoutes.ts
echo "📦 Step 2: Copying userRoutes.ts..."
if [ -f "$SOURCE_PROJECT/backend/src/routes/userRoutes.ts" ]; then
    mkdir -p "$TARGET_PROJECT/backend/src/routes"
    cp "$SOURCE_PROJECT/backend/src/routes/userRoutes.ts" \
       "$TARGET_PROJECT/backend/src/routes/userRoutes.ts"
    echo "   ✅ userRoutes.ts copied"
else
    echo "   ❌ Source file not found!"
fi

echo ""

# 3. Update server.ts
echo "📦 Step 3: Updating server.ts..."
if [ -f "$TARGET_PROJECT/backend/src/server.ts" ]; then
    # Check if userRoutes is already imported
    if grep -q "import userRoutes" "$TARGET_PROJECT/backend/src/server.ts"; then
        echo "   ℹ️  userRoutes already imported in server.ts"
    else
        # Add import after other route imports
        sed -i "/import dashboardRoutes/a import userRoutes from './routes/userRoutes';" \
            "$TARGET_PROJECT/backend/src/server.ts"
        echo "   ✅ Added userRoutes import"
    fi
    
    # Check if users route is already registered
    if grep -q "app.use.*users.*userRoutes" "$TARGET_PROJECT/backend/src/server.ts"; then
        echo "   ℹ️  Users route already registered in server.ts"
    else
        # Add route after auth route
        sed -i "/app.use.*\/auth.*authRoutes/a app.use(\`/api/\${apiVersion}/users\`, userRoutes);" \
            "$TARGET_PROJECT/backend/src/server.ts"
        echo "   ✅ Added users route registration"
    fi
else
    echo "   ❌ Target server.ts not found!"
fi

echo ""

# 4. Update frontend API service
echo "📦 Step 4: Updating frontend api.ts..."
if [ -f "$TARGET_PROJECT/src/services/api.ts" ]; then
    # Check if usersApi already exists
    if grep -q "export const usersApi" "$TARGET_PROJECT/src/services/api.ts"; then
        echo "   ℹ️  usersApi already exists in api.ts"
    else
        # Add usersApi before the final export
        cat >> "$TARGET_PROJECT/src/services/api.ts" << 'APIEOF'

/**
 * Users API
 */
export const usersApi = {
  /**
   * Get all users
   */
  getAll: async () => {
    return request('/users');
  },

  /**
   * Get user by ID
   */
  getById: async (id: string | number) => {
    return request(`/users/${id}`);
  },

  /**
   * Create user
   */
  create: async (userData: any) => {
    return request('/users', {
      method: 'POST',
      body: userData,
    });
  },

  /**
   * Update user
   */
  update: async (id: string | number, userData: any) => {
    return request(`/users/${id}`, {
      method: 'PUT',
      body: userData,
    });
  },

  /**
   * Delete user
   */
  delete: async (id: string | number) => {
    return request(`/users/${id}`, {
      method: 'DELETE',
    });
  },

  /**
   * Update user status
   */
  updateStatus: async (id: string | number, status: string) => {
    return request(`/users/${id}/status`, {
      method: 'PATCH',
      body: { status },
    });
  },
};
APIEOF
        echo "   ✅ Added usersApi to api.ts"
        
        # Update the export to include users
        if grep -q "export const api = {" "$TARGET_PROJECT/src/services/api.ts"; then
            # Add users to the export object
            sed -i '/export const api = {/,/};/{/auth: authApi,/a\  users: usersApi,}' \
                "$TARGET_PROJECT/src/services/api.ts"
            echo "   ✅ Added users to api exports"
        fi
    fi
else
    echo "   ❌ Target api.ts not found!"
fi

echo ""

# 5. Update Settings.tsx
echo "📦 Step 5: Updating Settings.tsx..."
if [ -f "$TARGET_PROJECT/src/pages/Settings/Settings.tsx" ]; then
    # Backup original file
    cp "$TARGET_PROJECT/src/pages/Settings/Settings.tsx" \
       "$TARGET_PROJECT/src/pages/Settings/Settings.tsx.backup"
    
    # Copy the updated Settings.tsx
    cp "$SOURCE_PROJECT/src/pages/Settings/Settings.tsx" \
       "$TARGET_PROJECT/src/pages/Settings/Settings.tsx"
    
    echo "   ✅ Settings.tsx updated (backup created: Settings.tsx.backup)"
else
    echo "   ⚠️  Settings.tsx not found, skipping..."
fi

echo ""
echo "================================================================"
echo "✅ User Management Updates Copied Successfully!"
echo "================================================================"
echo ""
echo "📋 Summary of changes:"
echo "   ✅ backend/src/controllers/userController.ts"
echo "   ✅ backend/src/routes/userRoutes.ts"
echo "   ✅ backend/src/server.ts (updated)"
echo "   ✅ src/services/api.ts (updated)"
echo "   ✅ src/pages/Settings/Settings.tsx (updated)"
echo ""
echo "🔧 Next steps:"
echo "   1. cd $TARGET_PROJECT"
echo "   2. Review the changes: git diff"
echo "   3. Build backend: cd backend && npm run build"
echo "   4. Test locally if needed"
echo "   5. Commit: git add -A && git commit -m 'feat: Add user management API'"
echo "   6. Push: git push origin main"
echo ""
echo "🚀 Railway will auto-deploy after push!"
