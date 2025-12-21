#!/bin/bash

# iOS Build Script for ibeni App
# This script prepares the project for iOS build and TestFlight distribution

set -e  # Exit on error

echo "🚀 Starting iOS Build Process for ibeni"
echo "========================================"
echo ""

# Colors for output
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
RED='\033[0;31m'
NC='\033[0m' # No Color

# Check if we're in the project root
if [ ! -f "package.json" ]; then
    echo -e "${RED}❌ Error: package.json not found. Please run this script from the project root.${NC}"
    exit 1
fi

# Step 1: Install dependencies
echo -e "${YELLOW}📦 Step 1: Installing dependencies...${NC}"
npm install
echo -e "${GREEN}✅ Dependencies installed${NC}"
echo ""

# Step 2: Build web assets
echo -e "${YELLOW}🔨 Step 2: Building web assets...${NC}"
npm run build
if [ ! -d "dist" ]; then
    echo -e "${RED}❌ Error: dist folder not created. Build failed.${NC}"
    exit 1
fi
echo -e "${GREEN}✅ Web assets built successfully${NC}"
echo ""

# Step 3: Sync Capacitor
echo -e "${YELLOW}🔄 Step 3: Syncing Capacitor...${NC}"
npx cap sync ios
echo -e "${GREEN}✅ Capacitor synced${NC}"
echo ""

# Step 4: Install CocoaPods (if needed)
echo -e "${YELLOW}📱 Step 4: Installing CocoaPods dependencies...${NC}"
cd ios/App
if [ -f "Podfile" ]; then
    pod install
    echo -e "${GREEN}✅ CocoaPods installed${NC}"
else
    echo -e "${YELLOW}⚠️  Podfile not found, skipping pod install${NC}"
fi
cd ../..
echo ""

# Step 5: Summary
echo -e "${GREEN}✅ Build preparation complete!${NC}"
echo ""
echo "Next steps:"
echo "1. Open Xcode: npx cap open ios"
echo "2. Configure signing in Xcode (Signing & Capabilities tab)"
echo "3. Select 'Any iOS Device' as build target"
echo "4. Product → Archive"
echo "5. Distribute to App Store Connect"
echo ""
echo "For detailed instructions, see: IOS_TESTFLIGHT_GUIDE.md"
echo ""

