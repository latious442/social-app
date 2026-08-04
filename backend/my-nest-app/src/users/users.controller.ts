import {
  BadRequestException,
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
  Query,
  Req,
  Res,
  UploadedFile,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';
import {UploadProfileDto} from './dto/upload-profile.dto';
import type { Request } from 'express';
import * as express from 'express';
import { UsersService } from './users.service';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { JwtAuthGuard } from '../auth/jwt-auth/jwt-auth.guard';
import { FileInterceptor } from '@nestjs/platform-express/multer/interceptors/file.interceptor';
import { CloudinaryService } from 'src/cloudinary/cloudinary.service';
import { Multer } from 'multer';
type AuthenticatedRequest = Request & {
  user: {
    id: number;
    email: string;
    name: string;
  };
};

@Controller('users')
export class UsersController {
  constructor(
    private readonly usersService: UsersService,
    private readonly cloudinaryService: CloudinaryService,
  ) {}

  @Post()
  create(@Body() createUserDto: CreateUserDto) {
    return this.usersService.register(createUserDto);
  }

  @Post('login')
  async login(
    @Body('email') email: string,
    @Body('password') password: string,
    @Res({ passthrough: true }) response: express.Response,
  ) {
    const token = await this.usersService.login(email, password);

    response.clearCookie('vip');
    response.cookie('jwt', token.access_token, {
      httpOnly: true,
      sameSite: 'lax',
      secure: false,
      maxAge: 24 * 60 * 60 * 1000,
    });

    return token;
  }

  @Get('search')
  searchBar(@Query() query: { search?: string }) {
    return this.usersService.searchBar(query);
  }

  @Delete('delete/:id')
  delete(@Param('id') id: string) {
    return this.usersService.deleteUser(+id);
  }

  @UseGuards(JwtAuthGuard)
  @Get('me')
  me(@Req() req: AuthenticatedRequest) {
    return req.user;
  }

  @Get()
  findAll() {
    return this.usersService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.usersService.findOne(+id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateUserDto: UpdateUserDto) {
    return this.usersService.update(+id, updateUserDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.usersService.remove(+id);
  }

  @Post('upload-profile')
@UseInterceptors(FileInterceptor('file'))
async uploadProfile(
  @UploadedFile() file: Express.Multer.File,
  @Body('id') id: string,
) {
  if (!file) {
    throw new BadRequestException('Image file is required');
  }

  // Upload image to Cloudinary
  const uploadedImage = await this.cloudinaryService.uploadFile(file);

  // Save URL in database
  const user = await this.usersService.addImg(
    Number(id),
    uploadedImage.secure_url ?? uploadedImage.url,
  );

  return {
    message: 'Profile image updated successfully',
    profile: uploadedImage.secure_url,
    user,
  };
}
}
