import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { UsersModule } from './users/users.module';
import { PrismaModule } from './prisma/prisma.module';
import { PostsModule } from './posts/posts.module';
import { AuthModule } from './auth/auth.module';
import { MessageModule } from './message/message.module';

@Module({
  imports: [UsersModule, PrismaModule, PostsModule, AuthModule, MessageModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
