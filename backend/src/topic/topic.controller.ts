import {
  Controller,
  Post,
  Body,
  Param,
  ParseIntPipe,
  Get,
  NotFoundException,
} from '@nestjs/common';

import { UseGuards, Req } from '@nestjs/common';
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
  async addTopic(@Body() dto: CreateTopicDto, @Req() req: any) {
    const input: AddTopicInput = {
      name: dto.name
    };

    return await this.service.create(input, req.user.userId);
  }

  @UseGuards(JwtAuthGuard)
  @Get()
  async getTopics(@Req() req: any) {
    return await this.service.getTopics(req.user.userId);
  }

  @UseGuards(JwtAuthGuard)
  @Get('by-name/:name')
  async getTopicByName(@Param('name') name: string, @Req() req: any) {
    const topic = await this.service.getTopicByName(name, req.user.userId);
    if (!topic) {
      throw new NotFoundException(`Topic with name \"${name}\" not found`);
    }
    return topic;
  }

  @UseGuards(JwtAuthGuard)
  @Get('by-id/:id')
  async getTopicById(@Param('id') id: string, @Req() req: any) {
    return await this.service.getTopicById(id, req.user.userId);
  }

  @UseGuards(JwtAuthGuard)
  @Get('by-year/:yearId')
  async getTopicsByYear(@Param('yearId') yearId: string, @Req() req: any) {
    return await this.service.getTopicsByYear(yearId, req.user.userId);
  }

  @UseGuards(JwtAuthGuard)
  @Get('by-current-year')
  async getTopicsCurrentYear(@Req() req: any) {
    return await this.service.getTopicsCurrentYear(req.user.userId);
  }
}