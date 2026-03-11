# Partner - Travel Together. Explore Beyond.

## Project Overview
Partner is a next-generation travel companion app with intelligent route planning,
partner-matching, 3D/2D maps, gamified achievements, and contextual discovery.

## Architecture
- Turborepo monorepo with pnpm
- packages/web - Next.js 14 (App Router), Tailwind CSS, shadcn/ui, MapLibre
- packages/api - NestJS, Prisma, PostgreSQL, Redis, Socket.io
- packages/shared - Shared TypeScript types and constants
- packages/mobile - Flutter (Dart) for iOS/Android

## Quick Start
```bash
pnpm install
docker compose up -d
pnpm db:generate
pnpm db:push
pnpm db:seed
pnpm dev
```

## Key Commands
- `pnpm dev` - Start all packages in dev mode
- `pnpm build` - Build all packages
- `pnpm db:studio` - Open Prisma Studio
- `docker compose up -d` - Start infrastructure services

## API
- Base URL: http://localhost:4000/api/v1
- Swagger: http://localhost:4000/api/docs
- WebSocket: ws://localhost:4000/tracking, ws://localhost:4000/chat

## Design System
- Primary: #1A3C5E (Deep Navy)
- Accent: #E8733A (Ember Orange)
- Fonts: Inter (headlines), DM Sans (body)
- Icons: Phosphor Icons (lucide-react on web)

## Database
- PostgreSQL with PostGIS
- Prisma ORM
- Schema at packages/api/prisma/schema.prisma

## Feature Modules (API)
auth, users, trips, routes, notes, badges, poi, partners, tracking, chat,
notifications, translator, currency, emergency, food, cultural, events,
accessibility, expenses, connectivity, packing, travel-kit, health, passport
