import { Module } from '@nestjs/common';
import { PlacesDiscoveryController } from './places-discovery.controller';
import { PlacesDiscoveryService } from './places-discovery.service';

@Module({
  controllers: [PlacesDiscoveryController],
  providers: [PlacesDiscoveryService],
  exports: [PlacesDiscoveryService],
})
export class PlacesDiscoveryModule {}
