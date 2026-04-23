import {
  Controller,
  Post,
  Body,
  Param,
  ParseIntPipe,
  Get,
  NotFoundException,
} from '@nestjs/common';

import { UseGuards } from '@nestjs/common';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';

import { TopicService } from './topic.service';
import { CreateTopicDto } from './dto/topic.dto';
import { AddTopicInput } from './types/types';

@Controller('api/topics')
export class TopicController {
  constructor(
    private readonly service: TopicService,
  ) { }

  @UseGuards(JwtAuthGuard)
  @Post()
  async addTopic(@Body() dto: CreateTopicDto) {
    const input: AddTopicInput = {
      name: dto.name
    };

    return await this.service.create(input);
  }

  @UseGuards(JwtAuthGuard)
  @Get()
  async getTopics() {
    return await this.service.getTopics();
  }

  @UseGuards(JwtAuthGuard)
  @Get('by-name/:name')
  async getTopicByName(@Param('name') name: string) {
    const topic = await this.service.getTopicByName(name);
    if (!topic) {
      throw new NotFoundException(`Topic with name \"${name}\" not found`);
    }
    return topic;
  }

  @UseGuards(JwtAuthGuard)
  @Get('by-id/:id')
  async getTopicById(@Param('id', ParseIntPipe) id: number) {
    return await this.service.getTopicById(id);
  }

  @UseGuards(JwtAuthGuard)
  @Get('by-year/:yearId')
  async getTopicsByYear(@Param('yearId') yearId: string) {
    return await this.service.getTopicsByYear(yearId);
  }

  @UseGuards(JwtAuthGuard)
  @Get('by-current-year')
  async getTopicsCurrentYear() {
    return await this.service.getTopicsCurrentYear();
  }
}