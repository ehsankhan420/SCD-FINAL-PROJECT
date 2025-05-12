#!/bin/bash

echo "=== Checking Book Management System Containers ==="

# Check if containers are running
echo "Checking container status..."
docker-compose ps

# Check container health
echo -e "\nChecking container health..."
docker ps --format "{{.Names}} - Health: {{.Status}}"

# Test API endpoints
echo -e "\nTesting API endpoints..."
echo -n "Frontend (http://localhost:3000): "
if curl -s -f -o /dev/null http://localhost:3000; then
  echo "✅ Accessible"
else
  echo "❌ Not accessible"
fi

echo -n "Backend (http://localhost:5000/api/test): "
if curl -s -f -o /dev/null http://localhost:5000/api/test; then
  echo "✅ Accessible"
else
  echo "❌ Not accessible"
fi

# Show container logs if requested
if [ "$1" == "--logs" ]; then
  echo -e "\nFrontend logs:"
  docker-compose logs --tail 20 frontend
  
  echo -e "\nBackend logs:"
  docker-compose logs --tail 20 backend
fi

echo -e "\n=== Check Complete ==="
echo "To see logs, run: docker-compose logs"
echo "To stop the containers, run: docker-compose down" 