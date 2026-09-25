# Paddle Through Lychnidos

A web platform for discovering, verifying, and promoting traditional artisan
shops around Lake Ohrid (historically known as Lychnidos), North Macedonia.
The platform connects visitors with local craftspeople through an interactive
map, curated itineraries, a digital "passport" of visited shops, and a
learning hub of craft-related video and news content.

## Table of Contents

1. [Overview](#overview)
2. [Core Features](#core-features)
3. [Architecture](#architecture)
4. [Technology Stack](#technology-stack)
5. [Repository Structure](#repository-structure)
6. [Getting Started](#getting-started)
7. [Configuration](#configuration)
8. [Running with Docker](#running-with-docker)
9. [Database Migrations](#database-migrations)
10. [Deployment](#deployment)
11. [License](#license)

## Overview

Paddle Through Lychnidos is a full-stack application composed of a .NET
backend API and a React single-page frontend. It allows visitors to explore
verified artisan shops by category and region, plan trips through curated
itineraries and day plans, leave reviews, and collect digital "passport
stamps" as they visit shops in person. Shop owners (artisans) can register
their businesses, submit them for administrative approval and verification,
manage products, and upload supporting media. Administrators moderate shop
submissions, manage taxonomy (categories, regions), and oversee platform
content.

The platform also aggregates supporting content automatically: instructional
videos are retrieved from the YouTube Data API and matched to craft
categories, while relevant news articles are collected from local news
sources through a scheduled scraping pipeline.

## Core Features

- **Shop directory and discovery** - Browse artisan shops with filtering by
  category, region, and verification status, displayed on an interactive map.
- **Shop registration and verification workflow** - Artisans submit shop
  listings, which pass through an administrative approval and verification
  process before becoming publicly visible.
- **Product catalog** - Each shop can list products, with supporting product
  video content.
- **Itineraries and day planning** - Curated multi-stop routes through the
  region, plus a personal day-planning tool for visitors to build their own
  itinerary from selected shops.
- **Reviews** - Registered users can leave a single review per shop.
- **Digital passport** - Users collect a passport stamp for each shop they
  visit and review, providing a gamified record of their trip.
- **Learning hub** - Craft-related instructional videos, sourced from the
  YouTube Data API and automatically categorized.
- **News feed** - Locally relevant news articles, collected on a schedule by
  an automated scraping pipeline.
- **Role-based access control** - Distinct capabilities for regular users,
  artisans, and administrators, enforced through JWT-based authentication and
  authorization.
- **Administrative dashboard** - Tools for managing shops, users, categories,
  regions, and verification requests.

## Architecture

The backend follows a layered, Clean Architecture-inspired design with a
CQRS-style request/response pattern:

- **Domain** - Plain entity classes and enumerations with no external
  dependencies.
- **Application** - Business logic expressed as request/response commands
  and queries, dispatched through MediatR and validated with FluentValidation.
  Depends only on Domain and defines abstractions implemented elsewhere.
- **Infrastructure** - Implements the Application layer's abstractions:
  Entity Framework Core data access against PostgreSQL, repositories, JWT
  authentication, file uploads, the YouTube video sync job, and the news
  scraping pipeline.
- **API** - ASP.NET Core Web API exposing the Application layer's use cases
  through REST controllers, with JWT bearer authentication, CORS, Swagger/
  OpenAPI documentation, and centralized exception handling.

The frontend is an independent single-page application built with React and
TypeScript, communicating with the API exclusively over HTTP.

## Technology Stack

**Backend**

- .NET 9 / ASP.NET Core Web API
- Entity Framework Core 9 with Npgsql (PostgreSQL provider)
- MediatR (CQRS-style command/query dispatch)
- FluentValidation
- JWT Bearer authentication
- Swashbuckle / OpenAPI
- HtmlAgilityPack (news scraping)

**Frontend**

- React 19 with TypeScript
- Vite build tooling
- React Router
- Tailwind CSS
- Leaflet / React-Leaflet (interactive maps)
- Axios

**Data and Infrastructure**

- PostgreSQL 16
- Docker and Docker Compose
- Nginx (frontend serving and reverse proxy in production)
- GitHub Actions (continuous integration and deployment)

## Repository Structure

```
PaddleThroughLychnidos.Domain/         Entity and enumeration definitions
PaddleThroughLychnidos.Application/    Commands, queries, validators, abstractions
PaddleThroughLychnidos.Infrastructure/ EF Core, repositories, auth, YouTube sync, news scraping
PaddleThroughLychnidos.API/            ASP.NET Core Web API host and controllers
PaddleThroughLychnidos.ShopImportRunner/  Console utility for bulk shop data import
OhridShopsExporter/                    Console utility for exporting shop data
paddle-through-lychnidos-frontend/     React + TypeScript single-page application
deploy/                                Deployment configuration and provisioning notes
```

## Getting Started

### Prerequisites

- .NET 9 SDK
- Node.js (LTS) and npm
- PostgreSQL 16 (or Docker, see below)

### Backend

```
dotnet restore
dotnet ef database update --project PaddleThroughLychnidos.Infrastructure --startup-project PaddleThroughLychnidos.API
dotnet run --project PaddleThroughLychnidos.API
```

The API exposes Swagger UI at `/swagger` when running in the Development
environment.

### Frontend

```
cd paddle-through-lychnidos-frontend
npm install
npm run dev
```

## Configuration

Backend configuration is supplied through `appsettings.json`,
`appsettings.Development.json`, and environment variables. Key settings
include:

| Setting | Purpose |
|---|---|
| `ConnectionStrings:Database` | PostgreSQL connection string |
| `Jwt:Secret` / `Jwt:Issuer` / `Jwt:Audience` / `Jwt:ExpiryMinutes` | JWT authentication configuration |
| `YouTube:ApiKey` / `YouTube:DailyUnitBudget` | YouTube Data API credentials and quota budget for the Learn video sync job |
| `FRONTEND_ORIGIN` | Allowed CORS origin(s) for the frontend, comma-separated |
| `AUTO_MIGRATE` | When `true`, applies pending EF Core migrations automatically at startup |

Secrets are not committed to source control and must be supplied locally or
through the deployment environment.

## Running with Docker

A complete stack (PostgreSQL, API, frontend) can be started with Docker
Compose:

```
docker compose up --build
```

This builds and starts three services: `db` (PostgreSQL), `api` (the backend,
with a health check at `/health`), and `web` (the frontend, served through
Nginx). Configuration is supplied through environment variables; see
`docker-compose.yml` for the full list.

## Database Migrations

Migrations are managed with Entity Framework Core and live under
`PaddleThroughLychnidos.Infrastructure/Data/Migrations`. To add a new
migration:

```
dotnet ef migrations add <MigrationName> --project PaddleThroughLychnidos.Infrastructure --startup-project PaddleThroughLychnidos.API
```

## Deployment

The production deployment pipeline is defined in `.github/workflows/deploy.yml`
and targets a Docker-based host provisioned as described in
`deploy/ec2/README.md`. Container images are built and published, and the
deployment script applies them to the target host with database migrations
gated behind the `AUTO_MIGRATE` flag to avoid unattended migration runs.

## License

This project does not currently declare a license. All rights are reserved
by the project owner unless stated otherwise.
