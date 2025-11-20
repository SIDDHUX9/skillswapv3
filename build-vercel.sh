#!/bin/bash

# Production build script for Vercel deployment

echo "🚀 Starting production build..."

# Install dependencies
echo "📦 Installing dependencies..."
npm install

# Generate Prisma client
echo "🔧 Generating Prisma client..."
npx prisma generate

# Build the application
echo "🏗️ Building Next.js application..."
npm run build

echo "✅ Build completed successfully!"