import {
  Controller,
  Post,
  Body,
  Param,
  ParseIntPipe,
  Get,
  NotFoundException,
} from '@nestjs/common';

import { PracticeService } from './practice.service';
import { CreatePracticeDto } from './dto/practice.dto';
import { AddPracticeInput } from './types/types';

@Controller('api/practice')
export class PracticeController {
  constructor(
    private readonly service: PracticeService,
  ) { }

  @Post()
  async addPractice(@Body() dto: CreatePracticeDto) {
    const input: AddPracticeInput = {
      yearTopicId: dto.yearTopicId,
      date: dto.date,
      durationMinutes: dto.durationMinutes
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