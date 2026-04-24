import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { NotFoundException } from '@nestjs/common/exceptions';

import { Model } from 'mongoose';

import { YearTopic, YearTopicDocument } from './schemas/year-topic.schema';
import { Year, YearDocument } from '../year/schemas/year.schema';
import { Topic, TopicDocument } from '../topic/schemas/topic.schema';

import { AddYearTopicInput } from './types/types';

@Injectable()
export class YearTopicService {
  constructor(
    @InjectModel(YearTopic.name) private yearTopicModel: Model<YearTopicDocument>,
    @InjectModel(Year.name) private yearModel: Model<YearDocument>,
    @InjectModel(Topic.name) private topicModel: Model<TopicDocument>,
  ) { }

  // Add a new YearTopic to the database
  async create(data: AddYearTopicInput, userId: string): Promise<YearTopicDocument> {
    const year = await this.yearModel.findOne({ closed: false, userId }).exec();
    if (!year) {
      throw new NotFoundException('No hay un año abierto para asociar el tópico');
    }
    const topic = await this.topicModel.findOne({ _id: data.topicId, userId }).exec();
    if (!topic) {
      throw new NotFoundException(`El tópico con ID "${data.topicId}" no existe`);
    }
    const yearId = year._id.toString();
    return this.yearTopicModel.create({ ...data, yearId, userId });
  }

  // Get a YearTopic by its ID
  async getYearTopicById(id: number, userId: string): Promise<YearTopicDocument | null> {
    return this.yearTopicModel.findOne({ _id: id, userId }).exec();
  }
}