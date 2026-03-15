# Partner App - API & Service Requirements Document

> All external APIs, services, keys, and infrastructure needed to run the Partner application.

---

## Quick Reference

| # | Service | Required? | Needs API Key? | Free Tier? |
|---|---------|-----------|----------------|------------|
| 1 | PostgreSQL + PostGIS | **Required** | No (self-hosted) | Yes (Docker) |
| 2 | Redis | **Required** | No (self-hosted) | Yes (Docker) |
| 3 | MinIO (S3 Storage) | **Required** | No (self-hosted) | Yes (Docker) |
| 4 | MeiliSearch | **Required** | No (self-hosted) | Yes (Docker) |
| 5 | LibreTranslate | **Required** | No (self-hosted) | Yes (Docker) |
| 6 | OSRM | **Required** | No | Yes (Public) |
| 7 | Frankfurter API | **Required** | No | Yes (Public) |
| 8 | CartoDB Basemaps | **Required** | No | Yes (Public) |
| 9 | **Open-Meteo** | **Required** | **No** | **Yes (Unlimited)** |
| 10 | **RestCountries** | **Required** | **No** | **Yes (Unlimited)** |
| 11 | **Nager.Date** | **Required** | **No** | **Yes (Unlimited)** |
| 12 | **Overpass/OSM** | **Required** | **No** | **Yes (Fair use)** |
| 13 | **Nominatim** | **Required** | **No** | **Yes (1 req/sec)** |
| 14 | **USGS Earthquake** | **Required** | **No** | **Yes (Unlimited)** |
| 15 | **WikiVoyage** | **Required** | **No** | **Yes (Unlimited)** |
| 16 | OpenWeatherMap | Optional | **Yes** | Yes (60 calls/min) |
| 17 | Google OAuth | Optional | **Yes** | Yes |
| 18 | Firebase FCM | Optional | **Yes** | Yes |
| 19 | Mapbox | Optional | **Yes** | Yes (50k loads/mo) |
| 20 | MapTiler | Optional | **Yes** | Yes (100k tiles/mo) |

---

## 1. Infrastructure Services (Docker)

These run locally via `docker compose up -d`.

### 1.1 PostgreSQL + PostGIS
- **Purpose:** Primary database with geospatial support
- **Image:** `postgis/postgis:16-3.4`
- **Port:** `5432`
- **Used By:** All modules (user data, trips, notes, badges, etc.)
- **Env Vars:**
  ```
  DATABASE_URL=postgresql://partner:partner_dev_2025@localhost:5432/partner
  ```

### 1.2 Redis
- **Purpose:** Cache, session store, Bull job queue backend
- **Image:** `redis:7-alpine`
- **Port:** `6379`
- **Used By:** Badge processor, rate limiting, caching
- **Env Vars:**
  ```
  REDIS_HOST=localhost
  REDIS_PORT=6379
  ```

### 1.3 MinIO (S3-Compatible Storage)
- **Purpose:** File/media uploads (photos, voice notes, avatars)
- **Image:** `minio/minio`
- **Ports:** `9000` (API), `9001` (Admin Console)
- **Used By:** Notes (voice/photo), user avatars, trip media
- **Env Vars:**
  ```
  MINIO_ENDPOINT=localhost
  MINIO_PORT=9000
  MINIO_ACCESS_KEY=partner_minio
  MINIO_SECRET_KEY=partner_minio_2025
  MINIO_BUCKET=partner-uploads
  ```

### 1.4 MeiliSearch
- **Purpose:** Full-text search engine (POIs, destinations, partners)
- **Image:** `getmeili/meilisearch:v1.6`
- **Port:** `7700`
- **Used By:** POI search, destination search, partner search
- **Env Vars:**
  ```
  MEILI_HOST=http://localhost:7700
  MEILI_API_KEY=partner_meili_key_2025
  ```

### 1.5 LibreTranslate
- **Purpose:** Open-source text translation & language detection
- **Image:** `libretranslate/libretranslate`
- **Port:** `5500`
- **Used By:** Translator module
- **Supported Languages:** en, hi, ta, te, kn, fr, es, de, ja, zh, ar, ru, pt, ko, th
- **Env Vars:**
  ```
  LIBRE_TRANSLATE_URL=http://localhost:5500
  ```

---

## 2. Public APIs (No Key Required)

### 2.1 OSRM (Open Source Routing Machine)
- **Purpose:** Route calculation, turn-by-turn directions, alternative routes
- **URL:** `https://router.project-osrm.org`
- **Used By:** Routes module, Accessibility module
- **Endpoints Used:**
  - `/route/v1/car/{coordinates}` - Driving routes
  - `/route/v1/foot/{coordinates}` - Walking routes
  - `/route/v1/bike/{coordinates}` - Cycling routes
  - `/route/v1/wheelchair/{coordinates}` - Wheelchair routes
- **Rate Limit:** Fair use (public demo server)
- **Self-Host Option:** Can run own OSRM instance for production
- **Env Vars:**
  ```
  OSRM_URL=https://router.project-osrm.org
  ```
- **Note:** For production, self-host OSRM with regional map data for reliability.

### 2.2 Frankfurter API
- **Purpose:** Real-time & historical currency exchange rates
- **URL:** `https://api.frankfurter.app`
- **Used By:** Currency module
- **Endpoints Used:**
  - `/latest?from=USD&to=INR` - Current rates
  - `/{date1}..{date2}?from=USD&to=INR` - Historical rates
- **Rate Limit:** Unlimited (open source)
- **Cache:** App caches rates for 30 minutes
- **Env Vars:**
  ```
  FRANKFURTER_URL=https://api.frankfurter.app
  ```

### 2.3 CartoDB Basemaps
- **Purpose:** Map tile rendering (MapLibre GL base layer)
- **URLs:**
  - Light: `https://basemaps.cartocdn.com/gl/voyager-gl-style/style.json`
  - Dark: `https://basemaps.cartocdn.com/gl/dark-matter-gl-style/style.json`
- **Used By:** Web map component
- **Rate Limit:** Fair use
- **No configuration needed** - hardcoded in map component

---

## 2.5 New Free APIs (No Key Required)

### 2.4 Open-Meteo (Weather & Air Quality)
- **Purpose:** Real-time weather, forecasts, and air quality data
- **URL:** `https://api.open-meteo.com/v1/forecast`
- **Air Quality:** `https://air-quality-api.open-meteo.com/v1/air-quality`
- **Used By:** Weather module, Air Quality page
- **Rate Limit:** Unlimited (open-source, self-hostable)
- **Replaces:** OpenWeatherMap (now optional)
- **Features:** Current weather, 7-day forecast, AQI, PM2.5, PM10, ozone, UV index
- **No configuration needed** — works out of the box

### 2.5 RestCountries API
- **Purpose:** Comprehensive country data (flags, languages, currencies, borders)
- **URL:** `https://restcountries.com/v3.1/`
- **Used By:** Country Info module
- **Rate Limit:** Unlimited
- **Endpoints:**
  - `/alpha/{code}` — Country by code
  - `/name/{name}` — Search by name
  - `/region/{region}` — Countries by region
- **No configuration needed**

### 2.6 Nager.Date (Public Holidays)
- **Purpose:** Public holidays, long weekends by country
- **URL:** `https://date.nager.at/api/v3/`
- **Used By:** Holidays module, Trip Planning
- **Rate Limit:** Unlimited
- **Endpoints:**
  - `/PublicHolidays/{year}/{countryCode}` — Yearly holidays
  - `/NextPublicHolidays/{countryCode}` — Upcoming holidays
  - `/LongWeekend/{year}/{countryCode}` — Long weekends
- **No configuration needed**

### 2.7 Overpass API (OpenStreetMap Places)
- **Purpose:** Discover POIs, landmarks, hidden gems from OpenStreetMap
- **URL:** `https://overpass-api.de/api/interpreter`
- **Used By:** Places Discovery module
- **Rate Limit:** Fair use (~10,000 requests/day)
- **Self-Host Option:** Can run own Overpass instance
- **No configuration needed**

### 2.8 Nominatim (Geocoding)
- **Purpose:** Forward/reverse geocoding, place search
- **URL:** `https://nominatim.openstreetmap.org/`
- **Used By:** Geocoding module, Search bars
- **Rate Limit:** 1 request/second (fair use)
- **Important:** Requires User-Agent header
- **Self-Host Option:** Can run own Nominatim instance
- **No configuration needed**

### 2.9 USGS Earthquake API
- **Purpose:** Real-time earthquake and seismic data worldwide
- **URL:** `https://earthquake.usgs.gov/fdsnws/event/1/query`
- **Used By:** Disaster Alerts module
- **Rate Limit:** Unlimited
- **Features:** Magnitude, location, depth, tsunami warnings
- **No configuration needed**

### 2.10 WikiVoyage API
- **Purpose:** Community-written travel guides for destinations worldwide
- **URL:** `https://en.wikivoyage.org/w/api.php`
- **Used By:** Travel Guides module
- **Rate Limit:** Unlimited
- **Features:** Full destination guides with sections (See, Do, Eat, Sleep, etc.)
- **No configuration needed**

---

## 3. External APIs (Key Required)

### 3.1 OpenWeatherMap API
- **Purpose:** Current weather, 5-day forecasts, weather alerts
- **Status:** Optional (falls back to static climate data)
- **Sign Up:** https://openweathermap.org/api
- **Free Tier:** 60 calls/minute, 1,000,000 calls/month
- **Endpoints Used:**
  - `https://api.openweathermap.org/data/2.5/weather` - Current weather
  - `https://api.openweathermap.org/data/2.5/forecast` - 5-day forecast
  - `https://api.openweathermap.org/data/2.5/onecall` - Alerts (requires paid plan)
- **Cache:** App caches weather for 15 minutes
- **Env Vars:**
  ```
  OPENWEATHERMAP_API_KEY=your_api_key_here
  ```
- **Features Affected Without Key:**
  - `/weather/current` - No live weather
  - `/weather/forecast` - No forecasts
  - `/weather/alerts` - No alerts
  - `/weather/best-time/:country` and `/weather/climate/:country` still work (static data)

### 3.2 Google OAuth 2.0
- **Purpose:** Social login ("Sign in with Google")
- **Status:** Optional (email/password auth always available)
- **Sign Up:** https://console.cloud.google.com/apis/credentials
- **Setup Steps:**
  1. Create a Google Cloud project
  2. Enable "Google+ API" or "People API"
  3. Create OAuth 2.0 Client ID (Web application)
  4. Add authorized redirect URI: `http://localhost:4000/api/v1/auth/google/callback`
- **Free Tier:** Unlimited (no per-request charges)
- **Env Vars:**
  ```
  GOOGLE_CLIENT_ID=your_client_id.apps.googleusercontent.com
  GOOGLE_CLIENT_SECRET=your_client_secret
  GOOGLE_CALLBACK_URL=http://localhost:4000/api/v1/auth/google/callback
  ```

### 3.3 Firebase Cloud Messaging (FCM)
- **Purpose:** Push notifications to mobile devices
- **Status:** Optional (in-app notifications still work)
- **Sign Up:** https://console.firebase.google.com
- **Setup Steps:**
  1. Create Firebase project
  2. Go to Project Settings > Cloud Messaging
  3. Copy Server Key
- **Free Tier:** Unlimited push notifications
- **Env Vars:**
  ```
  FCM_SERVER_KEY=your_server_key_here
  ```

### 3.4 Mapbox GL (Alternative Map Provider)
- **Purpose:** Premium map tiles (alternative to CartoDB)
- **Status:** Optional (CartoDB is default and free)
- **Sign Up:** https://www.mapbox.com/
- **Free Tier:** 50,000 map loads/month
- **Env Vars:**
  ```
  NEXT_PUBLIC_MAPBOX_TOKEN=your_mapbox_token
  ```

### 3.5 MapTiler (Alternative Map Provider)
- **Purpose:** Premium map tiles (alternative to CartoDB)
- **Status:** Optional (CartoDB is default and free)
- **Sign Up:** https://www.maptiler.com/
- **Free Tier:** 100,000 tile requests/month
- **Env Vars:**
  ```
  NEXT_PUBLIC_MAPTILER_KEY=your_maptiler_key
  ```

---

## 4. Internal Configuration

### 4.1 JWT Authentication
- **Purpose:** Token-based auth for API requests
- **IMPORTANT:** Change secrets in production!
- **Env Vars:**
  ```
  JWT_SECRET=partner-jwt-secret-change-in-production
  JWT_REFRESH_SECRET=partner-jwt-refresh-secret-change-in-production
  JWT_EXPIRATION=15m
  JWT_REFRESH_EXPIRATION=30d
  ```

### 4.2 Server Configuration
- **Env Vars:**
  ```
  PORT=4000
  CORS_ORIGINS=http://localhost:3000
  ```

### 4.3 Frontend Configuration
- **Env Vars:**
  ```
  NEXT_PUBLIC_API_URL=http://localhost:4000/api/v1
  NEXT_PUBLIC_WS_URL=http://localhost:4000
  NEXT_PUBLIC_APP_NAME=Partner
  NEXT_PUBLIC_APP_DESCRIPTION=Travel Together. Explore Beyond.
  ```

---

## 5. Complete .env Templates

### Backend (`packages/api/.env`)
```env
# ── Database ──
DATABASE_URL=postgresql://partner:partner_dev_2025@localhost:5432/partner

# ── Redis ──
REDIS_HOST=localhost
REDIS_PORT=6379

# ── Server ──
PORT=4000
CORS_ORIGINS=http://localhost:3000

# ── JWT (CHANGE IN PRODUCTION) ──
JWT_SECRET=partner-jwt-secret-change-in-production
JWT_REFRESH_SECRET=partner-jwt-refresh-secret-change-in-production
JWT_EXPIRATION=15m
JWT_REFRESH_EXPIRATION=30d

# ── File Storage (MinIO) ──
MINIO_ENDPOINT=localhost
MINIO_PORT=9000
MINIO_ACCESS_KEY=partner_minio
MINIO_SECRET_KEY=partner_minio_2025
MINIO_BUCKET=partner-uploads

# ── Search (MeiliSearch) ──
MEILI_HOST=http://localhost:7700
MEILI_API_KEY=partner_meili_key_2025

# ── Translation ──
LIBRE_TRANSLATE_URL=http://localhost:5500

# ── Routing ──
OSRM_URL=https://router.project-osrm.org

# ── Currency ──
FRANKFURTER_URL=https://api.frankfurter.app

# ── Weather (Optional - get key from openweathermap.org) ──
OPENWEATHERMAP_API_KEY=

# ── Google OAuth (Optional) ──
GOOGLE_CLIENT_ID=
GOOGLE_CLIENT_SECRET=
GOOGLE_CALLBACK_URL=http://localhost:4000/api/v1/auth/google/callback

# ── Push Notifications (Optional) ──
FCM_SERVER_KEY=
```

### Frontend (`packages/web/.env.local`)
```env
NEXT_PUBLIC_API_URL=http://localhost:4000/api/v1
NEXT_PUBLIC_WS_URL=http://localhost:4000
NEXT_PUBLIC_APP_NAME=Partner
NEXT_PUBLIC_APP_DESCRIPTION=Travel Together. Explore Beyond.

# ── Map Providers (Optional - CartoDB is default) ──
NEXT_PUBLIC_MAPBOX_TOKEN=
NEXT_PUBLIC_MAPTILER_KEY=
```

---

## 6. Service Dependency Map

```
┌─────────────────────────────────────────────────────────┐
│                    Partner App                           │
├──────────────────────┬──────────────────────────────────┤
│   Frontend (Web)     │         Backend (API)            │
│   Next.js :3000      │         NestJS :4000             │
├──────────────────────┴──────────────────────────────────┤
│                                                          │
│  REQUIRED INFRASTRUCTURE (Docker)                        │
│  ┌──────────────┐ ┌───────┐ ┌───────┐ ┌──────────────┐ │
│  │ PostgreSQL   │ │ Redis │ │ MinIO │ │ MeiliSearch  │ │
│  │ + PostGIS    │ │ :6379 │ │ :9000 │ │ :7700        │ │
│  │ :5432        │ │       │ │       │ │              │ │
│  └──────────────┘ └───────┘ └───────┘ └──────────────┘ │
│  ┌──────────────┐                                        │
│  │LibreTranslate│                                        │
│  │ :5500        │                                        │
│  └──────────────┘                                        │
│                                                          │
│  PUBLIC APIs (No Key)                                    │
│  ┌──────────────┐ ┌──────────────┐ ┌──────────────────┐ │
│  │ OSRM         │ │ Frankfurter  │ │ CartoDB Basemaps │ │
│  │ (Routing)    │ │ (Currency)   │ │ (Map Tiles)      │ │
│  └──────────────┘ └──────────────┘ └──────────────────┘ │
│                                                          │
│  OPTIONAL APIs (Key Required)                            │
│  ┌──────────────┐ ┌──────────────┐ ┌──────────────────┐ │
│  │OpenWeatherMap│ │ Google OAuth │ │ Firebase FCM     │ │
│  │ (Weather)    │ │ (Social SSO) │ │ (Push Notifs)    │ │
│  └──────────────┘ └──────────────┘ └──────────────────┘ │
│  ┌──────────────┐ ┌──────────────┐                      │
│  │ Mapbox       │ │ MapTiler     │                      │
│  │ (Alt Maps)   │ │ (Alt Maps)   │                      │
│  └──────────────┘ └──────────────┘                      │
└─────────────────────────────────────────────────────────┘
```

---

## 7. Production Checklist

Before deploying to production, ensure:

- [ ] Change `JWT_SECRET` and `JWT_REFRESH_SECRET` to strong random values
- [ ] Change all default passwords (PostgreSQL, MinIO, MeiliSearch)
- [ ] Set `CORS_ORIGINS` to your production domain
- [ ] Get OpenWeatherMap API key for live weather
- [ ] Set up Google OAuth credentials with production redirect URI
- [ ] Set up Firebase project for push notifications
- [ ] Consider self-hosting OSRM for reliable routing
- [ ] Set up proper SSL/TLS certificates
- [ ] Configure rate limiting for public endpoints
- [ ] Set up database backups
- [ ] Use managed services (AWS RDS, ElastiCache, S3) instead of Docker in production

---

## 8. API Usage by Feature

| Feature | APIs Used |
|---------|-----------|
| **Route Planning** | OSRM |
| **Weather** | OpenWeatherMap + Static climate data |
| **Translation** | LibreTranslate (self-hosted) |
| **Currency** | Frankfurter API |
| **Maps** | CartoDB (default) / Mapbox / MapTiler |
| **Auth** | JWT (built-in) + Google OAuth |
| **Push Notifications** | Firebase FCM |
| **Search** | MeiliSearch (self-hosted) |
| **File Storage** | MinIO (self-hosted) |
| **Geospatial** | PostGIS (self-hosted) |
| **Job Queue** | Bull + Redis (self-hosted) |
| **Real-time** | Socket.io (built-in) |
| **Safety Scores** | Static data (no external API) |
| **Cultural Guides** | Static data (no external API) |
| **Traffic Rules** | Static data (no external API) |
| **Travel Kit** | Static data (no external API) |
| **Phrases** | Static data (no external API) |
| **Food/Dietary** | Static data (no external API) |
| **Events** | Static data (no external API) |
| **Health** | Static data (no external API) |
| **Emergency** | Static data (no external API) |
| **Carbon** | Calculated internally |
| **Badges/XP** | Calculated internally |
| **AI Features** | Built-in logic (no external LLM yet) |
| **Country Info** | RestCountries API (free, unlimited) |
| **Public Holidays** | Nager.Date API (free, unlimited) |
| **Places Discovery** | Overpass/OSM API (free, fair use) |
| **Disaster Alerts** | USGS Earthquake API (free, unlimited) |
| **Geocoding** | Nominatim/OSM (free, 1 req/sec) |
| **Travel Guides** | WikiVoyage API (free, unlimited) |
| **Air Quality** | Open-Meteo Air Quality (free, unlimited) |
