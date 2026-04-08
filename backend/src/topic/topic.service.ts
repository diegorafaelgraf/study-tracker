import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { NotFoundException } from '@nestjs/common/exceptions';

import { Model } from 'mongoose';

import { Topic, TopicDocument } from './schemas/topic.schema';
import { AddTopicInput } from './types/types';


@Injectable()
export class TopicService {
  constructor(
    @InjectModel(Topic.name) private topicModel: Model<TopicDocument>,
  ) { }

  // Add a new Topic to the database
  async create(data: AddTopicInput): Promise<TopicDocument> {
    return this.topicModel.create(data);
  }

  async getTopicByName(name: string): Promise<TopicDocument | null> {
    return this.topicModel.findOne({ name }).exec();
  }

  async getTopicById(id: number): Promise<TopicDocument | null> {
    return this.topicModel.findById(id).exec();
  }
}