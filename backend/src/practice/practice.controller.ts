import {
  Controller,
  Post,
  Body,
  Param,
  Get,
} from '@nestjs/common';

import { UseGuards, Req } from '@nestjs/common';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';

import { PracticeService } from './practice.service';
import { CreatePracticeDto } from './dto/practice.dto';
import { AddPracticeInput } from './types/types';

@Controller('api/practice')
export class PracticeController {
  constructor(
    private readonly service: PracticeService,
  ) { }

  @UseGuards(JwtAuthGuard)
  @Post()
  async addPractice(@Body() dto: CreatePracticeDto, @Req() req: any) {
    const input: AddPracticeInput = {
      yearTopicId: dto.yearTopicId,
      date: dto.date,
      durationMinutes: dto.durationMinutes
    };

    return await this.service.create(input, req.user.userId);
  }

  @UseGuards(JwtAuthGuard)
  @Get('/by-year-topic/:yearTopicId')
  async getPracticesByYearTopic(@Param('yearTopicId') yearTopicId: string, @Req() req: any) {
    return await this.service.getPracticesByYearTopic(yearTopicId, req.user.userId);
  }
}