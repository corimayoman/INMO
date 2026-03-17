# WorldPropertyFinder

A production-ready global real estate platform built with Next.js, NestJS, PostgreSQL, Elasticsearch, and Redis.

## Tech Stack

- **Frontend**: Next.js 14 + React + TypeScript + Tailwind CSS
- **Backend**: NestJS (Node.js) REST API
- **Database**: PostgreSQL with Prisma ORM
- **Search**: Elasticsearch / OpenSearch
- **Cache**: Redis
- **Storage**: S3-compatible (AWS S3 / MinIO)
- **Auth**: JWT + OAuth2 (Google, Apple, Microsoft)
- **Maps**: Mapbox GL JS
- **Queue**: Bull (Redis-backed)
- **Containerization**: Docker + Docker Compose

## Project Structure

```
worldpropertyfinder/
├── apps/
│   ├── web/          # Next.js frontend
│   └── api/          # NestJS backend
├── packages/
│   ├── shared/       # Shared types, schemas, utils
│   └── connectors/   # Country/source ingestion connectors
├── infra/
│   ├── docker/
│   └── nginx/
├── prisma/           # Database schema & migrations
├── docker-compose.yml
└── .env.example
```

## Quick Start

### Prerequisites
- Node.js 20+
- Docker & Docker Compose
- pnpm (recommended)

### 1. Clone and install
```bash
git clone <repo>
cd worldpropertyfinder
pnpm install
```

### 2. Configure environment
```bash
cp .env.example .env
# Edit .env with your credentials
```

### 3. Start infrastructure
```bash
docker-compose up -d postgres redis elasticsearch minio
```

### 4. Run database migrations
```bash
pnpm --filter api prisma migrate dev
pnpm --filter api prisma db seed
```

### 5. Start development servers
```bash
pnpm dev
```

Frontend: http://localhost:3000  
API: http://localhost:4000  
API Docs: http://localhost:4000/api/docs

## Environment Variables

See `.env.example` for all required variables.

## Key Features

- Global property search (buy, rent, commercial, land, new developments)
- AI-powered natural language search
- Interactive map search with polygon drawing
- Multi-language (i18n) and multi-currency support
- Agent/agency dashboard with CRM-lite
- Admin panel with moderation tools
- Pluggable ingestion framework with country connectors
- Saved searches with email/push alerts
- Property comparison
- Mortgage calculator
- Virtual tour support
- SEO-optimized pages

## Ingestion Connectors

Sample connectors included:
- `SpainConnector` (Idealista-style XML feed)
- `UKConnector` (Rightmove-style API)
- `USConnector` (RETS/RESO Web API)
- `GenericXMLConnector` (reusable base)
- `GenericJSONConnector` (reusable base)

## Production Deployment

See `infra/` for Docker and Nginx configs.

Recommended cloud: AWS / GCP / Azure with:
- RDS PostgreSQL
- ElastiCache Redis
- OpenSearch Service
- S3 for media
- CloudFront CDN
- ECS/EKS or App Runner

## Assumptions & Notes

1. Real MLS/API credentials must be obtained per country/source
2. AI features require OpenAI API key (or compatible)
3. Maps require Mapbox or Google Maps API key
4. SMS alerts require Twilio or similar
5. Payment processing requires Stripe
6. robots.txt and ToS compliance is enforced at connector level
7. GDPR consent flows are included but legal review recommended per jurisdiction
