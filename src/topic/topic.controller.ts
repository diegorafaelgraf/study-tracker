import {
  Controller,
  Post,
  Body,
  Param,
  ParseIntPipe,
  Get,
  NotFoundException,
} from '@nestjs/common';

import { TopicService } from './topic.service';
import { CreateTopicDto } from './dto/topic.dto';
import { AddTopicInput } from './types/types';

@Controller('api/topics')
export class TopicController {
  constructor(
    private readonly service: TopicService,
  ) { }

  @Post()
  async addTopic(@Body() dto: CreateTopicDto) {
    const input: AddTopicInput = {
      name: dto.name
    };

    return await this.service.create(input);
  }

  @Get('by-name/:name')
  async getTopicByName(@Param('name') name: string) {
    const topic = await this.service.getTopicByName(name);
    if (!topic) {
      throw new NotFoundException(`Topic with name \"${name}\" not found`);
    }
    return topic;
  }

  @Get(':id')
  async getTopicById(@Param('id', ParseIntPipe) id: number) {
    return await this.service.getTopicById(id);
  }

}