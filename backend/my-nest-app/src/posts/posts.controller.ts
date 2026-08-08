import { Controller, Get, Post, Body, Patch, Param, Delete, UploadedFile, UseInterceptors } from '@nestjs/common';
import { PostsService } from './posts.service';
import { CreatePostDto } from './dto/create-post.dto';
import { UpdatePostDto } from './dto/update-post.dto';
import { FileInterceptor } from '@nestjs/platform-express/multer/interceptors/file.interceptor';
import { CloudinaryService } from 'src/cloudinary/cloudinary.service';

@Controller('posts')
export class PostsController {
  constructor(
    private readonly postsService: PostsService,
    private readonly cloudinaryService: CloudinaryService,
  ) {}

  @Post()
  @UseInterceptors(FileInterceptor('image'))
  async create(
    @Body() createPostDto: CreatePostDto,
    @UploadedFile() file?: Express.Multer.File,
  ) {
    let image = '';

    if (file) {
      const uploaded = await this.cloudinaryService.uploadFile(file);
      image = uploaded.secure_url ?? uploaded.url;
    }

    return this.postsService.create({
      content: createPostDto.content,
      userId: Number(createPostDto.userId),
      image,
    });
  }

  @Get()
  findAll() {
    return this.postsService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.postsService.findOne(+id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updatePostDto: UpdatePostDto) {
    return this.postsService.update(+id, updatePostDto);
  }

  @Delete('del/:id')
  remove(@Param('id') id: string) {
    return this.postsService.remove(+id);
  }

  @Get('user/:userId')
  findUserPosts(@Param('userId') userId: string) {
    return this.postsService.findUserPosts(+userId);
  }
}
