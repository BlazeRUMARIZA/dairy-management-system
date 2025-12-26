#!/bin/bash
# This script shows you EXACTLY what to type in Railway

cat << 'EOF'

════════════════════════════════════════════════════════════════
                    📋 COPY THIS INTO RAILWAY
════════════════════════════════════════════════════════════════

Go to Railway Dashboard:
https://railway.app/dashboard

→ Click: Backend Service
→ Click: Variables Tab  
→ Click: "RAW Editor" button (top right)
→ Paste the lines below:

────────────────────────────────────────────────────────────────
DB_HOST=${{MySQL.MYSQLHOST}}
DB_PORT=${{MySQL.MYSQLPORT}}
DB_USER=${{MySQL.MYSQLUSER}}
DB_PASSWORD=${{MySQL.MYSQLPASSWORD}}
DB_NAME=railway
────────────────────────────────────────────────────────────────

→ Click: "Update Variables" or "Save"
→ Wait: ~2 minutes for automatic redeploy
→ Check logs for: "✅ MySQL Connected"

════════════════════════════════════════════════════════════════
                         🎯 THAT'S IT!
════════════════════════════════════════════════════════════════

After adding these 5 variables, your backend will be able to:
✓ Connect to Railway MySQL database
✓ Read the 9 tables we created
✓ Authenticate users
✓ Process login requests

Then test login at:
https://dairy-management-frontend-production.up.railway.app

Email: admin@dairysystem.com
Password: admin123

EOF
