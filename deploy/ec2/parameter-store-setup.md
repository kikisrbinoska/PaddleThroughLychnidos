# One-time Parameter Store setup

Run these yourself (AWS CloudShell or local terminal with AWS CLI configured)
- replace the `<...>` placeholders with real values, never paste secrets into
chat. Region must match the workflow (`eu-north-1`).

```
aws ssm put-parameter \
  --name /paddle/prod/db-connection-string \
  --type SecureString \
  --value "Host=paddle-db.c3su8wg808dj.eu-north-1.rds.amazonaws.com;Port=5432;Database=paddledb;User Id=postgres;Password=<RDS_MASTER_PASSWORD>" \
  --region eu-north-1

aws ssm put-parameter \
  --name /paddle/prod/jwt-secret \
  --type SecureString \
  --value "<NEW_LONG_RANDOM_JWT_SECRET>" \
  --region eu-north-1

aws ssm put-parameter \
  --name /paddle/prod/youtube-api-key \
  --type SecureString \
  --value "<NEW_YOUTUBE_API_KEY>" \
  --region eu-north-1
```

## Note on the Google Places key

`deploy.sh` does not fetch a `/paddle/prod/google-places-api-key` parameter,
and `docker-compose.prod.yml` does not reference one. That key is only used
by `OhridShopsExporter`, a standalone local console tool for one-off data
imports (see `OhridShopsExporter/Program.cs` - it reads `GooglePlacesApiKey`
straight from `appsettings.json`, not from any web API config). It has never
been part of `PaddleThroughLychnidos.API` or `docker-compose.yml`, so there
is nothing for the EC2 deployment to consume it for. Skip creating this
parameter unless you specifically plan to run the exporter tool itself from
somewhere other than your machine.

## Updating a value later

Re-run the same command with `--overwrite`:
```
aws ssm put-parameter \
  --name /paddle/prod/jwt-secret \
  --type SecureString \
  --value "<NEW_VALUE>" \
  --overwrite \
  --region eu-north-1
```

## Verify (does not print the decrypted value)

```
aws ssm describe-parameters --region eu-north-1 \
  --parameter-filters "Key=Name,Option=BeginsWith,Values=/paddle/prod/"
```
