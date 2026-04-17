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

  @Get('/by-year-topic/:yearTopicId')
  async getPracticesByYearTopic(@Param('yearTopicId') yearTopicId: string) {
    return await this.service.getPracticesByYearTopic(yearTopicId);
  }
}