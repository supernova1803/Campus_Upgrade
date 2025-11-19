#!/bin/bash
echo '🚀 Starting Campus Upgrade Frontend Setup...'
cd "$(dirname "$0")/frontend"

if ! command -v npm &> /dev/null; then
  echo '❌ npm not found! Please install Node.js and npm first.'
  exit 1
fi

echo '📦 Installing dependencies...'
npm install

echo '▶️ Starting development server...'
npm run dev
