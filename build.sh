#!/bin/bash

# Netlify build script for Next.js
echo "🚀 Starting Netlify build for SkillSyncZ..."

# Install dependencies
npm install

# Build the Next.js application
npm run build

echo "✅ Build completed successfully!"