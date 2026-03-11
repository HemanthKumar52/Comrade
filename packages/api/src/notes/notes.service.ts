import {
  Injectable,
  NotFoundException,
  ForbiddenException,
} from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateNoteDto } from './dto/create-note.dto';
import { UpdateNoteDto } from './dto/update-note.dto';

@Injectable()
export class NotesService {
  constructor(private prisma: PrismaService) {}

  async create(userId: string, dto: CreateNoteDto) {
    return this.prisma.note.create({
      data: {
        userId,
        type: dto.type,
        title: dto.title,
        content: dto.content,
        tripId: dto.tripId || undefined,
        tags: dto.tags || [],
        geoPoint: dto.geoPoint || undefined,
        folderId: dto.folderId || undefined,
      },
    });
  }

  async findAll(
    userId: string,
    filters: {
      type?: string;
      tripId?: string;
      folderId?: string;
      search?: string;
    },
    take = 20,
    skip = 0,
  ) {
    const where: any = { userId };

    if (filters.type) {
      where.type = filters.type;
    }
    if (filters.tripId) {
      where.tripId = filters.tripId;
    }
    if (filters.folderId) {
      where.folderId = filters.folderId;
    }
    if (filters.search) {
      where.OR = [
        { title: { contains: filters.search, mode: 'insensitive' } },
        { content: { contains: filters.search, mode: 'insensitive' } },
      ];
    }

    const [data, total] = await Promise.all([
      this.prisma.note.findMany({
        where,
        orderBy: { createdAt: 'desc' },
        take,
        skip,
        include: {
          folder: { select: { id: true, name: true } },
        },
      }),
      this.prisma.note.count({ where }),
    ]);

    return {
      data,
      total,
      page: Math.floor(skip / take) + 1,
      limit: take,
    };
  }

  async findOne(id: string, userId: string) {
    const note = await this.prisma.note.findUnique({
      where: { id },
      include: {
        folder: { select: { id: true, name: true } },
        trip: { select: { id: true, title: true, destination: true } },
      },
    });

    if (!note) {
      throw new NotFoundException('Note not found');
    }
    if (note.userId !== userId) {
      throw new ForbiddenException('Access denied');
    }

    return note;
  }

  async update(id: string, userId: string, dto: UpdateNoteDto) {
    const note = await this.prisma.note.findUnique({ where: { id } });
    if (!note) {
      throw new NotFoundException('Note not found');
    }
    if (note.userId !== userId) {
      throw new ForbiddenException('Access denied');
    }

    return this.prisma.note.update({
      where: { id },
      data: {
        ...(dto.type !== undefined && { type: dto.type }),
        ...(dto.title !== undefined && { title: dto.title }),
        ...(dto.content !== undefined && { content: dto.content }),
        ...(dto.tags !== undefined && { tags: dto.tags }),
        ...(dto.geoPoint !== undefined && { geoPoint: dto.geoPoint }),
        ...(dto.folderId !== undefined && { folderId: dto.folderId }),
      },
    });
  }

  async remove(id: string, userId: string) {
    const note = await this.prisma.note.findUnique({ where: { id } });
    if (!note) {
      throw new NotFoundException('Note not found');
    }
    if (note.userId !== userId) {
      throw new ForbiddenException('Access denied');
    }

    return this.prisma.note.delete({ where: { id } });
  }

  // ── Folders ──────────────────────────────────────────────────

  async createFolder(userId: string, name: string, tripId?: string) {
    return this.prisma.noteFolder.create({
      data: {
        userId,
        name,
        tripId: tripId || undefined,
      },
    });
  }

  async listFolders(userId: string) {
    return this.prisma.noteFolder.findMany({
      where: { userId },
      orderBy: { createdAt: 'desc' },
      include: {
        _count: { select: { notes: true } },
      },
    });
  }

  async removeFolder(id: string, userId: string) {
    const folder = await this.prisma.noteFolder.findUnique({ where: { id } });
    if (!folder) {
      throw new NotFoundException('Folder not found');
    }
    if (folder.userId !== userId) {
      throw new ForbiddenException('Access denied');
    }

    // Unlink notes from this folder before deleting
    await this.prisma.note.updateMany({
      where: { folderId: id },
      data: { folderId: null },
    });

    return this.prisma.noteFolder.delete({ where: { id } });
  }
}
