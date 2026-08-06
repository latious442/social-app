import { Injectable } from '@nestjs/common';
import { CreateMessageDto } from './dto/create-message.dto';
import { UpdateMessageDto } from './dto/update-message.dto';
import { PrismaService } from 'src/prisma/prisma.service';

@Injectable()
export class MessageService {
  constructor(private readonly prisma: PrismaService) {}
  async create(createMessageDto: CreateMessageDto) {
    try{
      return await this.prisma.message.create({
        data: {
          msg: createMessageDto.msg,
          senderId: createMessageDto.senderId,
          receiverId: createMessageDto.receiverId,
        }
      });
    } catch (error) {
      throw new Error('Failed to create message');
    }
  }

  async findConversation(userId: number, otherId: number) {
    return this.prisma.message.findMany({
      where: {
        OR: [
          { senderId: userId, receiverId: otherId },
          { senderId: otherId, receiverId: userId },
        ],
      },
      orderBy: { createdAt: 'asc' },
    });
  }

  findAll() {
    return this.prisma.message.findMany({ orderBy: { createdAt: 'desc' } });
  }

  findOne(id: number) {
    return `This action returns a #${id} message`;
  }

  update(id: number, updateMessageDto: UpdateMessageDto) {
    return `This action updates a #${id} message`;
  }

  remove(id: number) {
    return `This action removes a #${id} message`;
  }
}
