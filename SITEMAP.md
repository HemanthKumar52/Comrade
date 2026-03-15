# Partner App - Complete Sitemap

> Travel Together. Explore Beyond.

---

## 1. Web Routes (Next.js 14 App Router)

### Authentication (`/auth`)
| Route | Page | Description |
|-------|------|-------------|
| `/login` | Login | Email/password + Google OAuth login |
| `/register` | Register | New user registration |
| `/forgot-password` | Forgot Password | Password recovery via email |

### Core Dashboard
| Route | Page | Description |
|-------|------|-------------|
| `/dashboard` | Dashboard | Stats, active trips, badges, streak |
| `/map` | Map View | Interactive 2D/3D MapLibre map |
| `/explore` | Explore | Destination discovery & browse |
| `/settings` | Settings | User preferences & app config |
| `/profile/[id]` | User Profile | Public/own profile with stats |

### Trip Management
| Route | Page | Description |
|-------|------|-------------|
| `/trips` | My Trips | List all trips (filter by status) |
| `/trips/new` | Create Trip | New trip planner form |
| `/trips/[id]` | Trip Detail | Trip info, members, route, logs |

### Social & Communication
| Route | Page | Description |
|-------|------|-------------|
| `/partners` | Partner Search | Find travel partners by filters |
| `/partners/[id]` | Partner Profile | Partner stats, badges, reviews |
| `/messages` | Messages | Real-time chat rooms |

### Travel Notes
| Route | Page | Description |
|-------|------|-------------|
| `/notes` | Notes | Browse notes (text, voice, photo, plan) |
| `/notes/new` | New Note | Create/edit travel note |

### Gamification
| Route | Page | Description |
|-------|------|-------------|
| `/badges` | Badges | All badges with unlock progress |
| `/passport` | Passport | Virtual passport stamps collection |
| `/stats` | Travel Stats | Personal analytics, heatmap, timeline |

### Travel Tools
| Route | Page | Description |
|-------|------|-------------|
| `/translator` | Translator | Text/voice/camera translation |
| `/currency` | Currency | Exchange rates & budget tracker |
| `/expenses` | Expenses | Trip expense tracking & splits |
| `/packing` | Packing | AI packing list generator |
| `/travel-kit` | Travel Kit | Visa, plugs, timezone, laws (all-in-one) |
| `/phrases` | Phrases | Essential travel phrasebook |
| `/vehicles` | Vehicles | Vehicle rental info & pricing |

### Discovery & Culture
| Route | Page | Description |
|-------|------|-------------|
| `/food` | Food | Local dishes, dietary profiles, water safety |
| `/cultural` | Cultural | Cultural guides & etiquette |
| `/events` | Events | Festivals, concerts, local events |
| `/weather` | Weather | Forecasts, alerts, best time to visit |
| `/places` | Places Discovery | Explore nearby landmarks, hidden gems, free activities (OpenStreetMap) |
| `/country-info` | Country Info | Country details, compare countries (RestCountries API) |
| `/travel-guides` | Travel Guides | Community travel guides (WikiVoyage) |
| `/holidays` | Holidays | Public holidays & long weekends by country (Nager.Date API) |
| `/air-quality` | Air Quality | Real-time AQI and pollutant data (Open-Meteo) |

### Health & Safety
| Route | Page | Description |
|-------|------|-------------|
| `/health` | Health | Vaccinations, insurance, pharmacies |
| `/safety` | Safety | Safety scores (general, solo, LGBTQ+, night) |
| `/emergency` | Emergency | SOS, emergency contacts, embassies |
| `/disaster-alerts` | Disaster Alerts | Earthquakes, cyclones, floods, volcanoes (USGS/GDACS) |

### Sustainability & Info
| Route | Page | Description |
|-------|------|-------------|
| `/carbon` | Carbon | Carbon footprint & offset suggestions |
| `/traffic` | Traffic | Traffic rules, speed limits, fines |
| `/connectivity` | Connectivity | WiFi, SIM, eSIM, VPN info |
| `/accessibility` | Accessibility | Accessibility profiles & features |
| `/ai` | AI Assistant | Trip narratives, mood routes, tips |

---

## 2. API Endpoints (REST)

**Base URL:** `http://localhost:4000/api/v1`
**Swagger Docs:** `http://localhost:4000/api/docs`

### Auth (`/auth`)
| Method | Endpoint | Description |
|--------|----------|-------------|
| `POST` | `/auth/register` | Register new user |
| `POST` | `/auth/login` | Login with credentials |
| `POST` | `/auth/refresh` | Refresh JWT access token |
| `POST` | `/auth/forgot-password` | Request password reset |
| `POST` | `/auth/reset-password` | Reset password with token |
| `POST` | `/auth/google` | Google OAuth login |
| `GET` | `/auth/me` | Get current user profile |

### Users (`/users`)
| Method | Endpoint | Description |
|--------|----------|-------------|
| `GET` | `/users/profile` | Get own profile with stats |
| `PATCH` | `/users/profile` | Update own profile |
| `GET` | `/users/dashboard` | Full dashboard data |
| `GET` | `/users/:id` | Public user profile |
| `GET` | `/users/:id/stats` | User travel statistics |
| `GET` | `/users/:id/badges` | User badges |

### Trips (`/trips`)
| Method | Endpoint | Description |
|--------|----------|-------------|
| `POST` | `/trips` | Create trip |
| `GET` | `/trips` | List trips (paginated, filterable) |
| `GET` | `/trips/:id` | Trip detail |
| `PATCH` | `/trips/:id` | Update trip |
| `DELETE` | `/trips/:id` | Cancel trip |
| `POST` | `/trips/:id/start` | Start trip |
| `POST` | `/trips/:id/end` | End trip (triggers badge check) |
| `POST` | `/trips/:id/members` | Add member |
| `DELETE` | `/trips/:id/members/:userId` | Remove member |
| `GET` | `/trips/:id/stats` | Trip statistics |

### Routes (`/routes`)
| Method | Endpoint | Description |
|--------|----------|-------------|
| `POST` | `/routes/calculate` | Calculate route (OSRM) |
| `GET` | `/routes/alternatives` | Get alternative routes |
| `POST` | `/routes/:tripId/log` | Save route log |

### Notes (`/notes`)
| Method | Endpoint | Description |
|--------|----------|-------------|
| `POST` | `/notes` | Create note |
| `GET` | `/notes` | List notes (filter: type, trip, folder, search) |
| `GET` | `/notes/folders` | List folders |
| `POST` | `/notes/folders` | Create folder |
| `DELETE` | `/notes/folders/:id` | Delete folder |
| `GET` | `/notes/:id` | Note detail |
| `PATCH` | `/notes/:id` | Update note |
| `DELETE` | `/notes/:id` | Delete note |

### Chat (`/chat`)
| Method | Endpoint | Description |
|--------|----------|-------------|
| `POST` | `/chat/rooms` | Create chat room |
| `GET` | `/chat/rooms` | List chat rooms |
| `GET` | `/chat/rooms/:id/messages` | Message history (paginated) |
| `DELETE` | `/chat/rooms/:id` | Leave room |

### Notifications (`/notifications`)
| Method | Endpoint | Description |
|--------|----------|-------------|
| `GET` | `/notifications` | List notifications |
| `PATCH` | `/notifications/:id/read` | Mark as read |
| `POST` | `/notifications/read-all` | Mark all read |
| `GET` | `/notifications/unread-count` | Unread count |

### Badges (`/badges`)
| Method | Endpoint | Description |
|--------|----------|-------------|
| `GET` | `/badges` | All badges (filter by family) |
| `GET` | `/badges/my` | My unlocked badges |
| `POST` | `/badges/check` | Trigger badge check |
| `GET` | `/badges/:id` | Badge detail |

### POI (`/poi`)
| Method | Endpoint | Description |
|--------|----------|-------------|
| `GET` | `/poi` | List POIs (category, location, radius) |
| `GET` | `/poi/categories` | All categories |
| `GET` | `/poi/:id` | POI detail |
| `POST` | `/poi` | Submit POI |
| `PATCH` | `/poi/:id` | Update POI |
| `POST` | `/poi/:id/rate` | Rate POI |

### Partners (`/partners`)
| Method | Endpoint | Description |
|--------|----------|-------------|
| `GET` | `/partners/search` | Search partners (destination, dates, vehicle) |
| `POST` | `/partners/request` | Send partner request |
| `GET` | `/partners/requests` | List requests |
| `PATCH` | `/partners/requests/:id` | Accept/decline request |
| `GET` | `/partners/:userId/profile` | Partner profile |
| `POST` | `/partners/:userId/review` | Leave review |

### Translator (`/translator`)
| Method | Endpoint | Description |
|--------|----------|-------------|
| `POST` | `/translator/translate` | Translate text |
| `POST` | `/translator/detect` | Detect language |
| `GET` | `/translator/languages` | Available languages |
| `GET` | `/translator/language-packs` | Offline packs |
| `GET` | `/translator/phrasebook` | Phrases by category |

### Currency (`/currency`)
| Method | Endpoint | Description |
|--------|----------|-------------|
| `GET` | `/currency/rates` | Exchange rate |
| `GET` | `/currency/convert` | Convert amount |
| `GET` | `/currency/all` | All currencies |
| `GET` | `/currency/historical` | Historical rates |
| `POST` | `/currency/budget` | Create budget |
| `GET` | `/currency/budget/:tripId` | Get budget |
| `PATCH` | `/currency/budget/:id` | Update budget |

### Expenses (`/expenses`)
| Method | Endpoint | Description |
|--------|----------|-------------|
| `POST` | `/expenses` | Log expense |
| `GET` | `/expenses` | List expenses |
| `GET` | `/expenses/summary` | Summary by category |
| `POST` | `/expenses/:id/split` | Split expense |
| `GET` | `/expenses/settlements` | Calculate settlements |
| `GET` | `/expenses/report` | Full finance report |

### Emergency (`/emergency`)
| Method | Endpoint | Description |
|--------|----------|-------------|
| `POST` | `/emergency/sos` | Trigger SOS alert |
| `GET` | `/emergency/contacts` | List emergency contacts |
| `POST` | `/emergency/contacts` | Add contact |
| `PATCH` | `/emergency/contacts/:id` | Update contact |
| `DELETE` | `/emergency/contacts/:id` | Delete contact |
| `GET` | `/emergency/embassies` | Find embassies |
| `GET` | `/emergency/advisories` | Travel advisories |
| `GET` | `/emergency/hospitals` | Nearby hospitals |
| `GET` | `/emergency/emergency-numbers` | Local emergency numbers |

### Safety Score (`/safety-score`)
| Method | Endpoint | Description |
|--------|----------|-------------|
| `GET` | `/safety-score/:country` | Country safety score |
| `GET` | `/safety-score/:country/:city` | City safety score |
| `GET` | `/safety-score/compare` | Compare countries |
| `GET` | `/safety-score/solo-female/:country` | Solo female safety |
| `GET` | `/safety-score/lgbtq/:country` | LGBTQ+ safety |
| `GET` | `/safety-score/night/:country` | Nighttime safety |

### Health (`/health`)
| Method | Endpoint | Description |
|--------|----------|-------------|
| `GET` | `/health/vaccinations/required` | Required vaccines for country |
| `POST` | `/health/vaccinations` | Log vaccination |
| `GET` | `/health/vaccinations/my` | My vaccinations |
| `POST` | `/health/insurance` | Save insurance info |
| `GET` | `/health/insurance` | Get insurance |
| `GET` | `/health/pharmacies` | Nearby pharmacies |
| `GET` | `/health/drug-translator` | Drug equivalents abroad |

### Food (`/food`)
| Method | Endpoint | Description |
|--------|----------|-------------|
| `GET` | `/food/dishes` | Local dishes by country |
| `GET` | `/food/water-safety` | Water safety info |
| `GET` | `/food/dietary-profile` | Get dietary profile |
| `PUT` | `/food/dietary-profile` | Set dietary profile |
| `GET` | `/food/restaurants` | Nearby restaurants |

### Cultural (`/cultural`)
| Method | Endpoint | Description |
|--------|----------|-------------|
| `GET` | `/cultural/guide` | Culture guide for country |
| `GET` | `/cultural/etiquette` | Religious site etiquette |
| `GET` | `/cultural/phrases` | Polite phrases |

### Events (`/events`)
| Method | Endpoint | Description |
|--------|----------|-------------|
| `GET` | `/events` | Nearby events |
| `GET` | `/events/festivals` | Festivals by country |
| `GET` | `/events/sun-times` | Sunrise/sunset times |
| `GET` | `/events/:id` | Event detail |

### Weather (`/weather`)
| Method | Endpoint | Description |
|--------|----------|-------------|
| `GET` | `/weather/current` | Current weather |
| `GET` | `/weather/forecast` | 5-day forecast |
| `GET` | `/weather/alerts` | Weather alerts |
| `GET` | `/weather/best-time/:country` | Best time to visit |
| `GET` | `/weather/climate/:country` | Climate data |

### Accessibility (`/accessibility`)
| Method | Endpoint | Description |
|--------|----------|-------------|
| `GET` | `/accessibility/profile` | Get profile |
| `PUT` | `/accessibility/profile` | Set profile |
| `GET` | `/accessibility/pois` | Accessible POIs |
| `GET` | `/accessibility/routes` | Wheelchair routes |

### Connectivity (`/connectivity`)
| Method | Endpoint | Description |
|--------|----------|-------------|
| `GET` | `/connectivity/wifi` | WiFi hotspots |
| `POST` | `/connectivity/wifi` | Submit hotspot |
| `GET` | `/connectivity/sim-options` | SIM/eSIM options |
| `GET` | `/connectivity/offline-content` | Offline content |
| `GET` | `/connectivity/vpn-guide` | VPN legality |

### Packing (`/packing`)
| Method | Endpoint | Description |
|--------|----------|-------------|
| `POST` | `/packing/generate` | AI packing list |
| `GET` | `/packing/templates` | Packing templates |
| `POST` | `/packing/itinerary` | Create itinerary |
| `GET` | `/packing/itinerary/:tripId` | Get itinerary |

### Passport (`/passport`)
| Method | Endpoint | Description |
|--------|----------|-------------|
| `GET` | `/passport/stamps` | My stamps |
| `POST` | `/passport/stamps` | Add stamp |
| `GET` | `/passport/stamps/:userId` | User's stamps |
| `POST` | `/passport/stamps/auto/:tripId` | Auto-generate stamp |

### Carbon (`/carbon`)
| Method | Endpoint | Description |
|--------|----------|-------------|
| `GET` | `/carbon/trip/:tripId` | Trip carbon footprint |
| `GET` | `/carbon/user/:userId` | Lifetime carbon |
| `GET` | `/carbon/compare` | Compare vehicle emissions |
| `GET` | `/carbon/offset/:tripId` | Offset recommendations |
| `GET` | `/carbon/leaderboard` | Green leaderboard |

### Traffic (`/traffic`)
| Method | Endpoint | Description |
|--------|----------|-------------|
| `GET` | `/traffic/rules/:country` | Full traffic rules |
| `GET` | `/traffic/driving-side/:country` | Driving side |
| `GET` | `/traffic/speed-limits/:country` | Speed limits |
| `GET` | `/traffic/license/:country` | License requirements |
| `GET` | `/traffic/fines/:country` | Common fines |

### Vehicles (`/vehicles`)
| Method | Endpoint | Description |
|--------|----------|-------------|
| `GET` | `/vehicles/providers` | Rental providers |
| `GET` | `/vehicles/types` | Vehicle types |
| `GET` | `/vehicles/estimate` | Rental price estimate |
| `GET` | `/vehicles/rentals` | Rentals by country |
| `GET` | `/vehicles/rentals/:country` | Country rentals |

### Phrases (`/phrases`)
| Method | Endpoint | Description |
|--------|----------|-------------|
| `GET` | `/phrases/languages` | Available languages |
| `GET` | `/phrases/essential/:country` | Essential phrases |
| `GET` | `/phrases/:language/:category` | Phrases by category |
| `GET` | `/phrases/:language` | All phrases for language |

### Travel Stats (`/stats`)
| Method | Endpoint | Description |
|--------|----------|-------------|
| `GET` | `/stats/overview/:userId` | Travel overview |
| `GET` | `/stats/heatmap/:userId` | Travel heatmap |
| `GET` | `/stats/timeline/:userId` | Travel timeline |
| `GET` | `/stats/wrapped/:userId/:year` | Annual wrapped |

### Travel Kit (`/travel-kit`)
| Method | Endpoint | Description |
|--------|----------|-------------|
| `GET` | `/travel-kit/country/:code` | Full country info |
| `GET` | `/travel-kit/visa` | Visa requirements |
| `GET` | `/travel-kit/plug-adapter` | Plug type & voltage |
| `GET` | `/travel-kit/timezone/compare` | Compare timezones |
| `GET` | `/travel-kit/timezone/current` | Current time in country |
| `GET` | `/travel-kit/timezone` | Timezone info |
| `GET` | `/travel-kit/laws/:country` | Local laws |
| `GET` | `/travel-kit/local-laws` | Laws summary |
| `GET` | `/travel-kit/driving/:country` | Driving rules |
| `GET` | `/travel-kit/esim` | eSIM options |
| `GET` | `/travel-kit/jet-lag` | Jet lag estimate |
| `GET` | `/travel-kit/sunrise-sunset` | Sunrise/sunset |
| `GET` | `/travel-kit/all/:country` | All info (one call) |

### AI (`/ai`)
| Method | Endpoint | Description |
|--------|----------|-------------|
| `POST` | `/ai/narrate/:tripId` | Generate trip narrative |
| `POST` | `/ai/suggest-route` | Mood-based route suggestion |
| `POST` | `/ai/mood-routes` | Indian city mood routes |
| `POST` | `/ai/travel-tips` | AI travel tips |
| `GET` | `/ai/recommendations/:country` | See/do/eat/avoid |

### Country Info (`/country-info`) — RestCountries API
| Method | Endpoint | Description |
|--------|----------|-------------|
| `GET` | `/country-info/:code` | Full country info (flag, languages, currency, etc.) |
| `GET` | `/country-info/search?q={query}` | Search countries by name |
| `GET` | `/country-info/region/:region` | Countries by region |
| `GET` | `/country-info/compare?countries=IN,JP,US` | Compare countries side-by-side |
| `GET` | `/country-info/neighbors/:code` | Bordering countries with info |

### Holidays (`/holidays`) — Nager.Date API
| Method | Endpoint | Description |
|--------|----------|-------------|
| `GET` | `/holidays/:countryCode/:year` | Public holidays for country/year |
| `GET` | `/holidays/upcoming/:countryCode` | Next upcoming holidays |
| `GET` | `/holidays/today` | Worldwide holidays today |
| `GET` | `/holidays/long-weekends/:countryCode/:year` | Long weekends for trip planning |
| `GET` | `/holidays/check/:countryCode/:date` | Check if date is a holiday |

### Places Discovery (`/places-discovery`) — OpenStreetMap Overpass API
| Method | Endpoint | Description |
|--------|----------|-------------|
| `GET` | `/places-discovery/nearby?lat&lng&radius&category` | Discover nearby places |
| `GET` | `/places-discovery/landmarks?lat&lng&radius` | Famous landmarks |
| `GET` | `/places-discovery/hidden-gems?lat&lng` | Lesser-known attractions |
| `GET` | `/places-discovery/photo-spots?lat&lng` | Scenic viewpoints |
| `GET` | `/places-discovery/free-activities?lat&lng` | Free things to do |
| `GET` | `/places-discovery/categories` | List searchable categories |

### Disaster Alerts (`/disaster-alerts`) — USGS Earthquake API
| Method | Endpoint | Description |
|--------|----------|-------------|
| `GET` | `/disaster-alerts/earthquakes?days=7&minMagnitude=4` | Recent earthquakes |
| `GET` | `/disaster-alerts/near?lat&lng&radius` | Disasters near location |
| `GET` | `/disaster-alerts/country/:countryCode` | Active alerts for country |
| `GET` | `/disaster-alerts/active` | All active disaster alerts |
| `GET` | `/disaster-alerts/safety-check/:tripId` | Check trip destination alerts |

### Geocoding (`/geocoding`) — Nominatim OpenStreetMap
| Method | Endpoint | Description |
|--------|----------|-------------|
| `GET` | `/geocoding/search?q={query}&limit=5` | Search places (forward geocoding) |
| `GET` | `/geocoding/reverse?lat&lng` | Address from coordinates |
| `GET` | `/geocoding/autocomplete?q={partial}` | Place autocomplete |
| `GET` | `/geocoding/timezone?lat&lng` | Timezone for coordinates |

### Travel Guides (`/travel-guides`) — WikiVoyage API
| Method | Endpoint | Description |
|--------|----------|-------------|
| `GET` | `/travel-guides/:destination` | Full travel guide |
| `GET` | `/travel-guides/:destination/summary` | Brief overview |
| `GET` | `/travel-guides/:destination/sections` | List of guide sections |
| `GET` | `/travel-guides/search?q={query}` | Search WikiVoyage guides |
| `GET` | `/travel-guides/nearby?lat&lng` | Guides for nearby destinations |

---

## 3. WebSocket Events

### Tracking Gateway (`ws://localhost:4000/tracking`)

**Client -> Server:**
| Event | Payload | Description |
|-------|---------|-------------|
| `join-trip` | `{tripId}` | Join trip tracking room |
| `leave-trip` | `{tripId}` | Leave tracking |
| `update-location` | `{tripId, userId, lat, lng, speed?, altitude?}` | Send location |
| `sos-alert` | `{tripId, userId, lat, lng, message?}` | Emergency SOS |

**Server -> Client:**
| Event | Payload | Description |
|-------|---------|-------------|
| `joined-trip` | `{tripId}` | Join confirmation |
| `left-trip` | `{tripId}` | Leave confirmation |
| `location-updated` | `{userId, lat, lng, speed?, altitude?, timestamp}` | Member location |
| `geofence-entered` | `{userId, geofences}` | Geofence alert |
| `sos-alert` | `{userId, lat, lng, message, timestamp}` | SOS broadcast |

### Chat Gateway (`ws://localhost:4000/chat`)

**Client -> Server:**
| Event | Payload | Description |
|-------|---------|-------------|
| `join-room` | `{roomId}` | Join chat room |
| `leave-room` | `{roomId}` | Leave room |
| `send-message` | `{roomId, senderId, content, type?, mediaUrl?}` | Send message |
| `typing` | `{roomId, userId, name}` | Typing indicator |

**Server -> Client:**
| Event | Payload | Description |
|-------|---------|-------------|
| `joined-room` | `{roomId}` | Join confirmation |
| `left-room` | `{roomId}` | Leave confirmation |
| `new-message` | Message object | New message broadcast |
| `user-typing` | `{userId, name}` | Typing notification |

---

## 4. Visual Sitemap

```
Partner App
|
+-- Auth
|   +-- /login
|   +-- /register
|   +-- /forgot-password
|
+-- Core
|   +-- /dashboard
|   +-- /map
|   +-- /explore
|   +-- /settings
|   +-- /profile/[id]
|
+-- Trips
|   +-- /trips
|   +-- /trips/new
|   +-- /trips/[id]
|
+-- Social
|   +-- /partners
|   +-- /partners/[id]
|   +-- /messages
|
+-- Notes
|   +-- /notes
|   +-- /notes/new
|
+-- Gamification
|   +-- /badges
|   +-- /passport
|   +-- /stats
|
+-- Travel Tools
|   +-- /translator
|   +-- /currency
|   +-- /expenses
|   +-- /packing
|   +-- /travel-kit
|   +-- /phrases
|   +-- /vehicles
|
+-- Discovery
|   +-- /food
|   +-- /cultural
|   +-- /events
|   +-- /weather
|
+-- Safety
|   +-- /health
|   +-- /safety
|   +-- /emergency
|
+-- Sustainability
|   +-- /carbon
|   +-- /traffic
|   +-- /connectivity
|   +-- /accessibility
|   +-- /ai
```

---

**Total: 45 Pages | 170+ API Endpoints | 10 WebSocket Events | 8 Free API Integrations**
