import { Injectable } from '@nestjs/common';
import { CreatePostDto } from './dto/create-post.dto';
import { UpdatePostDto } from './dto/update-post.dto';
import { PrismaService } from '../prisma/prisma.service';
@Injectable()
export class PostsService {
  constructor(private readonly prisma: PrismaService) {}
  async create(createPostDto: CreatePostDto) {
    try{
     return await this.prisma.post.create({
       data: {
         content: createPostDto.content,
         userId: createPostDto.userId,
         image: createPostDto.image ?? '',
       }
     });
    
    } catch (error) {
      throw new Error('Failed to create post');
    }
  }

  async findUserPosts(userId: number) {
    try {
      return await this.prisma.post.findMany({
        where: { userId },
        include: {
          author: {
            select: {
              id: true,
              name: true,
              profile: true,
            },
          },
        },
      });
    } catch (error) {
      throw new Error('Failed to retrieve user posts');
    }
  }

  async searchBar(query:{ search?:string}){
    const { search } = query;
    const select = {
      id: true,
      content: true,
      image: true,
      userId: true,
      author:true
    };
    if (!search) {
      return await this.prisma.post.findMany({ select });
    }
  
    return await this.prisma.post.findMany({
      where: {
        OR: [
          { content: { contains: search, mode: 'insensitive' } },
          
        ],
      },
      select,
    });
  }

  async findAll() {
    try{
      return await this.prisma.post.findMany({
        orderBy: { createdAt: 'desc' },
        include: {
          author: {
            select: {
              id: true,
              name: true,
              profile: true,
            },
          },
        },
      });
    }
    catch(error){
      throw new Error('Failed to retrieve posts');
    }
  }

  findOne(id: number) {
    return `This action returns a #${id} post`;
  }

  update(id: number, updatePostDto: UpdatePostDto) {
    return `This action updates a #${id} post`;
  }

  async remove(id: number) {
    try {
      return await this.prisma.post.delete({
        where: { id },
      });
    } catch (error) {
      throw new Error('Failed to delete post');
    }
  }
}
