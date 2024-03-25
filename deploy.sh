# build docker images

REGION=
ACCOUNT_ID=
FRONTEND_TAG=
BACKEND_TAG=
BACKEND_URI=

aws ecr get-login-password --region $REGION | docker login --username AWS --password-stdin $ACCOUNT_ID.dkr.ecr.$REGION.amazonaws.com

echo "Building frontend..."
cd main/frontend/
docker build -t $FRONTEND_TAG -f docker/Dockerfile --target prod --build-arg NEXT_PUBLIC_API_BASE_URL=$BACKEND_URI ./app

echo "Building backend..."
cd ../backend/
docker build -t $BACKEND_TAG -f docker/Dockerfile --target prod ./app

docker push $FRONTEND_TAG
docker push $BACKEND_TAG
 
aws ecs update-service --force-new-deployment --cluster --service 
aws ecs update-service --force-new-deployment --cluster --service --enable-execute-command