import {
  Injectable,
  NotFoundException,
  ForbiddenException,
} from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateRoomDto } from './dto/create-room.dto';

@Injectable()
export class ChatService {
  constructor(private prisma: PrismaService) {}

  async createRoom(userId: string, dto: CreateRoomDto) {
    const allMembers = Array.from(new Set([userId, ...dto.memberIds]));

    const room = await this.prisma.chatRoom.create({
      data: {
        tripId: dto.tripId || null,
        name: dto.name || null,
        isGroup: allMembers.length > 2,
        members: {
          create: allMembers.map((id) => ({ userId: id })),
        },
      },
      include: {
        members: {
          include: { user: { select: { id: true, name: true, avatar: true } } },
        },
      },
    });

    return room;
  }

  async getUserRooms(userId: string) {
    const memberships = await this.prisma.chatRoomMember.findMany({
      where: { userId },
      include: {
        chatRoom: {
          include: {
            members: {
              include: {
                user: { select: { id: true, name: true, avatar: true } },
              },
            },
            messages: {
              orderBy: { createdAt: 'desc' },
              take: 1,
              select: {
                id: true,
                content: true,
                createdAt: true,
                sender: { select: { id: true, name: true } },
              },
            },
          },
        },
      },
    });

    return memberships.map((m) => ({
      ...m.chatRoom,
      lastMessage: m.chatRoom.messages[0] || null,
    }));
  }

  async getMessages(
    roomId: string,
    userId: string,
    take = 50,
    skip = 0,
  ) {
    await this.ensureMember(roomId, userId);

    const [messages, total] = await Promise.all([
      this.prisma.chatMessage.findMany({
        where: { chatRoomId: roomId },
        orderBy: { createdAt: 'desc' },
        take,
        skip,
        include: {
          sender: { select: { id: true, name: true, avatar: true } },
        },
      }),
      this.prisma.chatMessage.count({ where: { chatRoomId: roomId } }),
    ]);

    return { messages: messages.reverse(), total, take, skip };
  }

  async sendMessage(
    roomId: string,
    senderId: string,
    content: string,
    type = 'text',
    mediaUrl?: string,
  ) {
    await this.ensureMember(roomId, senderId);

    return this.prisma.chatMessage.create({
      data: {
        chatRoomId: roomId,
        senderId,
        content,
        type,
        mediaUrl: mediaUrl || null,
      },
      include: {
        sender: { select: { id: true, name: true, avatar: true } },
      },
    });
  }

  async leaveRoom(roomId: string, userId: string) {
    await this.ensureMember(roomId, userId);

    await this.prisma.chatRoomMember.delete({
      where: { chatRoomId_userId: { chatRoomId: roomId, userId } },
    });

    const remaining = await this.prisma.chatRoomMember.count({
      where: { chatRoomId: roomId },
    });

    if (remaining === 0) {
      await this.prisma.chatRoom.delete({ where: { id: roomId } });
    }

    return { success: true };
  }

  private async ensureMember(roomId: string, userId: string) {
    const membership = await this.prisma.chatRoomMember.findUnique({
      where: { chatRoomId_userId: { chatRoomId: roomId, userId } },
    });
    if (!membership) {
      throw new ForbiddenException('Not a member of this chat room');
    }
  }
}
