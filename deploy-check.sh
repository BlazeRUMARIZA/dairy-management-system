#!/bin/bash

# Dairy Management System - Pre-Deployment Check Script
# Run this before deploying to ensure everything is ready

echo "🔍 Starting pre-deployment checks..."
echo ""

# Colors for output
GREEN='\033[0;32m'
RED='\033[0;31m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

ERRORS=0
WARNINGS=0

# Function to print success
success() {
    echo -e "${GREEN}✓${NC} $1"
}

# Function to print error
error() {
    echo -e "${RED}✗${NC} $1"
    ((ERRORS++))
}

# Function to print warning
warning() {
    echo -e "${YELLOW}⚠${NC} $1"
    ((WARNINGS++))
}

echo "📦 Checking Backend..."
echo "─────────────────────"

# Check if backend directory exists
if [ -d "backend" ]; then
    success "Backend directory found"
    
    # Check backend package.json
    if [ -f "backend/package.json" ]; then
        success "Backend package.json found"
    else
        error "Backend package.json not found"
    fi
    
    # Check if backend builds successfully
    cd backend
    if npm run build > /dev/null 2>&1; then
        success "Backend builds successfully"
    else
        error "Backend build failed - run 'cd backend && npm run build' to see errors"
    fi
    cd ..
else
    error "Backend directory not found"
fi

# Check .env.example
if [ -f "backend/.env.example" ]; then
    success ".env.example found"
else
    warning ".env.example not found - consider creating one"
fi

echo ""
echo "🎨 Checking Frontend..."
echo "─────────────────────"

# Check frontend package.json
if [ -f "package.json" ]; then
    success "Frontend package.json found"
else
    error "Frontend package.json not found"
fi

# Check if frontend builds successfully
if npm run build > /dev/null 2>&1; then
    success "Frontend builds successfully"
    
    # Check if dist directory was created
    if [ -d "dist" ]; then
        success "Build output (dist) directory created"
    else
        error "Build output directory not created"
    fi
else
    error "Frontend build failed - run 'npm run build' to see errors"
fi

# Check for .env.production
if [ -f ".env.production" ]; then
    success ".env.production found"
else
    warning ".env.production not found - create it with VITE_API_URL"
fi

echo ""
echo "📄 Checking Configuration Files..."
echo "──────────────────────────────────"

# Check render.yaml
if [ -f "render.yaml" ]; then
    success "render.yaml found"
else
    warning "render.yaml not found - needed for Render deployment"
fi

# Check netlify.toml
if [ -f "netlify.toml" ]; then
    success "netlify.toml found"
else
    warning "netlify.toml not found - needed for Netlify deployment"
fi

# Check for .env files (should not be committed)
if git ls-files | grep -q "\.env$"; then
  error ".env files found in git repository - these should NOT be committed!"
  echo "  Run: git rm --cached .env backend/.env"
else
  if [ -f ".env" ] || [ -f "backend/.env" ]; then
    success ".env files exist locally but are not tracked in git (good!)"
  fi
fi

# Check .gitignore
if [ -f ".gitignore" ]; then
    if grep -q ".env" .gitignore; then
        success ".gitignore includes .env files"
    else
        warning ".gitignore doesn't include .env - add it to prevent accidental commits"
    fi
else
    error ".gitignore not found"
fi

echo ""
echo "🔐 Security Checks..."
echo "────────────────────"

# Check for sensitive data in code
if grep -r "password.*=" --include="*.ts" --include="*.tsx" src/ | grep -v "password:" | grep -v "Password" > /dev/null 2>&1; then
    warning "Potential hardcoded passwords found - review your code"
fi

# Check for API keys in code
if grep -r "api.*key.*=" --include="*.ts" --include="*.tsx" src/ | grep -v "apikey:" > /dev/null 2>&1; then
    warning "Potential hardcoded API keys found - review your code"
fi

echo ""
echo "📚 Checking Documentation..."
echo "────────────────────────────"

if [ -f "README.md" ]; then
    success "README.md found"
else
    warning "README.md not found"
fi

if [ -f "RENDER_DEPLOYMENT_GUIDE.md" ]; then
    success "Deployment guide found"
else
    warning "Deployment guide not found"
fi

echo ""
echo "════════════════════════════════"
echo "📊 SUMMARY"
echo "════════════════════════════════"

if [ $ERRORS -eq 0 ] && [ $WARNINGS -eq 0 ]; then
    echo -e "${GREEN}✓ All checks passed! Ready to deploy! 🚀${NC}"
    exit 0
elif [ $ERRORS -eq 0 ]; then
    echo -e "${YELLOW}⚠ ${WARNINGS} warning(s) found - review and fix if needed${NC}"
    exit 0
else
    echo -e "${RED}✗ ${ERRORS} error(s) and ${WARNINGS} warning(s) found${NC}"
    echo ""
    echo "Please fix the errors before deploying."
    exit 1
fi
