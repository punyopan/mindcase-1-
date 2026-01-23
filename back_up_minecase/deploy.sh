#!/bin/bash
# deploy.sh - Headless Deployment Script for MindCase
# Usage: ./deploy.sh

set -e

echo "🚀 MindCase Headless Deployment"
echo "================================"

# Check if doppler is available for secrets
if command -v doppler &> /dev/null; then
    echo "✅ Doppler detected - using Doppler for secrets"
    export $(doppler secrets download --no-file --format env)
else
    echo "⚠️  Doppler not found - ensure .env file exists with secrets"
    if [ -f .env ]; then
        export $(cat .env | grep -v '^#' | xargs)
    else
        echo "❌ No .env file found! Create one with required secrets."
        exit 1
    fi
fi

# Stop any running containers
echo "📦 Stopping existing containers..."
docker compose down --remove-orphans 2>/dev/null || true

# Build and start
echo "🔨 Building containers..."
docker compose build --no-cache

echo "🚀 Starting containers..."
docker compose up -d

# Wait for health check
echo "⏳ Waiting for services to be healthy..."
sleep 10

# Check status
echo ""
echo "📊 Container Status:"
docker compose ps

echo ""
echo "✅ Deployment complete!"
echo "🌐 Access your app at: http://5.78.155.127"
echo ""
echo "📋 Useful commands:"
echo "   View logs:     docker compose logs -f"
echo "   Stop app:      docker compose down"
echo "   Restart:       docker compose restart"
