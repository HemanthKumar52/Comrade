import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { ThrottlerModule } from '@nestjs/throttler';
import { BullModule } from '@nestjs/bull';
import { ScheduleModule } from '@nestjs/schedule';
import { PrismaModule } from './prisma/prisma.module';
import { AuthModule } from './auth/auth.module';
import { UsersModule } from './users/users.module';
import { TripsModule } from './trips/trips.module';
import { RoutesModule } from './routes/routes.module';
import { NotesModule } from './notes/notes.module';
import { BadgesModule } from './badges/badges.module';
import { PoiModule } from './poi/poi.module';
import { PartnersModule } from './partners/partners.module';
import { TrackingModule } from './tracking/tracking.module';
import { ChatModule } from './chat/chat.module';
import { NotificationsModule } from './notifications/notifications.module';
import { TranslatorModule } from './translator/translator.module';
import { CurrencyModule } from './currency/currency.module';
import { EmergencyModule } from './emergency/emergency.module';
import { FoodModule } from './food/food.module';
import { CulturalModule } from './cultural/cultural.module';
import { EventsModule } from './events/events.module';
import { AccessibilityModule } from './accessibility/accessibility.module';
import { ExpensesModule } from './expenses/expenses.module';
import { ConnectivityModule } from './connectivity/connectivity.module';
import { PackingModule } from './packing/packing.module';
import { TravelKitModule } from './travel-kit/travel-kit.module';
import { HealthModule } from './health/health.module';
import { PassportStampsModule } from './passport/passport-stamps.module';
import { VehiclesModule } from './vehicles/vehicles.module';
import { WeatherModule } from './weather/weather.module';
import { AiModule } from './ai/ai.module';
import { TrafficModule } from './traffic/traffic.module';
import { TravelPhrasesModule } from './travel-phrases/travel-phrases.module';
import { TravelStatsModule } from './travel-stats/travel-stats.module';
import { CountryInfoModule } from './country-info/country-info.module';
import { HolidaysModule } from './holidays/holidays.module';
import { PlacesDiscoveryModule } from './places-discovery/places-discovery.module';
import { DisasterAlertsModule } from './disaster-alerts/disaster-alerts.module';
import { GeocodingModule } from './geocoding/geocoding.module';
import { TravelGuidesModule } from './travel-guides/travel-guides.module';

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }),
    ThrottlerModule.forRoot({
      throttlers: [{ ttl: 60000, limit: 100 }],
    }),
    BullModule.forRoot({
      redis: {
        host: process.env.REDIS_HOST || 'localhost',
        port: parseInt(process.env.REDIS_PORT || '6379', 10),
      },
    }),
    ScheduleModule.forRoot(),
    PrismaModule,
    AuthModule,
    UsersModule,
    TripsModule,
    RoutesModule,
    NotesModule,
    BadgesModule,
    PoiModule,
    PartnersModule,
    TrackingModule,
    ChatModule,
    NotificationsModule,
    TranslatorModule,
    CurrencyModule,
    EmergencyModule,
    FoodModule,
    CulturalModule,
    EventsModule,
    AccessibilityModule,
    ExpensesModule,
    ConnectivityModule,
    PackingModule,
    TravelKitModule,
    HealthModule,
    PassportStampsModule,
    VehiclesModule,
    WeatherModule,
    AiModule,
    TrafficModule,
    TravelPhrasesModule,
    TravelStatsModule,
    CountryInfoModule,
    HolidaysModule,
    PlacesDiscoveryModule,
    DisasterAlertsModule,
    GeocodingModule,
    TravelGuidesModule,
  ],
})
export class AppModule {}
