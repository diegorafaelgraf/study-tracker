import { Injectable, BadRequestException, NotFoundException } from '@nestjs/common';
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
  async create(data: AddYearInput, userId: string): Promise<YearDocument> {
    const existingOpenYear = await this.yearModel.findOne({
      closed: false,
      userId: userId
    });
    if (existingOpenYear) {
      throw new BadRequestException(
        'Ya existe un año abierto',
      );
    }
    return this.yearModel.create({ ...data, closed: false, userId: userId });
  }

  // Get all Years
  async getYears(userId: string): Promise<YearDocument[]> {
    return this.yearModel.find({ userId }).exec();
  }

  // Get a Year by its year
  async getYearByYear(year: string, userId: string): Promise<YearDocument | null> {
    return this.yearModel.findOne({ year, userId }).exec();
  }
  async getOpenedYear(userId: string) {
    return this.yearModel.findOne({ closed: false, userId });
  }

  // Get a Year by its ID
  async getYearById(id: string, userId: string): Promise<YearDocument | null> {
    return this.yearModel.findOne({ _id: id, userId }).exec();
  }

  // Get all years by topic
  async getYearsByTopic(topicId: string, userId: string): Promise<YearDocument[]> {
    const yearTopics = await this.yearTopicModel.find({ topicId, userId }).exec();
    return this.yearModel.find({ _id: { $in: yearTopics.map(yt => yt.yearId) }, userId }).exec();
  }

  // Close a year
  async closeYear(id: string, userId: string): Promise<YearDocument> {
    const year = await this.yearModel.findOne({ _id: id, userId }).exec();
    if (!year) {
      throw new NotFoundException('Año no encontrado');
    }
    if (year.closed) {
      throw new BadRequestException('El año ya está cerrado');
    }
    year.closed = true;
    return year.save();
  }
}