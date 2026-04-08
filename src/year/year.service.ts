import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { NotFoundException } from '@nestjs/common/exceptions';

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
    return this.yearModel.create(data);
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