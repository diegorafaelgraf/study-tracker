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
  async getYears(@Req() req: any) {
    return await this.service.getYears(req.user.userId);
  }

  @UseGuards(JwtAuthGuard)
  @Post()
  async addYear(@Body() dto: CreateYearDto, @Req() req: any) {
    const input: AddYearInput = {
      year: dto.year,
      totalDays: dto.totalDays
    };

    return await this.service.create(input, req.user.userId);
  }

  @UseGuards(JwtAuthGuard)
  @Get('by-year/:year')
  async getYearByYear(@Param('year') yearName: string, @Req() req: any) {
    const year = await this.service.getYearByYear(yearName, req.user.userId);
    if (!year) {
      throw new NotFoundException(`Year with name \"${yearName}\" not found`);
    }
    return year;
  }

  @UseGuards(JwtAuthGuard)
  @Get('by-id/:id')
  async getYearById(@Param('id') id: string, @Req() req: any) {
    return await this.service.getYearById(id, req.user.userId);
  }

  @UseGuards(JwtAuthGuard)
  @Get('closed')
  async getClosedYears(@Req() req: any) {
    const years = await this.service.getYears(req.user.userId);
    return years.filter(year => year.closed);
  }

  @UseGuards(JwtAuthGuard)
  @Get('opened')
  async getOpenedYear(@Req() req: any) {
    return await this.service.getOpenedYear(req.user.userId);
  }

  @UseGuards(JwtAuthGuard)
  @Get('by-topic/:topicId')
  async getYearsByTopic(@Param('topicId') topicId: string, @Req() req: any) {
    return await this.service.getYearsByTopic(topicId, req.user.userId);
  }
}