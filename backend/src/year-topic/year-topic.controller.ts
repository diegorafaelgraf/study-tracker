import {
  Controller,
  Post,
  Body,
  Param,
  ParseIntPipe,
  Get
} from '@nestjs/common';

import { YearTopicService } from './year-topic.service';
import { CreateYearTopicDto } from './dto/year-topic.dto';
import { AddYearTopicInput } from './types/types';
import { UseGuards, Req } from '@nestjs/common';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';

@Controller('api/year-topic')
export class YearTopicController {
  constructor(
    private readonly service: YearTopicService,
  ) { }

  @UseGuards(JwtAuthGuard)
  @Post()
  async addYearTopic(@Body() dto: CreateYearTopicDto, @Req() req: any) {
    const input: AddYearTopicInput = {
      topicId: dto.topicId,
      goalMinutes: dto.goalMinutes
    };

    return await this.service.create(input, req.user.userId);
  }

  @UseGuards(JwtAuthGuard)
  @Get(':id')
  async getYearTopicById(@Param('id', ParseIntPipe) id: number, @Req() req: any) {
    return await this.service.getYearTopicById(id, req.user.userId);
  }
}