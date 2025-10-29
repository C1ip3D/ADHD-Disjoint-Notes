#!/bin/bash

echo "🚀 Optimizing build for production..."

# Clean everything
echo "🧹 Cleaning old builds..."
rm -rf dist
rm -rf node_modules/.vite
rm -rf ios/App/build
rm -rf ~/Library/Developer/Xcode/DerivedData/*

# Build with production optimizations
echo "📦 Building production bundle..."
NODE_ENV=production npm run build

# Sync to iOS
echo "📱 Syncing to iOS..."
npx cap sync ios

echo "✅ Build optimized! Now open in Xcode:"
echo "   npx cap open ios"
echo ""
echo "In Xcode:"
echo "1. Product → Clean Build Folder (Shift+Cmd+K)"
echo "2. Product → Build (Cmd+B)"
echo "3. Run on your device"

