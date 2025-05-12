#!/bin/bash

echo "=== Starting Book Management System Docker Build ==="
echo "Building Docker containers..."
docker-compose build --no-cache

if [ $? -eq 0 ]; then
  echo "✅ Build successful!"
  
  echo "Starting containers..."
  docker-compose up -d
  
  if [ $? -eq 0 ]; then
    echo "✅ Containers started successfully!"
    echo "Frontend: http://localhost:3000"
    echo "Backend: http://localhost:5000"
    
    # Wait for services to start
    echo "Waiting for services to start (10 seconds)..."
    sleep 10
    
    # Test if the frontend is accessible
    echo "Testing frontend..."
    if curl -s -f -o /dev/null http://localhost:3000; then
      echo "✅ Frontend is accessible"
    else
      echo "❌ Frontend is not accessible"
      echo "Checking logs for frontend container..."
      docker-compose logs frontend --tail 50
    fi
    
    # Test if the backend is accessible
    echo "Testing backend..."
    if curl -s -f -o /dev/null http://localhost:5000/api/test; then
      echo "✅ Backend is accessible"
    else
      echo "❌ Backend is not accessible"
      echo "Checking logs for backend container..."
      docker-compose logs backend --tail 50
    fi
    
    echo ""
    echo "=== Deployment Complete ==="
    echo "To stop the containers, run: docker-compose down"
  else
    echo "❌ Failed to start containers"
    echo "Checking logs..."
    docker-compose logs
  fi
else
  echo "❌ Build failed"
  echo "Try running manually with: docker-compose build --no-cache"
fi 