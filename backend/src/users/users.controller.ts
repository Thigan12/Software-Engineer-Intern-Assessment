import {
  Controller,
  Get,
  Patch,
  Delete,
  Param,
  Body,
  UseGuards,
  Req,
  Res,
  HttpCode,
  HttpStatus,
} from '@nestjs/common';
import type { Request, Response } from 'express';
import { UsersService } from './users.service.js';
import { UpdateUserDto } from './dto/update-user.dto.js';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard.js';
import { clearAuthCookie } from '../auth/common/cookie.util.js';

@Controller('users')
@UseGuards(JwtAuthGuard)
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Get()
  async getAllUsers() {
    return this.usersService.findAll();
  }

  @Get('me')
  async getMyProfile(@Req() req: Request) {
    const user = req.user as any;
    return this.usersService.findById(user.id || user._id);
  }

  @Patch('me')
  async updateMyProfile(
    @Req() req: Request,
    @Body() updateUserDto: UpdateUserDto,
  ) {
    const user = req.user as any;
    return this.usersService.update(user.id || user._id, updateUserDto);
  }

  @Delete('me')
  @HttpCode(HttpStatus.OK)
  async deleteMyAccount(
    @Req() req: Request,
    @Res({ passthrough: true }) res: Response,
  ) {
    const user = req.user as any;
    const result = await this.usersService.delete(user.id || user._id);
    clearAuthCookie(res);
    return result;
  }

  @Get(':id')
  async getUserById(@Param('id') id: string) {
    return this.usersService.findById(id);
  }
}
