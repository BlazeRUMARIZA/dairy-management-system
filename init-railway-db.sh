#!/bin/bash
# Railway Database Initialization Script
# This script connects to your Railway MySQL and runs the schema

set -e

echo "🚂 Railway Database Initialization"
echo "=================================="
echo ""

# Railway MySQL credentials (from your service)
MYSQL_HOST="yamabiko.proxy.rlwy.net"
MYSQL_PORT="28865"
MYSQL_USER="root"
MYSQL_PASSWORD="GqsGfqozHbDVdoeqEWqaQfiCdqJaJopt"
MYSQL_DATABASE="railway"

echo "📊 Connecting to Railway MySQL..."
echo "   Host: $MYSQL_HOST:$MYSQL_PORT"
echo "   Database: $MYSQL_DATABASE"
echo ""

# Check if mysql client is installed
if ! command -v mysql &> /dev/null; then
    echo "❌ Error: mysql client is not installed"
    echo ""
    echo "Install it with:"
    echo "  Ubuntu/Debian: sudo apt-get install mysql-client"
    echo "  macOS: brew install mysql-client"
    echo "  Windows: Download from https://dev.mysql.com/downloads/mysql/"
    exit 1
fi

# Check if schema.sql exists
SCHEMA_FILE=""
if [ -f "database/schema.sql" ]; then
    SCHEMA_FILE="database/schema.sql"
elif [ -f "backend/database/schema.sql" ]; then
    SCHEMA_FILE="backend/database/schema.sql"
else
    echo "❌ Error: schema.sql not found"
    echo "   Looked in: database/schema.sql and backend/database/schema.sql"
    exit 1
fi

echo "✅ MySQL client found"
echo "✅ Schema file found"
echo ""

# Test connection
echo "🔌 Testing connection..."
if mysql -h"$MYSQL_HOST" -P"$MYSQL_PORT" -u"$MYSQL_USER" -p"$MYSQL_PASSWORD" "$MYSQL_DATABASE" -e "SELECT 1" > /dev/null 2>&1; then
    echo "✅ Connection successful!"
else
    echo "❌ Connection failed!"
    echo "   Please check your Railway MySQL service is running"
    exit 1
fi
echo ""

# Check if tables already exist
echo "🔍 Checking if database is already initialized..."
TABLE_COUNT=$(mysql -h"$MYSQL_HOST" -P"$MYSQL_PORT" -u"$MYSQL_USER" -p"$MYSQL_PASSWORD" "$MYSQL_DATABASE" -s -N -e "SELECT COUNT(*) FROM information_schema.tables WHERE table_schema = '$MYSQL_DATABASE'" 2>/dev/null || echo "0")

if [ "$TABLE_COUNT" -gt 0 ]; then
    echo "⚠️  Warning: Database already has $TABLE_COUNT tables"
    echo ""
    read -p "Do you want to continue? This will add/update tables. (y/N): " -n 1 -r
    echo ""
    if [[ ! $REPLY =~ ^[Yy]$ ]]; then
        echo "❌ Aborted by user"
        exit 0
    fi
fi
echo ""

# Run schema.sql
echo "📝 Running schema.sql..."
echo "   Using file: $SCHEMA_FILE"
echo "   This will create all tables and default data"
echo ""

if mysql -h"$MYSQL_HOST" -P"$MYSQL_PORT" -u"$MYSQL_USER" -p"$MYSQL_PASSWORD" "$MYSQL_DATABASE" < "$SCHEMA_FILE"; then
    echo ""
    echo "✅ Database initialized successfully!"
    echo ""
    echo "📊 Verifying tables..."
    mysql -h"$MYSQL_HOST" -P"$MYSQL_PORT" -u"$MYSQL_USER" -p"$MYSQL_PASSWORD" "$MYSQL_DATABASE" -e "SHOW TABLES;"
    echo ""
    echo "👤 Verifying admin user..."
    mysql -h"$MYSQL_HOST" -P"$MYSQL_PORT" -u"$MYSQL_USER" -p"$MYSQL_PASSWORD" "$MYSQL_DATABASE" -e "SELECT id, username, email, role FROM users WHERE role='admin';"
    echo ""
    echo "🎉 Success! Your database is ready!"
    echo ""
    echo "📝 Default Login Credentials:"
    echo "   Email: admin@dairysystem.com"
    echo "   Password: admin123"
    echo ""
    echo "⚠️  IMPORTANT: Change the admin password after first login!"
    echo ""
    echo "🔗 Test your backend:"
    echo "   https://dairy-management-api-production.up.railway.app/health"
    echo ""
else
    echo ""
    echo "❌ Failed to initialize database"
    echo "   Check the error messages above"
    exit 1
fi
