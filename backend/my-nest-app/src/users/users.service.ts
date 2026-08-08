import {
  BadRequestException,
  ConflictException,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { PrismaService } from '../prisma/prisma.service';
import { JwtService } from '@nestjs/jwt';
import { EmailService } from '../email/email.service';
import bcrypt from 'bcrypt';
@Injectable()
export class UsersService {
  private otps = new Map<string, { code: string; expiresAt: number }>();

  constructor(
    private readonly prisma: PrismaService,
    private readonly jwtService: JwtService,
    private readonly emailService: EmailService,
  ) {}

  async sendOtp(email: string) {
    if (!email) {
      throw new BadRequestException('Email is required');
    }

    const code = String(Math.floor(100000 + Math.random() * 900000));
    this.otps.set(email, {
      code,
      expiresAt: Date.now() + 5 * 60 * 1000,
    });

    await this.emailService.sendOtpEmail(email, code);

    return { message: 'OTP sent to your email' };
  }

  verifyOtp(email: string, code: string) {
    const stored = this.otps.get(email);

    if (!stored) {
      throw new UnauthorizedException('No OTP found. Please request a new one.');
    }

    if (Date.now() > stored.expiresAt) {
      this.otps.delete(email);
      throw new UnauthorizedException('OTP has expired. Please request a new one.');
    }

    if (stored.code !== code) {
      throw new UnauthorizedException('Invalid OTP code');
    }

    this.otps.delete(email);
    return { message: 'OTP verified successfully' };
  }

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
