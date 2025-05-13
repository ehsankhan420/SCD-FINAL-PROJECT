@echo off
setlocal

:: Set your Docker Hub username
set DOCKER_USERNAME=undergroundehsan

:: Book Management System Docker Hub Push Script
echo === Book Management System Docker Hub Push ===

:: Check if Docker is running
docker info > nul 2>&1
if %ERRORLEVEL% neq 0 (
  echo X Docker is not running. Please start Docker and try again.
  exit /b 1
)

:: Login to Docker Hub
echo Logging in to Docker Hub...
docker login

if %ERRORLEVEL% neq 0 (
  echo X Docker Hub login failed. Please check your credentials and try again.
  exit /b 1
)

echo ✓ Docker Hub login successful!

:: Build the images
echo Building frontend image...
docker build -t %DOCKER_USERNAME%/book-management-frontend:latest -f Dockerfile .

echo Building backend image...
docker build -t %DOCKER_USERNAME%/book-management-backend:latest -f backend/Dockerfile ./backend

if %ERRORLEVEL% neq 0 (
  echo X Docker build failed. Please check the error messages above.
  exit /b 1
)

echo ✓ Images built successfully!

:: Push the images to Docker Hub
echo Pushing frontend image to Docker Hub...
docker push %DOCKER_USERNAME%/book-management-frontend:latest

echo Pushing backend image to Docker Hub...
docker push %DOCKER_USERNAME%/book-management-backend:latest

if %ERRORLEVEL% neq 0 (
  echo X Push to Docker Hub failed. Please check the error messages above.
  exit /b 1
)

echo ✓ Images pushed to Docker Hub successfully!
echo.
echo Frontend image: %DOCKER_USERNAME%/book-management-frontend:latest
echo Backend image: %DOCKER_USERNAME%/book-management-backend:latest
echo.
echo === Docker Hub Push Complete ===

endlocal 