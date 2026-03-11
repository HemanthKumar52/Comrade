import { NestFactory } from '@nestjs/core';
import { ValidationPipe } from '@nestjs/common';
import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger';
import { AppModule } from './app.module';
import { HttpExceptionFilter } from './common/filters/http-exception.filter';
import { TransformInterceptor } from './common/interceptors/transform.interceptor';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  // CORS
  app.enableCors({
    origin: process.env.CORS_ORIGINS?.split(',') || ['http://localhost:3000'],
    methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'OPTIONS'],
    credentials: true,
  });

  // Global prefix
  app.setGlobalPrefix('api/v1');

  // Global pipes
  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      forbidNonWhitelisted: true,
      transform: true,
      transformOptions: { enableImplicitConversion: true },
    }),
  );

  // Global filters
  app.useGlobalFilters(new HttpExceptionFilter());

  // Global interceptors
  app.useGlobalInterceptors(new TransformInterceptor());

  // Swagger
  const config = new DocumentBuilder()
    .setTitle('Partner Travel App API')
    .setDescription('Backend API for the Partner Travel Application')
    .setVersion('1.0')
    .addBearerAuth(
      {
        type: 'http',
        scheme: 'bearer',
        bearerFormat: 'JWT',
        name: 'JWT',
        description: 'Enter JWT token',
        in: 'header',
      },
      'JWT-auth',
    )
    .addTag('Auth', 'Authentication endpoints')
    .addTag('Users', 'User management')
    .addTag('Trips', 'Trip management')
    .addTag('Routes', 'Route calculation')
    .addTag('Notes', 'Notes & folders')
    .addTag('Badges', 'Gamification badges')
    .addTag('POI', 'Points of interest')
    .addTag('Partners', 'Partner matching')
    .addTag('Tracking', 'Live location tracking')
    .addTag('Chat', 'Real-time messaging')
    .addTag('Notifications', 'Push notifications')
    .addTag('Translator', 'Language translation')
    .addTag('Currency', 'Currency conversion')
    .addTag('Emergency', 'Emergency services')
    .addTag('Food', 'Food & dining')
    .addTag('Cultural', 'Cultural guide')
    .addTag('Events', 'Local events')
    .addTag('Accessibility', 'Accessibility features')
    .addTag('Expenses', 'Expense tracking')
    .addTag('Connectivity', 'WiFi & connectivity')
    .addTag('Packing', 'Packing & itinerary')
    .addTag('Travel Kit', 'Travel utilities')
    .addTag('Health', 'Health & vaccinations')
    .addTag('Passport Stamps', 'Digital passport stamps')
    .build();

  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('api/docs', app, document);

  const port = process.env.PORT || 4000;
  await app.listen(port);
  console.log(`🚀 Partner App API running on http://localhost:${port}`);
  console.log(`📚 Swagger docs at http://localhost:${port}/api/docs`);
}

bootstrap();
