# Book Management System

A full-stack application for managing your book collection, built with Next.js, Express, and MongoDB.

## Features

- User authentication (register, login, logout)
- Add, edit, view, and delete books
- Search and filter your book collection
- Track reading status of books

## Technology Stack

- **Frontend**: Next.js, React, TypeScript, Tailwind CSS
- **Backend**: Express.js, Node.js
- **Database**: MongoDB
- **Authentication**: JWT (JSON Web Tokens)
- **Containerization**: Docker

## Docker Setup

### Prerequisites

- Docker and Docker Compose installed on your machine

### Building and Running with Docker Compose

#### Option 1: Using the automated script

Run the provided build script:

```bash
./docker-build.sh
```

This script will:
- Build the Docker images
- Start the containers
- Test if the services are accessible
- Display appropriate logs if there are issues

#### Option 2: Manual steps

1. Build the containers:
```bash
docker-compose build --no-cache
```

2. Start the containers:
```bash
docker-compose up -d
```

3. Check container status:
```bash
./docker-check.sh
```

4. To see logs:
```bash
./docker-check.sh --logs
```

### Accessing the Application

- Frontend: http://localhost:3000
- Backend API: http://localhost:5000/api

### Stopping the Containers

```bash
docker-compose down
```

## Running Locally (without Docker)

### Frontend

```bash
# From the project root
npm install
npm run dev
```

### Backend

```bash
# From the backend directory
cd backend
npm install
npm run dev
```

## Environment Variables

### Frontend (.env.local)

```
NEXT_PUBLIC_API_URL=http://localhost:5000/api
```

### Backend (.env)

```
PORT=5000
MONGODB_URI=your_mongodb_connection_string
JWT_SECRET=your_jwt_secret
```

## Troubleshooting

If you encounter issues with the Docker setup:

1. Check the container logs:
```bash
docker-compose logs
```

2. Ensure MongoDB connection is working:
```bash
curl http://localhost:5000/api/test
```

3. If frontend build fails, try building without Docker:
```bash
npm install --legacy-peer-deps
npm run build
``` 