import { Module } from '@nestjs/common';
import { PostsService } from './posts.service';
import { PostsController } from './posts.controller';
import { PrismaModule } from 'src/prisma/prisma.module';
import { CloudinaryModule } from 'src/cloudinary/cloudinary.module';

@Module({
  controllers: [PostsController],
  providers: [PostsService],
  imports: [PrismaModule, CloudinaryModule],
  exports: [PostsService],
})

export class PostsModule {}
