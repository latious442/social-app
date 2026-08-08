import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
  UploadedFile,
  UseInterceptors,
} from '@nestjs/common';
import { MessageService } from './message.service';
import { CreateMessageDto } from './dto/create-message.dto';
import { UpdateMessageDto } from './dto/update-message.dto';
import { FileInterceptor } from '@nestjs/platform-express/multer/interceptors/file.interceptor';
import { CloudinaryService } from 'src/cloudinary/cloudinary.service';

@Controller('messages')
export class MessageController {
  constructor(
    private readonly messageService: MessageService,
    private readonly cloudinaryService: CloudinaryService,
  ) {}

  @Post('/:senderId/:receiverId')
  @UseInterceptors(FileInterceptor('file'))
  async create(
    @Param('senderId') senderId: string,
    @Param('receiverId') receiverId: string,
    @Body('msg') msg: string,
    @UploadedFile() file: Express.Multer.File,
  ) {
    let pht = '';

    if (file) {
      const uploaded = await this.cloudinaryService.uploadFile(file);
      pht = uploaded.secure_url ?? uploaded.url;
    }

    return this.messageService.create({
      msg: msg ?? '',
      senderId: +senderId,
      receiverId: +receiverId,
      pht,
    });
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
