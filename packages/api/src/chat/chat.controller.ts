import {
  Controller,
  Get,
  Post,
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
import { ChatService } from './chat.service';
import { CreateRoomDto } from './dto/create-room.dto';
import { JwtAuthGuard } from '../common/guards/jwt-auth.guard';
import { CurrentUser, JwtPayload } from '../common/decorators/current-user.decorator';

@ApiTags('Chat')
@ApiBearerAuth('JWT-auth')
@UseGuards(JwtAuthGuard)
@Controller('chat')
export class ChatController {
  constructor(private readonly chatService: ChatService) {}

  @Post('rooms')
  @ApiOperation({ summary: 'Create a chat room' })
  @ApiResponse({ status: 201, description: 'Room created' })
  async createRoom(
    @CurrentUser() user: JwtPayload,
    @Body() dto: CreateRoomDto,
  ) {
    return this.chatService.createRoom(user.sub, dto);
  }

  @Get('rooms')
  @ApiOperation({ summary: "List user's chat rooms" })
  @ApiResponse({ status: 200, description: 'List of chat rooms' })
  async listRooms(@CurrentUser() user: JwtPayload) {
    return this.chatService.getUserRooms(user.sub);
  }

  @Get('rooms/:id/messages')
  @ApiOperation({ summary: 'Get message history with pagination' })
  @ApiQuery({ name: 'take', required: false, type: Number })
  @ApiQuery({ name: 'skip', required: false, type: Number })
  @ApiResponse({ status: 200, description: 'Paginated messages' })
  async getMessages(
    @Param('id') roomId: string,
    @CurrentUser() user: JwtPayload,
    @Query('take') take?: string,
    @Query('skip') skip?: string,
  ) {
    return this.chatService.getMessages(
      roomId,
      user.sub,
      take ? parseInt(take, 10) : 50,
      skip ? parseInt(skip, 10) : 0,
    );
  }

  @Delete('rooms/:id')
  @ApiOperation({ summary: 'Leave a chat room' })
  @ApiResponse({ status: 200, description: 'Left the room' })
  async leaveRoom(
    @Param('id') roomId: string,
    @CurrentUser() user: JwtPayload,
  ) {
    return this.chatService.leaveRoom(roomId, user.sub);
  }
}
