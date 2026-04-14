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

@Controller('api/years')
export class YearController {
  constructor(
    private readonly service: YearService,
  ) { }

  @Get()
  async getYears() {
    return await this.service.getYears();
  }

  @Post()
  async addYear(@Body() dto: CreateYearDto) {
    const input: AddYearInput = {
      year: dto.year,
      totalDays: dto.totalDays
    };

    return await this.service.create(input);
  }

  @Get('by-year/:year')
  async getYearByYear(@Param('year') yearName: string) {
    const year = await this.service.getYearByYear(yearName);
    if (!year) {
      throw new NotFoundException(`Year with name \"${yearName}\" not found`);
    }
    return year;
  }

  @Get(':id')
  async getYearById(@Param('id', ParseIntPipe) id: number) {
    return await this.service.getYearById(id);
  }

}