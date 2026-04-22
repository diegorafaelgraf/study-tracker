import {
  Controller,
  Post,
  Body,
  Param,
  ParseIntPipe,
  Get,
  NotFoundException,
} from '@nestjs/common';

import { YearTopicService } from './year-topic.service';
import { CreateYearTopicDto } from './dto/year-topic.dto';
import { AddYearTopicInput } from './types/types';

@Controller('api/year-topic')
export class YearTopicController {
  constructor(
    private readonly service: YearTopicService,
  ) { }

  @Post()
  async addYearTopic(@Body() dto: CreateYearTopicDto) {
    const input: AddYearTopicInput = {
      topicId: dto.topicId,
      goalMinutes: dto.goalMinutes
    };

    return await this.service.create(input);
  }

  @Get(':id')
  async getYearTopicById(@Param('id', ParseIntPipe) id: number) {
    return await this.service.getYearTopicById(id);
  }

}