@echo off
setlocal

:: Set your Docker Hub username
set DOCKER_USERNAME=undergroundehsan

:: Book Management System Kubernetes Deployment Script
echo === Book Management System Kubernetes Deployment ===

:: Check if kubectl is installed
where kubectl >nul 2>&1
if %ERRORLEVEL% neq 0 (
  echo X kubectl is not installed. Please install kubectl and try again.
  exit /b 1
)

:: Check kubectl connectivity
echo Checking kubectl connectivity...
kubectl get nodes >nul 2>&1
if %ERRORLEVEL% neq 0 (
  echo X Cannot connect to Kubernetes cluster. Please check your kubeconfig and try again.
  exit /b 1
)

echo ✓ Connected to Kubernetes cluster!

:: Create a temporary deployment file with the Docker Hub username
echo Creating deployment with Docker Hub images...
(for /f "delims=" %%a in (deployment.yaml) do (
    set "line=%%a"
    setlocal enabledelayedexpansion
    set "line=!line:${DOCKER_USERNAME}=%DOCKER_USERNAME%!"
    echo !line!
    endlocal
)) > deployment-with-dockerhub.yaml

:: Apply Kubernetes resources
echo Applying Kubernetes resources...

echo Creating ConfigMap...
kubectl apply -f configmap.yaml

echo Creating Secrets...
kubectl apply -f secrets.yaml

echo Creating PVC...
kubectl apply -f pvc.yaml

echo Creating Services...
kubectl apply -f service.yaml

echo Deploying applications...
kubectl apply -f deployment-with-dockerhub.yaml

if %ERRORLEVEL% neq 0 (
  echo X Kubernetes deployment failed. Please check the error messages above.
  exit /b 1
)

:: Clean up temporary file
del deployment-with-dockerhub.yaml

echo ✓ Kubernetes deployment successful!
echo.
echo Checking deployment status...
kubectl get deployments

echo.
echo To access the application, run:
echo kubectl port-forward svc/frontend-service 3000:3000
echo.
echo === Kubernetes Deployment Complete ===

endlocal 