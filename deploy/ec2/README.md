# EC2 one-time setup (i-02ffd3e87fae26569, 16.16.24.158)

Run once, manually, over SSH. Not part of the automated deploy - only
repeat the "copy files" step below when docker-compose.prod.yml or
deploy/nginx/ change.

## 1. Install Docker + Docker Compose plugin (Amazon Linux 2023)

```
sudo dnf update -y
sudo dnf install -y docker
sudo systemctl enable --now docker
sudo usermod -aG docker ec2-user

DOCKER_CONFIG=${DOCKER_CONFIG:-/usr/local/lib/docker}
sudo mkdir -p $DOCKER_CONFIG/cli-plugins
sudo curl -SL https://github.com/docker/compose/releases/latest/download/docker-compose-linux-x86_64 \
  -o $DOCKER_CONFIG/cli-plugins/docker-compose
sudo chmod +x $DOCKER_CONFIG/cli-plugins/docker-compose
```

Log out/back in (or `newgrp docker`) for the group change to take effect.

## 2. Confirm the SSM Agent and AWS CLI are present

Amazon Linux 2023 ships both by default. Confirm:
```
sudo systemctl status amazon-ssm-agent
aws --version
```

## 3. Create the app directory and copy files

From your local machine:
```
scp -i paddle-ec2-key.pem -r deploy/nginx docker-compose.prod.yml deploy/ec2/deploy.sh ec2-user@16.16.24.158:/tmp/paddle-deploy
```
Then on the instance:
```
sudo mkdir -p /opt/paddle
sudo cp -r /tmp/paddle-deploy/nginx /opt/paddle/deploy/nginx  # keep the deploy/nginx/ path used by docker-compose.prod.yml's build context
sudo cp /tmp/paddle-deploy/docker-compose.prod.yml /opt/paddle/
sudo cp /tmp/paddle-deploy/deploy.sh /opt/paddle/
sudo chmod +x /opt/paddle/deploy.sh
sudo chown -R ec2-user:ec2-user /opt/paddle
```

Re-run this step any time docker-compose.prod.yml or deploy/nginx/nginx.conf
change in git - the automated deploy does not sync these files.

## 4. First-ever deploy: create the database via AUTO_MIGRATE

The RDS instance has no `paddledb` database yet - only the default
`postgres` system database. EF Core's `Database.MigrateAsync()` creates the
target database automatically the first time it connects (via Npgsql) if it
doesn't exist yet, then applies migrations - no manual `CREATE DATABASE` is
needed.

For the *first* deploy only, run the deploy script with its second argument
set to `true`. This is a positional argument, not an environment variable -
the script runs under `sudo -u ec2-user -i`, which starts a clean login
shell and drops any env var set ahead of the sudo call, so AUTO_MIGRATE has
to be passed as `$2` to actually reach the script:
```
sudo -u ec2-user -i bash /opt/paddle/deploy.sh <ECR_REGISTRY>/paddle-api:latest true
```
Confirm it came up clean (`docker compose -f /opt/paddle/docker-compose.prod.yml logs api`),
then omit the second argument (defaults to false in deploy.sh) for every
deploy after - it's gated off by default specifically so it never re-runs
unattended in CI.

## 5. Verify

```
curl http://localhost/health
```
should return `"Healthy"` through nginx -> api.

## Manual troubleshooting later

SSH in:
```
ssh -i paddle-ec2-key.pem ec2-user@16.16.24.158
```

Check container status and logs:
```
docker compose -f /opt/paddle/docker-compose.prod.yml ps
docker compose -f /opt/paddle/docker-compose.prod.yml logs -f api
docker compose -f /opt/paddle/docker-compose.prod.yml logs -f nginx
```

Re-run a deploy manually (e.g. to test without pushing to git):
```
sudo -u ec2-user -i bash /opt/paddle/deploy.sh <ECR_REGISTRY>/paddle-api:<tag>
```
