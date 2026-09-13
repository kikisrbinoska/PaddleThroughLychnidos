# Running with Docker Compose

Three services: `db` (Postgres), `api` (.NET backend), `web` (React frontend, served by nginx).

## First-time setup

1. Copy the env template and fill in real values:

   ```
   cp .env.example .env
   ```

   At minimum, set a real `JWT_SECRET` and `POSTGRES_PASSWORD`. `.env` is gitignored - never commit it.

2. Build and start everything:

   ```
   docker compose up --build
   ```

   On first run, `AUTO_MIGRATE=true` (the default in `.env.example`) makes the API apply all EF Core migrations automatically on startup, against the fresh `db` container - no separate migration step needed.

## Ports

| Service | Host port (default) | What's there |
|---|---|---|
| `web` | `http://localhost:80` | The app (nginx serving the Vite build) |
| `api` | `http://localhost:8080` | REST API, Swagger UI at `/swagger`, health check at `/health` |
| `db` | not exposed to host | Postgres, reachable only from `api` inside the compose network |

Override any of these via `.env` (`WEB_HTTP_PORT`, `API_HTTP_PORT`).

## Migrations after the first run

`AUTO_MIGRATE=true` re-applies on every `api` container start (EF Core skips migrations already recorded as applied, so this is safe/idempotent - it's not risk-free to leave on indefinitely, just low-risk for local dev).

To apply migrations manually instead (e.g. if you set `AUTO_MIGRATE=false`):

```
docker compose run --rm api dotnet ef database update --project /src/PaddleThroughLychnidos.Infrastructure --startup-project /src/PaddleThroughLychnidos.API
```

Note: the shipped `api` image is a runtime-only image without the `dotnet-ef` tool or source tree, so the command above only works if run against the `build` stage or from your host machine's checkout with `dotnet ef` installed locally (`dotnet tool install --global dotnet-ef`) and `ConnectionStrings__Database` pointed at `localhost:<API_HTTP_PORT>`'s Postgres port instead - the simplest path for local dev is just leaving `AUTO_MIGRATE=true` on.

## Logs

```
docker compose logs -f api
docker compose logs -f web
docker compose logs -f db
```

Omit the service name to stream all three at once.

## Stopping

```
docker compose down
```

Add `-v` to also delete the `db-data` volume (wipes the database).

## Notes

- `AUTO_MIGRATE` is meant to be turned off before this stack is deployed anywhere beyond a local machine (e.g. once Azure deployment is set up) - it's convenient here, not something to leave on unattended.
- The frontend's `VITE_API_BASE_URL` is baked into the static build at Docker build time (Vite inlines `VITE_*` vars), so changing `API_HTTP_PORT` requires a rebuild (`docker compose up --build`), not just a restart.
