@echo off
setlocal

:: Set your Docker Hub username - update if needed
set DOCKER_USERNAME=undergroundehsan

:: Set the namespace for your application
set NAMESPACE=book-system

echo ===== Book Management System Local Kubernetes Deployment =====

:: Check if kubectl is accessible
kubectl version --client >nul 2>&1
if %ERRORLEVEL% neq 0 (
  echo kubectl not found directly, will use minikube kubectl instead...
  set KUBECTL=minikube kubectl --
) else (
  set KUBECTL=kubectl
)

:: Check if Minikube is running
echo Checking Minikube status...
minikube status >nul 2>&1
if %ERRORLEVEL% neq 0 (
  echo Starting Minikube...
  minikube start --memory=2048 --cpus=2
  if %ERRORLEVEL% neq 0 (
    echo WARNING: There was an issue starting Minikube, but we'll try to continue...
  )
)

:: Create namespace if it doesn't exist
echo Creating namespace %NAMESPACE% if it doesn't exist...
%KUBECTL% get namespace %NAMESPACE% >nul 2>&1
if %ERRORLEVEL% neq 0 (
  %KUBECTL% create namespace %NAMESPACE%
  echo Namespace %NAMESPACE% created.
) else (
  echo Namespace %NAMESPACE% already exists.
)

:: Set current context to use the namespace
echo Setting default namespace to %NAMESPACE%...
%KUBECTL% config set-context --current --namespace=%NAMESPACE%

:: Generate files with the proper Docker Hub username
echo Creating deployment files...

:: Create MongoDB deployment
echo Creating MongoDB deployment...
(
echo apiVersion: apps/v1
echo kind: Deployment
echo metadata:
echo   name: mongodb
echo   namespace: %NAMESPACE%
echo   labels:
echo     app: book-management
echo     tier: database
echo spec:
echo   replicas: 1
echo   selector:
echo     matchLabels:
echo       app: book-management
echo       tier: database
echo   template:
echo     metadata:
echo       labels:
echo         app: book-management
echo         tier: database
echo     spec:
echo       containers:
echo       - name: mongodb
echo         image: mongo:latest
echo         ports:
echo         - containerPort: 27017
) > mongodb-deployment.yaml

:: Create MongoDB service
echo Creating MongoDB service...
(
echo apiVersion: v1
echo kind: Service
echo metadata:
echo   name: mongodb-service
echo   namespace: %NAMESPACE%
echo spec:
echo   selector:
echo     app: book-management
echo     tier: database
echo   ports:
echo   - port: 27017
echo     targetPort: 27017
echo   type: ClusterIP
) > mongodb-service.yaml

:: Create backend deployment
echo Creating backend deployment...
(
echo apiVersion: apps/v1
echo kind: Deployment
echo metadata:
echo   name: backend
echo   namespace: %NAMESPACE%
echo   labels:
echo     app: book-management
echo     tier: backend
echo spec:
echo   replicas: 1
echo   selector:
echo     matchLabels:
echo       app: book-management
echo       tier: backend
echo   template:
echo     metadata:
echo       labels:
echo         app: book-management
echo         tier: backend
echo     spec:
echo       containers:
echo       - name: backend
echo         image: %DOCKER_USERNAME%/book-management-backend:latest
echo         ports:
echo         - containerPort: 5000
echo         env:
echo         - name: MONGODB_URI
echo           value: "mongodb://mongodb-service:27017/bookmanagement"
) > backend-deployment.yaml

:: Create backend service
echo Creating backend service...
(
echo apiVersion: v1
echo kind: Service
echo metadata:
echo   name: backend-service
echo   namespace: %NAMESPACE%
echo spec:
echo   selector:
echo     app: book-management
echo     tier: backend
echo   ports:
echo   - port: 5000
echo     targetPort: 5000
echo   type: ClusterIP
) > backend-service.yaml

:: Create frontend deployment
echo Creating frontend deployment...
(
echo apiVersion: apps/v1
echo kind: Deployment
echo metadata:
echo   name: frontend
echo   namespace: %NAMESPACE%
echo   labels:
echo     app: book-management
echo     tier: frontend
echo spec:
echo   replicas: 1
echo   selector:
echo     matchLabels:
echo       app: book-management
echo       tier: frontend
echo   template:
echo     metadata:
echo       labels:
echo         app: book-management
echo         tier: frontend
echo     spec:
echo       containers:
echo       - name: frontend
echo         image: %DOCKER_USERNAME%/book-management-frontend:latest
echo         ports:
echo         - containerPort: 3000
echo         env:
echo         - name: NEXT_PUBLIC_API_URL
echo           value: "http://backend-service:5000/api"
) > frontend-deployment.yaml

:: Create frontend service
echo Creating frontend service...
(
echo apiVersion: v1
echo kind: Service
echo metadata:
echo   name: frontend-service
echo   namespace: %NAMESPACE%
echo spec:
echo   selector:
echo     app: book-management
echo     tier: frontend
echo   ports:
echo   - port: 3000
echo     targetPort: 3000
echo   type: NodePort
) > frontend-service.yaml

:: Apply Kubernetes resources
echo Applying Kubernetes resources...

echo Applying MongoDB deployment and service...
%KUBECTL% apply -f mongodb-deployment.yaml
%KUBECTL% apply -f mongodb-service.yaml

echo Applying backend deployment and service...
%KUBECTL% apply -f backend-deployment.yaml
%KUBECTL% apply -f backend-service.yaml

echo Applying frontend deployment and service...
%KUBECTL% apply -f frontend-deployment.yaml
%KUBECTL% apply -f frontend-service.yaml

:: Verify deployment
echo Verifying deployment...
echo.
echo Pods:
%KUBECTL% get pods -n %NAMESPACE%
echo.
echo Services:
%KUBECTL% get services -n %NAMESPACE%
echo.
echo Deployments:
%KUBECTL% get deployments -n %NAMESPACE%

:: Wait for pods to be ready
echo.
echo Waiting for pods to be ready (this may take a few minutes)...
%KUBECTL% wait --for=condition=Ready pods --all -n %NAMESPACE% --timeout=300s

:: Final verification
echo.
echo Final deployment status:
%KUBECTL% get all -n %NAMESPACE%

:: Provide access URL
echo.
echo To access the frontend service, run:
echo   minikube service frontend-service -n %NAMESPACE%
echo.
echo If you want to access the frontend service in your browser, run:
echo   minikube service frontend-service -n %NAMESPACE% --url
echo.
echo ===== Deployment Completed =====

endlocal 