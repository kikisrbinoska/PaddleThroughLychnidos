## Build stage - restores and publishes the API project via the slnx solution
## so project references (Application/Domain/Infrastructure) resolve correctly.
FROM mcr.microsoft.com/dotnet/sdk:9.0 AS build
WORKDIR /src

COPY PaddleThroughLychnidos.slnx .
COPY PaddleThroughLychnidos.API/PaddleThroughLychnidos.API.csproj PaddleThroughLychnidos.API/
COPY PaddleThroughLychnidos.Application/PaddleThroughLychnidos.Application.csproj PaddleThroughLychnidos.Application/
COPY PaddleThroughLychnidos.Domain/PaddleThroughLychnidos.Domain.csproj PaddleThroughLychnidos.Domain/
COPY PaddleThroughLychnidos.Infrastructure/PaddleThroughLychnidos.Infrastructure.csproj PaddleThroughLychnidos.Infrastructure/
RUN dotnet restore PaddleThroughLychnidos.API/PaddleThroughLychnidos.API.csproj

COPY PaddleThroughLychnidos.API/ PaddleThroughLychnidos.API/
COPY PaddleThroughLychnidos.Application/ PaddleThroughLychnidos.Application/
COPY PaddleThroughLychnidos.Domain/ PaddleThroughLychnidos.Domain/
COPY PaddleThroughLychnidos.Infrastructure/ PaddleThroughLychnidos.Infrastructure/

RUN dotnet publish PaddleThroughLychnidos.API/PaddleThroughLychnidos.API.csproj \
    -c Release \
    -o /app/publish \
    --no-restore

## Runtime stage - ASP.NET Core runtime only, no SDK.
FROM mcr.microsoft.com/dotnet/aspnet:9.0 AS runtime
WORKDIR /app

# curl is not in this base image by default - needed for the Compose
# healthcheck to be able to hit /health from inside the container.
RUN apt-get update && apt-get install -y --no-install-recommends curl \
    && rm -rf /var/lib/apt/lists/*

# Matches the existing "Container (Dockerfile)" launchSettings.json profile.
ENV ASPNETCORE_HTTP_PORTS=8080
ARG ASPNETCORE_ENVIRONMENT=Production
ENV ASPNETCORE_ENVIRONMENT=${ASPNETCORE_ENVIRONMENT}

EXPOSE 8080

COPY --from=build /app/publish .

ENTRYPOINT ["dotnet", "PaddleThroughLychnidos.API.dll"]
