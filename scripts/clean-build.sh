#!/bin/bash

# Remove Next.js cache and build files
rm -rf .next
rm -rf out

# Clear TypeScript cache
rm -rf tsconfig.tsbuildinfo

# Reinstall dependencies if needed
# npm ci

# Rebuild the project
npm run build
