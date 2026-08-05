import {
  ConflictException,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { PrismaService } from '../prisma/prisma.service';
import { JwtService } from '@nestjs/jwt';
import bcrypt from 'bcrypt';
@Injectable()
export class UsersService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly jwtService: JwtService,
  ) {}

  async register(createUserDto: CreateUserDto) {
    try {
      return await this.prisma.user.create({
        data: {
          name: createUserDto.name,
          email: createUserDto.email,
          password: await bcrypt.hash(createUserDto.password, 10), 
        },
      });
    } catch (error) {
      throw new ConflictException('Email is already registered');
    }
  }

  async login(email: string, password: string) {
    const user = await this.prisma.user.findUnique({
      where: { email },
    });

    if (!user || !(await bcrypt.compare(password, user.password))) {
      throw new UnauthorizedException('Invalid email or password');
    }

    const accessToken = this.generateToken({
      id: user.id,
      email: user.email,
      name: user.name,
    });

    return {
      access_token: accessToken,
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
        profile: user.profile,
      },
    };
  }

  async deleteUser(id: number) {
    return await this.prisma.user.delete({
      where: { id },
    });
  }

  async findAll() {
    return await this.prisma.user.findMany();
  }

  async findFriends(id: number) {
    return await this.prisma.user.findMany({
      where: {
        NOT: {
          id,
        },
      },
      select: {
        id: true,
        name: true,
        email: true,
        profile: true,
      },
    });
  }

  async findOne(id: number) {
    return await this.prisma.user.findUnique({
      where: { id },
      select: {
        id: true,
        name: true,
        email: true,
        profile: true,
      },
    });
  }

  async searchBar(query:{ search?:string}){
    const { search } = query;
    const select = {
      id: true,
      name: true,
      email: true,
      profile: true,
    };
    if (!search) {
      return await this.prisma.user.findMany({ select });
    }
  
    return await this.prisma.user.findMany({
      where: {
        OR: [
          { name: { contains: search, mode: 'insensitive' } },
          
        ],
      },
      select,
    });
  }

  async addImg(id: number, profile: string) {
    return await this.prisma.user.update({
      where: { id },
      data: { profile },
    });
  }

  update(id: number, updateUserDto: UpdateUserDto) {
    return `This action updates a #${id} user`;
  }

  remove(id: number) {
    return `This action removes a #${id} user`;
  }

  private generateToken(user: { id: number; email: string; name: string }): string {
    const payload = {
      sub: user.id,
      email: user.email,
      name: user.name,
    };

    return this.jwtService.sign(payload);
  }
}
