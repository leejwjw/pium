#!/bin/bash
set -e

echo "======================================"
echo "Building Frontend (React)..."
echo "======================================"
cd frontend
npm install
npm run build
cd ..

echo "======================================"
echo "Copying Frontend Build to Spring Boot..."
echo "======================================"
rm -rf src/main/resources/static/*
cp -r frontend/build/* src/main/resources/static/

echo "======================================"
echo "Building Backend (Spring Boot)..."
echo "======================================"
./gradlew clean build -x test

echo "======================================"
echo "Build Complete!"
echo "======================================"
