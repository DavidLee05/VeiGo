# VeiGo

VeiGo is a Vietnamese marketplace for buying, selling, and renting used
motorcycles. This repository is a monorepo with a Next.js storefront and a
.NET 8 microservice backend.

## Repository layout

| Path | Responsibility |
|---|---|
| `frontend/` | Next.js storefront, deployed as a separate Vercel project |
| `backend/gateway/` | YARP API Gateway; local public API entry point |
| `backend/services/` | Nine independently deployable ASP.NET Core services |
| `backend/shared/VeiGo.ServiceDefaults/` | Shared process health endpoint conventions only |
| `infra/` | Local PostgreSQL and Docker Compose stack |

The nine service boundaries follow the project proposal: User, Catalog, Search,
Booking, Payment, Dealer, Inventory, Rental, and Notification. The system
diagram does not currently show this same set of boundaries; update the diagram
when its service breakdown is reconciled with the proposal. No additional
microservice is inferred from that discrepancy.

## Prerequisites

- Node.js 20.9 or later and npm
- .NET SDK 8.0.426 (pinned in `global.json`)
- Docker Desktop with Docker Compose

## Frontend

From the repository root:

```powershell
npm install
npm run dev
```

Open <http://localhost:3000>. To run its checks, use `npm run lint`,
`npm run typecheck`, and `npm run build`.

When configuring Vercel, set the project's Root Directory to `frontend`.

## Backend and local PostgreSQL

Create the local environment file once:

```powershell
Copy-Item .env.example .env
```

The example values are for local development only. Change them if the ports or
database are exposed beyond your machine; use managed secrets in hosted
environments.

Start PostgreSQL, the nine services, and the gateway:

```powershell
npm run compose:up
```

The first startup builds each backend container and creates one `veigo` database
with one login role and schema per service. Host ports bind to loopback only:

| Component | Local URL / port |
|---|---|
| API Gateway | <http://localhost:5100> |
| PostgreSQL | `localhost:5433` by default (`POSTGRES_HOST_PORT` in `.env`) |
| UserService | `localhost:5201` |
| CatalogService | `localhost:5202` |
| SearchService | `localhost:5203` |
| BookingService | `localhost:5204` |
| PaymentService | `localhost:5205` |
| DealerService | `localhost:5206` |
| InventoryService | `localhost:5207` |
| RentalService | `localhost:5208` |
| NotificationService | `localhost:5209` |

Each backend service exposes `/health/live` and `/health/ready`. The gateway
routes `/api/v1/users`, `/catalog`, `/search`, `/bookings`, `/payments`,
`/dealers`, `/inventory`, `/rentals`, and `/notifications` to the corresponding
service and removes the prefix before forwarding. For example:

```powershell
Invoke-RestMethod http://localhost:5100/api/v1/catalog/health/ready
```

After the containers finish starting, run the local smoke and schema isolation
checks:

```powershell
powershell.exe -NoProfile -ExecutionPolicy Bypass -File .\infra\scripts\smoke.ps1
powershell.exe -NoProfile -ExecutionPolicy Bypass -File .\infra\scripts\test-db-isolation.ps1
```

Stop the stack while keeping database data:

```powershell
npm run compose:down
```

PostgreSQL data is stored in the named `veigo-postgres-data` volume.

## Database ownership boundary

All services share the local PostgreSQL instance and database, but each owns
only its schema and login role: `user`, `catalog`, `search`, `booking`,
`payment`, `dealer`, `inventory`, `rental`, and `notification`. The initialization
script revokes public database/schema access and grants each service role
connection access plus ownership of its own schema. A service must use its own
role and must not query or modify another service's schema; cross-service data
access will be implemented through APIs or asynchronous events, not shared
tables.

The database connection strings are scaffold configuration only. No service
currently opens a database connection, creates tables, or performs migrations.
The health readiness endpoints therefore report process readiness, not database
readiness. The `veigo_admin` role is an initialization/admin role and must not
be used by application services.

## Build the backend without Docker

```powershell
dotnet restore backend/VeiGo.sln
dotnet build backend/VeiGo.sln --no-restore
```

## Current scope and deployment boundary

This is the Sprint 0 infrastructure foundation, not a production-ready
marketplace. The API routes currently reach health endpoints only; authentication,
authorization, business APIs, persistence, migrations, event messaging, and
production hosting configuration are not implemented. Do not expose this
unauthenticated gateway or the sample credentials to the public internet.

The frontend Vercel project and the backend Render services are deployed
independently. Hosted service definitions, production database provisioning,
secrets, authentication, and deployment health checks remain to be configured
before the backend can be deployed safely.
