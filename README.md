<p align="center">
  <img src="https://img.shields.io/badge/Partner-Travel%20Together.%20Explore%20Beyond.-1A3C5E?style=for-the-badge&labelColor=E8733A" alt="Partner App" />
</p>

<h1 align="center">Partner - Travel Together. Explore Beyond.</h1>

<p align="center">
  A next-generation travel companion platform with intelligent route planning, partner-matching, interactive maps, gamified achievements, real-time collaboration, and contextual discovery.
</p>

<p align="center">
  <img src="https://img.shields.io/badge/Next.js-14-black?logo=next.js" alt="Next.js 14" />
  <img src="https://img.shields.io/badge/NestJS-10-E0234E?logo=nestjs" alt="NestJS 10" />
  <img src="https://img.shields.io/badge/Flutter-3.11-02569B?logo=flutter" alt="Flutter" />
  <img src="https://img.shields.io/badge/PostgreSQL-16-4169E1?logo=postgresql&logoColor=white" alt="PostgreSQL" />
  <img src="https://img.shields.io/badge/Redis-7-DC382D?logo=redis&logoColor=white" alt="Redis" />
  <img src="https://img.shields.io/badge/Prisma-5-2D3748?logo=prisma" alt="Prisma" />
  <img src="https://img.shields.io/badge/TypeScript-5.5-3178C6?logo=typescript&logoColor=white" alt="TypeScript" />
  <img src="https://img.shields.io/badge/Socket.io-4.7-010101?logo=socket.io" alt="Socket.io" />
  <img src="https://img.shields.io/badge/Docker-Compose-2496ED?logo=docker&logoColor=white" alt="Docker" />
</p>

---

## Table of Contents

- [Overview](#overview)
- [Architecture](#architecture)
- [Features](#features)
- [Tech Stack](#tech-stack)
- [Getting Started](#getting-started)
- [Project Structure](#project-structure)
- [Database Schema](#database-schema)
- [API Documentation](#api-documentation)
- [WebSocket Events](#websocket-events)
- [Infrastructure Services](#infrastructure-services)
- [External APIs](#external-apis)
- [Environment Variables](#environment-variables)
- [Design System](#design-system)
- [Mobile App](#mobile-app)
- [Deployment](#deployment)
- [Contributing](#contributing)
- [License](#license)

---

## Overview

**Partner** is a full-stack travel companion platform built as a Turborepo monorepo. It enables travelers to plan trips, find travel partners, track routes in real-time, split expenses, discover local culture, and earn achievements — all from a single unified experience across web and mobile.

### Why Partner?

- **All-in-one travel toolkit** — No need for 10 different apps
- **Real-time collaboration** — Live location tracking, chat, and expense splitting
- **Gamified exploration** — Badges, XP, levels, digital passport stamps
- **Safety-first** — SOS alerts, travel advisories, embassy finder, safety scores
- **Offline-ready** — Downloadable maps, phrase books, and travel guides
- **Accessibility-focused** — Wheelchair routes, accessibility profiles, inclusive design

---

## Architecture

```
┌─────────────────────────────────────────────────────────────────┐
│                        Partner Monorepo                         │
├───────────────┬──────────────┬──────────────┬──────────────────┤
│  packages/web │ packages/api │packages/shared│ packages/mobile  │
│  Next.js 14   │  NestJS 10   │  TS Types    │  Flutter (Dart)  │
│  Port: 3000   │  Port: 4000  │  Library     │  iOS & Android   │
├───────────────┴──────────────┴──────────────┴──────────────────┤
│                    Infrastructure (Docker)                       │
│  ┌───────────┐ ┌───────┐ ┌───────┐ ┌────────────┐ ┌─────────┐ │
│  │PostgreSQL │ │ Redis │ │ MinIO │ │MeiliSearch │ │Libre    │ │
│  │+ PostGIS  │ │       │ │ (S3)  │ │(Search)    │ │Translate│ │
│  │:5432      │ │:6379  │ │:9000  │ │:7700       │ │:5500    │ │
│  └───────────┘ └───────┘ └───────┘ └────────────┘ └─────────┘ │
├─────────────────────────────────────────────────────────────────┤
│                     Public APIs (No Key)                         │
│  OSRM (Routing) · Frankfurter (Currency) · CartoDB (Map Tiles)  │
├─────────────────────────────────────────────────────────────────┤
│                  Optional APIs (Key Required)                    │
│  OpenWeatherMap · Google OAuth · Firebase FCM · Mapbox/MapTiler  │
└─────────────────────────────────────────────────────────────────┘
```

---

## Features

### Core Features
| Feature | Description | Status |
|---------|-------------|--------|
| **Trip Management** | Create, plan, and track multi-day trips with members | Done |
| **Interactive Maps** | 2D/3D MapLibre maps with live tracking | Done |
| **Route Planning** | Multi-mode routing (car, bike, foot, wheelchair) via OSRM | Done |
| **Partner Matching** | Find travel partners by destination, dates, interests | Done |
| **Real-time Chat** | Socket.io messaging with group & 1:1 rooms | Done |
| **Live Tracking** | WebSocket-based location sharing with geofence alerts | Done |
| **Expense Splitting** | Log, split (equal/custom/%), and settle trip expenses | Done |
| **Travel Notes** | Text, voice, photo, and plan notes with folders | Done |
| **Gamification** | Badges (5 families), XP, levels, streaks, passport stamps | Done |
| **Authentication** | JWT + refresh tokens, Google OAuth, role-based access | Done |

### Travel Tools
| Feature | Description | Status |
|---------|-------------|--------|
| **Currency Converter** | Real-time rates via Frankfurter API + budget tracker | Done |
| **Translator** | LibreTranslate integration (15 languages) + phrasebook | Done |
| **Weather** | Current weather, 5-day forecast, best time to visit | Done |
| **Packing Lists** | Smart packing checklist generator with templates | Done |
| **Travel Kit** | Visa, plug adapters, timezones, local laws — all-in-one | Done |
| **Carbon Tracker** | Trip carbon footprint calculation + offset suggestions | Done |
| **Vehicle Info** | Rental providers, types, price estimates | Done |

### Discovery & Culture
| Feature | Description | Status |
|---------|-------------|--------|
| **Food Discovery** | Local dishes, dietary profiles, water safety, restaurants | Done |
| **Cultural Guides** | Country culture cards, religious site etiquette | Done |
| **Local Events** | Festivals, concerts, sports events discovery | Done |
| **POI Search** | 15+ categories with MeiliSearch full-text search | Done |
| **Explore** | Destination discovery and browsing | Done |

### Health & Safety
| Feature | Description | Status |
|---------|-------------|--------|
| **SOS Alerts** | Emergency broadcast to contacts + nearby hospitals | Done |
| **Safety Scores** | General, solo female, LGBTQ+, nighttime safety ratings | Done |
| **Travel Advisories** | Country-level travel warnings | Done |
| **Health Records** | Vaccination tracking + travel insurance | Done |
| **Embassy Finder** | Locate embassies by country | Done |
| **Emergency Numbers** | Local emergency numbers worldwide | Done |

### Connectivity & Accessibility
| Feature | Description | Status |
|---------|-------------|--------|
| **WiFi Hotspots** | Community-submitted WiFi locations | Done |
| **SIM/eSIM Guide** | Carrier options by country | Done |
| **Accessibility** | Wheelchair routes, accessibility profiles | Done |
| **Offline Content** | Downloadable maps and guides | Done |
| **Traffic Rules** | Driving side, speed limits, license requirements | Done |

### New Integrations (Free Open-Source APIs)
| Feature | Description | API Source |
|---------|-------------|------------|
| **Live Weather** | Real-time weather + 7-day forecast, no API key needed | Open-Meteo |
| **Air Quality** | AQI, PM2.5, PM10, ozone monitoring worldwide | Open-Meteo Air Quality |
| **Country Explorer** | Flags, languages, currencies, borders for 250+ countries | RestCountries |
| **Public Holidays** | Holidays & long weekends for trip planning | Nager.Date |
| **Places Discovery** | Landmarks, hidden gems, free activities from OpenStreetMap | Overpass API |
| **Geocoding** | Place search & reverse geocoding | Nominatim/OSM |
| **Disaster Alerts** | Real-time earthquakes & natural disaster warnings | USGS Earthquake |
| **Travel Guides** | Community-written destination guides | WikiVoyage |

### AI Features
| Feature | Description | Status |
|---------|-------------|--------|
| **Trip Narratives** | AI-generated trip stories | Done |
| **Mood Routes** | Route suggestions based on mood/preference | Done |
| **Travel Tips** | Context-aware AI travel recommendations | Done |
| **Smart Recommendations** | See/do/eat/avoid for any country | Done |

---

## Tech Stack

### Frontend (Web)
| Technology | Purpose |
|-----------|---------|
| Next.js 14 (App Router) | React framework with SSR/SSG |
| Tailwind CSS 3.4 | Utility-first styling |
| shadcn/ui + Radix UI | Component library (50+ components) |
| MapLibre GL 4.1 | Interactive 2D/3D maps |
| Zustand 4.5 | Global state management |
| React Query 5.50 | Server state & data fetching |
| React Hook Form + Zod | Form management & validation |
| Framer Motion 11.3 | Animations |
| Recharts 2.12 | Data visualization |
| Socket.io Client | Real-time communication |
| Axios | HTTP client |
| Lucide React | Icon library |

### Backend (API)
| Technology | Purpose |
|-----------|---------|
| NestJS 10.4 | Node.js framework |
| Prisma 5.22 | ORM with 42 database models |
| PostgreSQL 16 + PostGIS | Database with geospatial support |
| Redis 7 | Cache, sessions, job queue |
| Socket.io 4.7 | WebSocket server |
| Bull 4.16 | Background job processing |
| Passport.js | JWT + OAuth authentication |
| Swagger/OpenAPI | API documentation |
| Class Validator | Request validation |
| MinIO | S3-compatible file storage |
| MeiliSearch | Full-text search engine |

### Mobile
| Technology | Purpose |
|-----------|---------|
| Flutter 3.11 (Dart) | Cross-platform mobile framework |
| Riverpod 2.5 | State management |
| GoRouter 14.0 | Navigation with deep linking |
| Dio + Retrofit | Type-safe HTTP client |
| Flutter Map 6.1 | Interactive maps |
| Hive 1.1 | Encrypted local storage |
| Geolocator 12.0 | Location services |
| FL Chart | Data visualization |
| Flutter Animate | Animations |

### Infrastructure
| Technology | Purpose |
|-----------|---------|
| Turborepo 2.3 | Monorepo build system |
| pnpm 9.15 | Package manager |
| Docker Compose | Local infrastructure |
| GitHub Actions | CI/CD pipelines |

---

## Getting Started

### Prerequisites

- **Node.js** >= 18
- **pnpm** >= 9.15 (`npm install -g pnpm`)
- **Docker** & Docker Compose
- **Flutter** >= 3.11 (for mobile development)

### Quick Start

```bash
# 1. Clone the repository
git clone https://github.com/HemanthKumar52/Comrade.git
cd Comrade

# 2. Install dependencies
pnpm install

# 3. Start infrastructure services
docker compose up -d

# 4. Set up the database
pnpm db:generate
pnpm db:push
pnpm db:seed

# 5. Create environment files (see Environment Variables section)
cp packages/api/.env.example packages/api/.env
cp packages/web/.env.example packages/web/.env.local

# 6. Start development servers
pnpm dev
```

The web app will be available at `http://localhost:3000` and the API at `http://localhost:4000`.

### Key Commands

| Command | Description |
|---------|-------------|
| `pnpm dev` | Start all packages in development mode |
| `pnpm build` | Build all packages for production |
| `pnpm lint` | Run linting across all packages |
| `pnpm db:generate` | Generate Prisma client |
| `pnpm db:push` | Push schema changes to database |
| `pnpm db:seed` | Seed database with sample data |
| `pnpm db:studio` | Open Prisma Studio (database GUI) |
| `docker compose up -d` | Start infrastructure services |
| `docker compose down` | Stop infrastructure services |

---

## Project Structure

```
partner-app/
├── packages/
│   ├── api/                        # NestJS Backend
│   │   ├── src/
│   │   │   ├── auth/               # JWT + Google OAuth
│   │   │   ├── users/              # User profiles & management
│   │   │   ├── trips/              # Trip CRUD & carbon tracking
│   │   │   ├── routes/             # Route calculation (OSRM)
│   │   │   ├── notes/              # Text/voice/photo/plan notes
│   │   │   ├── badges/             # Gamification with Bull queue
│   │   │   ├── chat/               # Real-time messaging
│   │   │   ├── tracking/           # Live location tracking
│   │   │   ├── poi/                # Points of Interest (15+ categories)
│   │   │   ├── partners/           # Partner matching & requests
│   │   │   ├── expenses/           # Expense tracking & splits
│   │   │   ├── currency/           # Currency conversion
│   │   │   ├── translator/         # LibreTranslate integration
│   │   │   ├── food/               # Local dishes & dietary profiles
│   │   │   ├── cultural/           # Culture cards & etiquette
│   │   │   ├── events/             # Local events discovery
│   │   │   ├── emergency/          # SOS, advisories, embassies
│   │   │   ├── health/             # Vaccinations & insurance
│   │   │   ├── accessibility/      # Wheelchair routes
│   │   │   ├── connectivity/       # WiFi hotspots & SIM info
│   │   │   ├── packing/            # Packing checklists
│   │   │   ├── passport/           # Digital passport stamps
│   │   │   ├── weather/            # Weather data
│   │   │   ├── vehicles/           # Vehicle rentals
│   │   │   ├── ai/                 # AI/ML features
│   │   │   ├── traffic/            # Traffic & safety rules
│   │   │   ├── travel-phrases/     # Phrasebook
│   │   │   ├── travel-stats/       # Analytics
│   │   │   ├── carbon/             # Carbon footprint
│   │   │   ├── safety-score/       # Safety scoring
│   │   │   ├── travel-kit/         # Travel utilities
│   │   │   ├── notifications/      # Push notifications
│   │   │   ├── common/             # Guards, interceptors, pipes
│   │   │   ├── prisma/             # ORM service
│   │   │   └── data/               # Static data files
│   │   └── prisma/
│   │       ├── schema.prisma       # 42 database models
│   │       └── seed.ts             # Database seeding
│   │
│   ├── web/                        # Next.js 14 Frontend
│   │   └── src/
│   │       ├── app/                # App Router pages (39 routes)
│   │       │   ├── (auth)/         # Login, Register, Forgot Password
│   │       │   └── (dashboard)/    # All authenticated routes
│   │       ├── components/         # 50+ reusable UI components
│   │       │   ├── ui/             # shadcn/ui base components
│   │       │   ├── layout/         # Header, Sidebar, Footer
│   │       │   ├── dashboard/      # Dashboard widgets
│   │       │   ├── maps/           # Map components
│   │       │   ├── trips/          # Trip components
│   │       │   └── ...             # Feature-specific components
│   │       ├── hooks/              # Custom React hooks
│   │       ├── lib/                # Utilities (auth, API client)
│   │       └── stores/             # Zustand state stores
│   │
│   ├── shared/                     # Shared TypeScript Types
│   │   └── src/
│   │       ├── types/              # 15 type definition files
│   │       ├── constants/          # Shared constants
│   │       └── index.ts            # Barrel exports
│   │
│   └── mobile/                     # Flutter App
│       └── lib/
│           ├── core/               # Network, router, storage, theme
│           ├── features/           # 25+ feature modules
│           ├── shared/             # Shared widgets
│           └── app.dart            # App entry point
│
├── .github/                        # GitHub Actions CI/CD
├── docker-compose.yml              # Infrastructure setup
├── turbo.json                      # Turborepo configuration
├── pnpm-workspace.yaml             # Workspace config
└── package.json                    # Root scripts
```

---

## Database Schema

The database uses **PostgreSQL 16 with PostGIS** for geospatial queries, managed through **Prisma ORM** with **42 models**:

### Core Models
- **User** — Profiles, verification, levels, XP, travel stats
- **Trip** — Travel plans with status, vehicle type, carbon tracking
- **TripMember** — Multi-user trip participation with roles
- **RouteLog** — GPS coordinates, altitude, speed data

### Social & Communication
- **PartnerRequest** — Partner matching system
- **Review** — Post-trip user ratings
- **ChatRoom / ChatRoomMember / ChatMessage** — Real-time encrypted messaging

### Gamification
- **Badge / UserBadge** — 5 badge families (distance, place, vehicle, social, nature)
- **TripPassportStamp** — Digital passport stamp collection

### Travel Tools
- **Note / NoteFolder** — Organized travel notes
- **Expense / ExpenseSplit** — Expense tracking with multi-person splits
- **TripBudget / BudgetCategory** — Budget management
- **Currency / ExchangeRate** — Currency data caching

### Discovery
- **POI / POIRating** — Points of Interest with 15+ categories
- **LocalDish / DietaryProfile** — Food discovery
- **CultureCard / ReligiousSiteEtiquette** — Cultural guides
- **LiveEvent** — Festivals, concerts, sports events

### Safety & Health
- **EmergencyContact / SOSAlert** — Emergency system
- **TravelAdvisory / Embassy / MedicalFacility** — Travel safety
- **Vaccination / TravelInsurance** — Health records

### Connectivity
- **WifiHotspot / SIMOption** — Internet access
- **OfflineContent** — Downloadable content
- **AccessibilityProfile** — Accessibility needs
- **LanguagePack / Phrase** — Language resources
- **Geofence** — Trip boundary alerts
- **Notification** — Push notification history

---

## API Documentation

**Base URL:** `http://localhost:4000/api/v1`

**Interactive Docs:** `http://localhost:4000/api/docs` (Swagger UI)

### Endpoint Groups (130+ endpoints)

| Module | Prefix | Key Operations |
|--------|--------|----------------|
| **Auth** | `/auth` | Register, login, refresh token, Google OAuth |
| **Users** | `/users` | Profile CRUD, dashboard data, stats |
| **Trips** | `/trips` | CRUD, start/end trip, manage members |
| **Routes** | `/routes` | Calculate routes, alternatives, save logs |
| **Notes** | `/notes` | CRUD with folders, filter by type/trip |
| **Chat** | `/chat` | Room management, message history |
| **Badges** | `/badges` | List badges, check unlocks |
| **POI** | `/poi` | Search, filter by category/location |
| **Partners** | `/partners` | Search, request, accept/decline, review |
| **Expenses** | `/expenses` | Log, split, settle, financial reports |
| **Currency** | `/currency` | Rates, convert, budget management |
| **Translator** | `/translator` | Translate, detect language, phrasebook |
| **Emergency** | `/emergency` | SOS, contacts, embassies, hospitals |
| **Safety Score** | `/safety-score` | Country/city scores, solo/LGBTQ+/night |
| **Health** | `/health` | Vaccinations, insurance, pharmacies |
| **Food** | `/food` | Dishes, water safety, dietary profiles |
| **Cultural** | `/cultural` | Culture guides, etiquette |
| **Events** | `/events` | Festivals, concerts, sun times |
| **Weather** | `/weather` | Current, forecast, alerts, climate |
| **Accessibility** | `/accessibility` | Profiles, accessible POIs/routes |
| **Connectivity** | `/connectivity` | WiFi, SIM/eSIM, offline content |
| **Packing** | `/packing` | Generate lists, templates, itinerary |
| **Passport** | `/passport` | Stamps collection, auto-generate |
| **Carbon** | `/carbon` | Footprint, compare, offset, leaderboard |
| **Traffic** | `/traffic` | Rules, driving side, speed limits, fines |
| **Vehicles** | `/vehicles` | Providers, types, price estimates |
| **Phrases** | `/phrases` | Essential phrases by language/country |
| **Stats** | `/stats` | Overview, heatmap, timeline, annual wrapped |
| **Travel Kit** | `/travel-kit` | Visa, plugs, timezone, laws, jet lag |
| **AI** | `/ai` | Trip narratives, mood routes, tips |
| **Notifications** | `/notifications` | List, mark read, unread count |
| **Country Info** | `/country-info` | Country details, compare (RestCountries) |
| **Holidays** | `/holidays` | Public holidays, long weekends (Nager.Date) |
| **Places Discovery** | `/places-discovery` | Nearby POIs, landmarks (OpenStreetMap) |
| **Disaster Alerts** | `/disaster-alerts` | Earthquakes, natural disasters (USGS) |
| **Geocoding** | `/geocoding` | Search places, reverse geocoding (Nominatim) |
| **Travel Guides** | `/travel-guides` | Destination guides (WikiVoyage) |

---

## WebSocket Events

### Location Tracking (`ws://localhost:4000/tracking`)

| Direction | Event | Description |
|-----------|-------|-------------|
| Client -> Server | `join-trip` | Join trip tracking room |
| Client -> Server | `update-location` | Send GPS coordinates |
| Client -> Server | `sos-alert` | Trigger emergency broadcast |
| Server -> Client | `location-updated` | Member location update |
| Server -> Client | `geofence-entered` | Boundary alert |
| Server -> Client | `sos-alert` | Emergency notification |

### Real-time Chat (`ws://localhost:4000/chat`)

| Direction | Event | Description |
|-----------|-------|-------------|
| Client -> Server | `join-room` | Join chat room |
| Client -> Server | `send-message` | Send message |
| Client -> Server | `typing` | Typing indicator |
| Server -> Client | `new-message` | Message broadcast |
| Server -> Client | `user-typing` | Typing notification |

---

## Infrastructure Services

All services run locally via Docker Compose:

| Service | Image | Port | Purpose |
|---------|-------|------|---------|
| **PostgreSQL** | `postgis/postgis:16-3.4` | 5432 | Database with geospatial support |
| **Redis** | `redis:7-alpine` | 6379 | Cache, job queue, sessions |
| **MinIO** | `minio/minio` | 9000 / 9001 | S3-compatible file storage |
| **MeiliSearch** | `getmeili/meilisearch:v1.6` | 7700 | Full-text search engine |
| **LibreTranslate** | `libretranslate/libretranslate` | 5500 | Translation service (15 languages) |

```bash
# Start all services
docker compose up -d

# Stop all services
docker compose down

# View logs
docker compose logs -f
```

---

## External APIs

### Required (Free, No API Key)

| API | Purpose | URL |
|-----|---------|-----|
| **OSRM** | Route calculation & directions | `router.project-osrm.org` |
| **Frankfurter** | Currency exchange rates | `api.frankfurter.app` |
| **CartoDB** | Map tile basemaps | `basemaps.cartocdn.com` |
| **Open-Meteo** | Weather, forecasts, air quality | `api.open-meteo.com` |
| **RestCountries** | Country data (flags, languages, etc.) | `restcountries.com` |
| **Nager.Date** | Public holidays & long weekends | `date.nager.at` |
| **Overpass/OSM** | POI discovery from OpenStreetMap | `overpass-api.de` |
| **Nominatim** | Geocoding & place search | `nominatim.openstreetmap.org` |
| **USGS Earthquake** | Real-time earthquake data | `earthquake.usgs.gov` |
| **WikiVoyage** | Community travel guides | `en.wikivoyage.org` |

### Optional (API Key Required)

| API | Purpose | Free Tier |
|-----|---------|-----------|
| **OpenWeatherMap** | Live weather & forecasts | 60 calls/min |
| **Google OAuth** | Social login | Unlimited |
| **Firebase FCM** | Push notifications | Unlimited |
| **Mapbox** | Premium map tiles | 50k loads/month |
| **MapTiler** | Premium map tiles | 100k tiles/month |

---

## Environment Variables

### Backend (`packages/api/.env`)

```env
# Database
DATABASE_URL=postgresql://partner:partner_dev_2025@localhost:5432/partner

# Redis
REDIS_HOST=localhost
REDIS_PORT=6379

# Server
PORT=4000
CORS_ORIGINS=http://localhost:3000

# JWT (CHANGE IN PRODUCTION)
JWT_SECRET=partner-jwt-secret-change-in-production
JWT_REFRESH_SECRET=partner-jwt-refresh-secret-change-in-production
JWT_EXPIRATION=15m
JWT_REFRESH_EXPIRATION=30d

# File Storage (MinIO)
MINIO_ENDPOINT=localhost
MINIO_PORT=9000
MINIO_ACCESS_KEY=partner_minio
MINIO_SECRET_KEY=partner_minio_2025
MINIO_BUCKET=partner-uploads

# Search (MeiliSearch)
MEILI_HOST=http://localhost:7700
MEILI_API_KEY=partner_meili_key_2025

# Translation
LIBRE_TRANSLATE_URL=http://localhost:5500

# Routing
OSRM_URL=https://router.project-osrm.org

# Currency
FRANKFURTER_URL=https://api.frankfurter.app

# Weather (Optional)
OPENWEATHERMAP_API_KEY=

# Google OAuth (Optional)
GOOGLE_CLIENT_ID=
GOOGLE_CLIENT_SECRET=
GOOGLE_CALLBACK_URL=http://localhost:4000/api/v1/auth/google/callback

# Push Notifications (Optional)
FCM_SERVER_KEY=
```

### Frontend (`packages/web/.env.local`)

```env
NEXT_PUBLIC_API_URL=http://localhost:4000/api/v1
NEXT_PUBLIC_WS_URL=http://localhost:4000
NEXT_PUBLIC_APP_NAME=Partner
NEXT_PUBLIC_APP_DESCRIPTION=Travel Together. Explore Beyond.

# Map Providers (Optional - CartoDB is default)
NEXT_PUBLIC_MAPBOX_TOKEN=
NEXT_PUBLIC_MAPTILER_KEY=
```

---

## Design System

| Element | Value |
|---------|-------|
| **Primary Color** | `#1A3C5E` (Deep Navy) |
| **Accent Color** | `#E8733A` (Ember Orange) |
| **Headline Font** | Inter |
| **Body Font** | DM Sans |
| **Web Icons** | Lucide React |
| **Mobile Icons** | Phosphor Icons |
| **Web UI** | Tailwind CSS + shadcn/ui + Radix UI |
| **Mobile UI** | Material Design 3 |

---

## Mobile App

The Flutter mobile app mirrors all web features with native performance:

- **State Management:** Riverpod (functional reactive)
- **Navigation:** GoRouter with deep linking
- **Local Storage:** Hive (encrypted) + SharedPreferences
- **Networking:** Dio + Retrofit (type-safe HTTP)
- **Maps:** Flutter Map with Geolocator
- **Real-time:** Socket.io Client
- **Media:** Camera, audio recording, file picker

### Running the Mobile App

```bash
cd packages/mobile

# Get dependencies
flutter pub get

# Run on connected device
flutter run

# Build for production
flutter build apk          # Android
flutter build ios           # iOS
```

---

## Deployment

### Production Checklist

- [ ] Change `JWT_SECRET` and `JWT_REFRESH_SECRET` to strong random values
- [ ] Change all default passwords (PostgreSQL, MinIO, MeiliSearch)
- [ ] Set `CORS_ORIGINS` to production domain
- [ ] Configure SSL/TLS certificates
- [ ] Set up database backups
- [ ] Configure rate limiting for public endpoints
- [ ] Get API keys for optional services (weather, OAuth, FCM)
- [ ] Consider self-hosting OSRM for reliable routing
- [ ] Use managed services (AWS RDS, ElastiCache, S3) instead of Docker
- [ ] Set up monitoring and alerting

---

## Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

---

## License

This project is private and proprietary.

---

<p align="center">
  Built with passion for travelers, by travelers.
  <br/>
  <strong>Partner — Travel Together. Explore Beyond.</strong>
</p>
