#!/usr/bin/env bash
# Runs on the EC2 instance via SSM Run Command on every deploy.
# Arg 1: full ECR image ref, e.g. 605606417079.dkr.ecr.eu-north-1.amazonaws.com/paddle-api:abcdef1
set -euo pipefail

IMAGE_REF="$1"
AWS_REGION="eu-north-1"
APP_DIR="/opt/paddle"
ECR_REGISTRY="605606417079.dkr.ecr.eu-north-1.amazonaws.com"

cd "$APP_DIR"

aws ecr get-login-password --region "$AWS_REGION" \
  | docker login --username AWS --password-stdin "$ECR_REGISTRY"

# Pull secrets fresh from Parameter Store every deploy - .env is never
# committed or baked into the image, only written here on the instance.
DB_CONNECTION_STRING=$(aws ssm get-parameter --name /paddle/prod/db-connection-string --with-decryption --region "$AWS_REGION" --query "Parameter.Value" --output text)
JWT_SECRET=$(aws ssm get-parameter --name /paddle/prod/jwt-secret --with-decryption --region "$AWS_REGION" --query "Parameter.Value" --output text)
YOUTUBE_API_KEY=$(aws ssm get-parameter --name /paddle/prod/youtube-api-key --with-decryption --region "$AWS_REGION" --query "Parameter.Value" --output text)

# First deploy only: set AUTO_MIGRATE=true once manually on the instance
# (see deploy notes), then flip back to false for every deploy after.
AUTO_MIGRATE="${AUTO_MIGRATE:-false}"

cat > "$APP_DIR/.env" <<EOF
ECR_IMAGE=$IMAGE_REF
DB_CONNECTION_STRING=$DB_CONNECTION_STRING
AUTO_MIGRATE=$AUTO_MIGRATE
FRONTEND_ORIGIN=http://addle-through-lychnidos-web-2026.s3-website.eu-north-1.amazonaws.com
JWT_SECRET=$JWT_SECRET
YOUTUBE_API_KEY=$YOUTUBE_API_KEY
EOF
chmod 600 "$APP_DIR/.env"

docker compose -f "$APP_DIR/docker-compose.prod.yml" pull api
docker compose -f "$APP_DIR/docker-compose.prod.yml" build nginx
docker compose -f "$APP_DIR/docker-compose.prod.yml" up -d --remove-orphans

docker image prune -f
