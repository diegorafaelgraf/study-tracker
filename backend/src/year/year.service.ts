import { Injectable, BadRequestException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';

import { Model } from 'mongoose';

import { Year, YearDocument } from './schemas/year.schema';
import { YearTopic, YearTopicDocument } from '../year-topic/schemas/year-topic.schema';
import { AddYearInput } from './types/types';


@Injectable()
export class YearService {
  constructor(
    @InjectModel(Year.name) private yearModel: Model<YearDocument>,
    @InjectModel(YearTopic.name) private yearTopicModel: Model<YearTopicDocument>,
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
  async getOpenedYear() {
    return this.yearModel.findOne({ closed: false });
  }

  // Get a Year by its ID
  async getYearById(id: number): Promise<YearDocument | null> {
    return this.yearModel.findById(id).exec();
  }

  // Get all years by topic
  async getYearsByTopic(topicId: string): Promise<YearDocument[]> {
    const yearTopics = await this.yearTopicModel.find({ topicId }).exec();
    return this.yearModel.find({ _id: { $in: yearTopics.map(yt => yt.yearId) } }).exec();
  }
}