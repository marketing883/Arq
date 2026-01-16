#!/bin/bash
# ArqAI Environment Setup Script
# Run this after deployment to ensure all required environment variables are set

set -e

SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
PROJECT_DIR="$(dirname "$SCRIPT_DIR")"
ENV_EXAMPLE="$PROJECT_DIR/.env.example"
ENV_LOCAL="$PROJECT_DIR/.env.local"

echo "=== ArqAI Environment Setup ==="
echo ""

# Check if .env.example exists
if [ ! -f "$ENV_EXAMPLE" ]; then
    echo "ERROR: .env.example not found at $ENV_EXAMPLE"
    exit 1
fi

# Create .env.local if it doesn't exist
if [ ! -f "$ENV_LOCAL" ]; then
    echo "Creating .env.local from .env.example..."
    cp "$ENV_EXAMPLE" "$ENV_LOCAL"
    chmod 600 "$ENV_LOCAL"
    echo "Created $ENV_LOCAL - please edit it with your actual credentials."
    echo ""
fi

# Required variables for production
REQUIRED_VARS=(
    "JWT_SECRET"
)

# Optional but recommended variables
RECOMMENDED_VARS=(
    "ANTHROPIC_API_KEY"
    "OPENAI_API_KEY"
    "NEXT_PUBLIC_SUPABASE_URL"
    "NEXT_PUBLIC_SUPABASE_ANON_KEY"
    "SUPABASE_SERVICE_ROLE_KEY"
    "RESEND_API_KEY"
)

echo "Checking environment variables in .env.local..."
echo ""

# Check required variables
MISSING_REQUIRED=()
for var in "${REQUIRED_VARS[@]}"; do
    if grep -q "^${var}=" "$ENV_LOCAL" 2>/dev/null; then
        value=$(grep "^${var}=" "$ENV_LOCAL" | cut -d'=' -f2-)
        if [ -z "$value" ] || [[ "$value" == *"xxxxx"* ]] || [[ "$value" == *"your-"* ]]; then
            MISSING_REQUIRED+=("$var")
        else
            echo "[OK] $var is set"
        fi
    else
        MISSING_REQUIRED+=("$var")
    fi
done

echo ""

# Check recommended variables
MISSING_RECOMMENDED=()
for var in "${RECOMMENDED_VARS[@]}"; do
    if grep -q "^${var}=" "$ENV_LOCAL" 2>/dev/null; then
        value=$(grep "^${var}=" "$ENV_LOCAL" | cut -d'=' -f2-)
        if [ -z "$value" ] || [[ "$value" == *"xxxxx"* ]] || [[ "$value" == *"your-"* ]]; then
            MISSING_RECOMMENDED+=("$var")
        else
            echo "[OK] $var is set"
        fi
    else
        MISSING_RECOMMENDED+=("$var")
    fi
done

echo ""

# Report missing variables
if [ ${#MISSING_REQUIRED[@]} -gt 0 ]; then
    echo "=== CRITICAL: Missing Required Variables ==="
    for var in "${MISSING_REQUIRED[@]}"; do
        echo "  - $var"
    done
    echo ""
    echo "These variables MUST be set for production to work!"
    echo ""
fi

if [ ${#MISSING_RECOMMENDED[@]} -gt 0 ]; then
    echo "=== WARNING: Missing Recommended Variables ==="
    for var in "${MISSING_RECOMMENDED[@]}"; do
        echo "  - $var"
    done
    echo ""
    echo "Some features may not work without these variables."
    echo ""
fi

# Generate JWT_SECRET if needed
if [[ " ${MISSING_REQUIRED[*]} " =~ " JWT_SECRET " ]]; then
    echo "Would you like to generate a secure JWT_SECRET? (y/n)"
    read -r response
    if [[ "$response" =~ ^[Yy]$ ]]; then
        NEW_SECRET=$(openssl rand -base64 48)
        if grep -q "^JWT_SECRET=" "$ENV_LOCAL"; then
            sed -i "s|^JWT_SECRET=.*|JWT_SECRET=$NEW_SECRET|" "$ENV_LOCAL"
        else
            echo "JWT_SECRET=$NEW_SECRET" >> "$ENV_LOCAL"
        fi
        echo ""
        echo "JWT_SECRET has been generated and added to .env.local"
    fi
fi

echo ""
echo "=== Setup Complete ==="
echo ""
echo "Next steps:"
echo "1. Edit $ENV_LOCAL to add any missing credentials"
echo "2. Run: npm run build"
echo "3. Restart the app: pm2 restart all"
echo ""
