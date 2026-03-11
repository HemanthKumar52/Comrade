import {
  Controller,
  Get,
  Post,
  Patch,
  Param,
  Body,
  Query,
  UseGuards,
} from '@nestjs/common';
import {
  ApiTags,
  ApiOperation,
  ApiResponse,
  ApiBearerAuth,
  ApiQuery,
} from '@nestjs/swagger';
import { PoiService } from './poi.service';
import { CreatePoiDto } from './dto/create-poi.dto';
import { RatePoiDto } from './dto/rate-poi.dto';
import { JwtAuthGuard } from '../common/guards/jwt-auth.guard';
import { CurrentUser, JwtPayload } from '../common/decorators/current-user.decorator';

@ApiTags('POI')
@ApiBearerAuth('JWT-auth')
@UseGuards(JwtAuthGuard)
@Controller('poi')
export class PoiController {
  constructor(private readonly poiService: PoiService) {}

  @Get()
  @ApiOperation({ summary: 'List POIs with filters' })
  @ApiQuery({ name: 'category', required: false })
  @ApiQuery({ name: 'lat', required: false, type: Number })
  @ApiQuery({ name: 'lng', required: false, type: Number })
  @ApiQuery({ name: 'radius', required: false, type: Number, description: 'Radius in km' })
  @ApiQuery({ name: 'verified', required: false })
  @ApiQuery({ name: 'search', required: false })
  @ApiQuery({ name: 'take', required: false, type: Number })
  @ApiQuery({ name: 'skip', required: false, type: Number })
  @ApiResponse({ status: 200, description: 'Paginated list of POIs' })
  async findAll(
    @Query('category') category?: string,
    @Query('lat') lat?: string,
    @Query('lng') lng?: string,
    @Query('radius') radius?: string,
    @Query('verified') verified?: string,
    @Query('search') search?: string,
    @Query('take') take?: string,
    @Query('skip') skip?: string,
  ) {
    return this.poiService.findAll(
      {
        category,
        lat: lat ? parseFloat(lat) : undefined,
        lng: lng ? parseFloat(lng) : undefined,
        radius: radius ? parseFloat(radius) : undefined,
        verified,
        search,
      },
      take ? parseInt(take, 10) : 20,
      skip ? parseInt(skip, 10) : 0,
    );
  }

  @Get('categories')
  @ApiOperation({ summary: 'List all POI categories' })
  @ApiResponse({ status: 200, description: 'Array of category strings' })
  async getCategories() {
    return this.poiService.getCategories();
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get POI detail with ratings' })
  @ApiResponse({ status: 200, description: 'POI detail' })
  @ApiResponse({ status: 404, description: 'POI not found' })
  async findOne(@Param('id') id: string) {
    return this.poiService.findOne(id);
  }

  @Post()
  @ApiOperation({ summary: 'Submit a new POI' })
  @ApiResponse({ status: 201, description: 'POI created' })
  async create(
    @CurrentUser() user: JwtPayload,
    @Body() dto: CreatePoiDto,
  ) {
    return this.poiService.create(user.sub, dto);
  }

  @Patch(':id')
  @ApiOperation({ summary: 'Update a POI (admin or submitter)' })
  @ApiResponse({ status: 200, description: 'POI updated' })
  async update(
    @Param('id') id: string,
    @CurrentUser() user: JwtPayload,
    @Body() dto: Partial<CreatePoiDto>,
  ) {
    return this.poiService.update(id, user.sub, user.role, dto);
  }

  @Post(':id/rate')
  @ApiOperation({ summary: 'Rate a POI (1-5)' })
  @ApiResponse({ status: 201, description: 'Rating submitted' })
  async rate(
    @Param('id') id: string,
    @CurrentUser() user: JwtPayload,
    @Body() dto: RatePoiDto,
  ) {
    return this.poiService.rate(id, user.sub, dto);
  }
}
