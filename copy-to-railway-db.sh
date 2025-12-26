#!/bin/bash
# Copy all tables from dairy_db to railway database
# This ensures your Railway backend (which connects to 'railway' by default) can find the tables

set -e

echo "🔄 Copying Database Tables"
echo "=========================="
echo ""
echo "From: dairy_db → To: railway"
echo ""

MYSQL_HOST="yamabiko.proxy.rlwy.net"
MYSQL_PORT="28865"
MYSQL_USER="root"
MYSQL_PASSWORD="GqsGfqozHbDVdoeqEWqaQfiCdqJaJopt"

# Dump dairy_db and restore to railway
echo "📦 Dumping dairy_db database..."
mysqldump -h"$MYSQL_HOST" -P"$MYSQL_PORT" -u"$MYSQL_USER" -p"$MYSQL_PASSWORD" dairy_db > /tmp/dairy_backup.sql

echo "📥 Restoring to railway database..."
mysql -h"$MYSQL_HOST" -P"$MYSQL_PORT" -u"$MYSQL_USER" -p"$MYSQL_PASSWORD" railway < /tmp/dairy_backup.sql

echo ""
echo "✅ Tables copied successfully!"
echo ""
echo "📊 Verifying tables in railway database..."
mysql -h"$MYSQL_HOST" -P"$MYSQL_PORT" -u"$MYSQL_USER" -p"$MYSQL_PASSWORD" railway -e "SHOW TABLES;"

echo ""
echo "👤 Verifying admin user..."
mysql -h"$MYSQL_HOST" -P"$MYSQL_PORT" -u"$MYSQL_USER" -p"$MYSQL_PASSWORD" railway -e "SELECT id, username, email, role FROM users WHERE role='admin';"

echo ""
echo "🎉 Success! Railway database now has all tables!"
echo ""
echo "📝 Default Login:"
echo "   Email: admin@dairysystem.com"
echo "   Password: admin123"
echo ""
echo "🔗 Test now:"
echo "   https://dairy-management-frontend-production.up.railway.app"
