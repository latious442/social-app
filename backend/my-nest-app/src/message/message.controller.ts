import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { MessageService } from './message.service';
import { CreateMessageDto } from './dto/create-message.dto';
import { UpdateMessageDto } from './dto/update-message.dto';

@Controller('messages')
export class MessageController {
  constructor(private readonly messageService: MessageService) {}

  @Post('/:senderId/:receiverId')
  create(
    @Param('senderId') senderId: string,
    @Param('receiverId') receiverId: string,
    @Body() createMessageDto: CreateMessageDto) {
    return this.messageService.create({ ...createMessageDto, senderId: +senderId, receiverId: +receiverId });
  }

  @Get()
  findAll() {
    return this.messageService.findAll();
  }

  @Get('conversation/:userId/:otherId')
  conversation(
    @Param('userId') userId: string,
    @Param('otherId') otherId: string,
  ) {
    return this.messageService.findConversation(+userId, +otherId);
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.messageService.findOne(+id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateMessageDto: UpdateMessageDto) {
    return this.messageService.update(+id, updateMessageDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.messageService.remove(+id);
  }
}
