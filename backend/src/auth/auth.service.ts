import {
  Injectable,
  UnauthorizedException,
  ConflictException,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt';
import type { Response } from 'express';
import { UsersService } from '../users/users.service.js';
import { RegisterDto } from './dto/register.dto.js';
import { LoginDto } from './dto/login.dto.js';
import { setAuthCookie, clearAuthCookie } from './common/cookie.util.js';

@Injectable()
export class AuthService {
  constructor(
    private readonly usersService: UsersService,
    private readonly jwtService: JwtService,
  ) {}

  async register(registerDto: RegisterDto, res: Response) {
    const existing = await this.usersService.findByEmailWithPassword(registerDto.email);
    if (existing) {
      throw new ConflictException('A user with this email already exists');
    }

    const saltRounds = 10;
    const hashedPassword = await bcrypt.hash(registerDto.password, saltRounds);

    const newUser = await this.usersService.create({
      name: registerDto.name,
      email: registerDto.email,
      password: hashedPassword,
    });

    const payload = { sub: (newUser as any)._id.toString(), email: newUser.email };
    const token = await this.jwtService.signAsync(payload);

    setAuthCookie(res, token);

    return {
      message: 'Registration successful',
      user: newUser.toJSON ? newUser.toJSON() : newUser,
    };
  }

  async login(loginDto: LoginDto, res: Response) {
    const user = await this.usersService.findByEmailWithPassword(loginDto.email);
    if (!user) {
      throw new UnauthorizedException('Invalid email or password');
    }

    const isMatch = await bcrypt.compare(loginDto.password, user.password);
    if (!isMatch) {
      throw new UnauthorizedException('Invalid email or password');
    }

    const payload = { sub: (user as any)._id.toString(), email: user.email };
    const token = await this.jwtService.signAsync(payload);

    setAuthCookie(res, token);

    const safeUser = user.toJSON ? user.toJSON() : user;

    return {
      message: 'Login successful',
      user: safeUser,
    };
  }

  async logout(res: Response) {
    clearAuthCookie(res);
    return { message: 'Logged out successfully' };
  }
}
