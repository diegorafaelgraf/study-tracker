import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { NotFoundException } from '@nestjs/common/exceptions';

import { Model } from 'mongoose';

import { YearTopic, YearTopicDocument } from './schemas/year-topic.schema';
import { AddYearTopicInput } from './types/types';


@Injectable()
export class YearTopicService {
  constructor(
    @InjectModel(YearTopic.name) private yearTopicModel: Model<YearTopicDocument>,
  ) { }

  // Add a new YearTopic to the database
  async create(data: AddYearTopicInput): Promise<YearTopicDocument> {
    return this.yearTopicModel.create(data);
  }

  // Get a Topics by its year
  async getTopicsByYear(year: string): Promise<YearTopicDocument | null> {
    return this.yearTopicModel.find({ year }).exec();
  }

  // Get a YearTopic by its ID
  async getYearTopicById(id: number): Promise<YearTopicDocument | null> {
    return this.yearTopicModel.findById(id).exec();
  }
}