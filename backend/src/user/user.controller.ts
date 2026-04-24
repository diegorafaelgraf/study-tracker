import { Controller, Get } from '@nestjs/common';
import { UserService } from './user.service';
import { Body, Post, UseGuards, Req, ForbiddenException, BadRequestException } from '@nestjs/common';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';

@Controller('api/users')
export class UserController {
  constructor(private readonly userService: UserService) { }

  @UseGuards(JwtAuthGuard)
  @Post()
  createUser(@Body() body, @Req() req) {
    if (req.user.role !== 'ADMIN') {
      throw new ForbiddenException('No autorizado');
    }

    return this.userService.createUser(body);
  }

  @UseGuards(JwtAuthGuard)
  @Post('change-password')
  async changePassword(@Body() body: { oldPassword: string; newPassword: string }, @Req() req) {
    try {
      return await this.userService.changePassword(req.user.userId, body.oldPassword, body.newPassword);
    } catch (error: any) {
      throw new BadRequestException(error.message);
    }
  }
}

