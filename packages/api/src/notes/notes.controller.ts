import {
  Controller,
  Get,
  Post,
  Patch,
  Delete,
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
import { NotesService } from './notes.service';
import { CreateNoteDto } from './dto/create-note.dto';
import { UpdateNoteDto } from './dto/update-note.dto';
import { JwtAuthGuard } from '../common/guards/jwt-auth.guard';
import { CurrentUser, JwtPayload } from '../common/decorators/current-user.decorator';

@ApiTags('Notes')
@ApiBearerAuth('JWT-auth')
@UseGuards(JwtAuthGuard)
@Controller('notes')
export class NotesController {
  constructor(private readonly notesService: NotesService) {}

  @Post()
  @ApiOperation({ summary: 'Create a note' })
  @ApiResponse({ status: 201, description: 'Note created' })
  async create(
    @CurrentUser() user: JwtPayload,
    @Body() dto: CreateNoteDto,
  ) {
    return this.notesService.create(user.sub, dto);
  }

  @Get()
  @ApiOperation({ summary: 'List notes with filters' })
  @ApiQuery({ name: 'type', required: false })
  @ApiQuery({ name: 'tripId', required: false })
  @ApiQuery({ name: 'folderId', required: false })
  @ApiQuery({ name: 'search', required: false })
  @ApiQuery({ name: 'take', required: false, type: Number })
  @ApiQuery({ name: 'skip', required: false, type: Number })
  @ApiResponse({ status: 200, description: 'Paginated list of notes' })
  async findAll(
    @CurrentUser() user: JwtPayload,
    @Query('type') type?: string,
    @Query('tripId') tripId?: string,
    @Query('folderId') folderId?: string,
    @Query('search') search?: string,
    @Query('take') take?: string,
    @Query('skip') skip?: string,
  ) {
    return this.notesService.findAll(
      user.sub,
      { type, tripId, folderId, search },
      take ? parseInt(take, 10) : 20,
      skip ? parseInt(skip, 10) : 0,
    );
  }

  @Get('folders')
  @ApiOperation({ summary: 'List note folders' })
  @ApiResponse({ status: 200, description: 'List of folders with note counts' })
  async listFolders(@CurrentUser() user: JwtPayload) {
    return this.notesService.listFolders(user.sub);
  }

  @Post('folders')
  @ApiOperation({ summary: 'Create a note folder' })
  @ApiResponse({ status: 201, description: 'Folder created' })
  async createFolder(
    @CurrentUser() user: JwtPayload,
    @Body() body: { name: string; tripId?: string },
  ) {
    return this.notesService.createFolder(user.sub, body.name, body.tripId);
  }

  @Delete('folders/:id')
  @ApiOperation({ summary: 'Delete a note folder' })
  @ApiResponse({ status: 200, description: 'Folder deleted' })
  async removeFolder(
    @Param('id') id: string,
    @CurrentUser() user: JwtPayload,
  ) {
    return this.notesService.removeFolder(id, user.sub);
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get note detail' })
  @ApiResponse({ status: 200, description: 'Note detail' })
  @ApiResponse({ status: 404, description: 'Note not found' })
  async findOne(
    @Param('id') id: string,
    @CurrentUser() user: JwtPayload,
  ) {
    return this.notesService.findOne(id, user.sub);
  }

  @Patch(':id')
  @ApiOperation({ summary: 'Update a note' })
  @ApiResponse({ status: 200, description: 'Note updated' })
  async update(
    @Param('id') id: string,
    @CurrentUser() user: JwtPayload,
    @Body() dto: UpdateNoteDto,
  ) {
    return this.notesService.update(id, user.sub, dto);
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Delete a note' })
  @ApiResponse({ status: 200, description: 'Note deleted' })
  async remove(
    @Param('id') id: string,
    @CurrentUser() user: JwtPayload,
  ) {
    return this.notesService.remove(id, user.sub);
  }
}
