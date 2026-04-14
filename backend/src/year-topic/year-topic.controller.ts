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

  // @Get('topics-by-year/:yearId')
  // async getTopicsByYear(@Param('yearId') yearId: string) {
  //   const topics = await this.service.getTopicsByYear(yearId);
  //   if (!topics || topics.length === 0) {
  //     throw new NotFoundException(`Topics with yearId \"${yearId}\" not found`);
  //   }
  //   return topics;
  // }

  @Get(':id')
  async getYearTopicById(@Param('id', ParseIntPipe) id: number) {
    return await this.service.getYearTopicById(id);
  }

}