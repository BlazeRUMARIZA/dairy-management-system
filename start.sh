#!/bin/bash

# Dairy Management System - Start Script
# This script starts both backend and frontend servers

echo "🥛 Starting Dairy Management System..."
echo ""

# Check if backend directory exists
if [ ! -d "backend" ]; then
    echo "❌ Error: backend directory not found"
    exit 1
fi

# Check if MySQL is running
if ! pgrep -x "mysqld" > /dev/null; then
    echo "⚠️  Warning: MySQL doesn't appear to be running"
    echo "   Please start XAMPP/MySQL first"
    exit 1
fi

# Function to cleanup on exit
cleanup() {
    echo ""
    echo "🛑 Shutting down servers..."
    kill $BACKEND_PID 2>/dev/null
    kill $FRONTEND_PID 2>/dev/null
    exit 0
}

trap cleanup SIGINT SIGTERM

# Start backend
echo "🔧 Starting backend server..."
cd backend
npm run dev > ../backend.log 2>&1 &
BACKEND_PID=$!
cd ..

# Wait for backend to start
echo "⏳ Waiting for backend to initialize..."
sleep 5

# Check if backend started successfully
if ! curl -s http://localhost:5000/health > /dev/null; then
    echo "❌ Backend failed to start. Check backend.log for details"
    cat backend.log
    exit 1
fi

echo "✅ Backend running on http://localhost:5000"

# Start frontend
echo "🎨 Starting frontend server..."
npm run dev > frontend.log 2>&1 &
FRONTEND_PID=$!

# Wait for frontend to start
echo "⏳ Waiting for frontend to initialize..."
sleep 3

echo ""
echo "╔════════════════════════════════════════╗"
echo "║   🥛 Dairy Management System          ║"
echo "║                                        ║"
echo "║   Frontend: http://localhost:3000/    ║"
echo "║   Backend:  http://localhost:5000/    ║"
echo "║                                        ║"
echo "║   Test Login:                          ║"
echo "║   Email: admin@dairy.com               ║"
echo "║   Pass:  admin123                      ║"
echo "║                                        ║"
echo "║   Press Ctrl+C to stop servers         ║"
echo "╚════════════════════════════════════════╝"
echo ""

# Keep script running and show logs
tail -f backend.log frontend.log
