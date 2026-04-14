import { Injectable, BadRequestException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';

import { Model } from 'mongoose';

import { Year, YearDocument } from './schemas/year.schema';
import { AddYearInput } from './types/types';


@Injectable()
export class YearService {
  constructor(
    @InjectModel(Year.name) private yearModel: Model<YearDocument>,
  ) { }

  // Add a new Year to the database
  async create(data: AddYearInput): Promise<YearDocument> {
    const existingOpenYear = await this.yearModel.findOne({
      status: 'open',
    });
    if (existingOpenYear) {
      throw new BadRequestException(
        'Ya existe un año abierto',
      );
    }
    return this.yearModel.create({ ...data, closed: false });
  }

  // Get all Years
  async getYears(): Promise<YearDocument[]> {
    return this.yearModel.find().exec();
  }

  // Get a Year by its year
  async getYearByYear(year: string): Promise<YearDocument | null> {
    return this.yearModel.findOne({ year }).exec();
  }

  // Get a Year by its ID
  async getYearById(id: number): Promise<YearDocument | null> {
    return this.yearModel.findById(id).exec();
  }
}