import {
  Controller,
  Post,
  Body,
  Param,
  ParseIntPipe,
  Get,
  NotFoundException,
} from '@nestjs/common';

import { YearService } from './year.service';
import { CreateYearDto } from './dto/year.dto';
import { AddYearInput } from './types/types';
import { UseGuards, Req } from '@nestjs/common';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';

@Controller('api/years')
export class YearController {
  constructor(
    private readonly service: YearService,
  ) { }

  @UseGuards(JwtAuthGuard)
  @Get()
  async getYears(@Req() req) {
    return await this.service.getYears();
  }

  @UseGuards(JwtAuthGuard)
  @Post()
  async addYear(@Body() dto: CreateYearDto) {
    const input: AddYearInput = {
      year: dto.year,
      totalDays: dto.totalDays
    };

    return await this.service.create(input);
  }

  @UseGuards(JwtAuthGuard)
  @Get('by-year/:year')
  async getYearByYear(@Param('year') yearName: string) {
    const year = await this.service.getYearByYear(yearName);
    if (!year) {
      throw new NotFoundException(`Year with name \"${yearName}\" not found`);
    }
    return year;
  }

  @UseGuards(JwtAuthGuard)
  @Get('by-id/:id')
  async getYearById(@Param('id', ParseIntPipe) id: number) {
    return await this.service.getYearById(id);
  }

  @UseGuards(JwtAuthGuard)
  @Get('closed')
  async getClosedYears() {
    const years = await this.service.getYears();
    return years.filter(year => year.closed);
  }

  @UseGuards(JwtAuthGuard)
  @Get('opened')
  async getOpenedYear() {
    return await this.service.getOpenedYear();
  }

  @UseGuards(JwtAuthGuard)
  @Get('by-topic/:topicId')
  async getYearsByTopic(@Param('topicId') topicId: string) {
    return await this.service.getYearsByTopic(topicId);
  }
}