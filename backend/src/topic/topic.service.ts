import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';

import { Model } from 'mongoose';

import { Topic, TopicDocument } from './schemas/topic.schema';
import { YearTopic, YearTopicDocument } from '../year-topic/schemas/year-topic.schema';

import { AddTopicInput } from './types/types';


@Injectable()
export class TopicService {
  constructor(
    @InjectModel(Topic.name) private topicModel: Model<TopicDocument>,
    @InjectModel(YearTopic.name) private yearTopicModel: Model<YearTopicDocument>,
  ) { }

  // Add a new Topic to the database
  async create(data: AddTopicInput): Promise<TopicDocument> {
    const nameNormalized = this.normalizeName(data.name);
    return this.topicModel.create({ ...data, nameNormalized });
  }

  async getTopics(): Promise<TopicDocument[]> {
    return this.topicModel.find().exec();
  }

  async getTopicByName(name: string): Promise<TopicDocument | null> {
    return this.topicModel.findOne({ name }).exec();
  }

  async getTopicById(id: number): Promise<TopicDocument | null> {
    return this.topicModel.findById(id).exec();
  }

  async getTopicsByYear(yearId: string): Promise<TopicDocument[]> {
    const yearTopics = this.yearTopicModel.find({ yearId }).exec();
    return this.topicModel.find({ _id: { $in: (await yearTopics).map(yt => yt.topicId) } }).exec();
  }

  private normalizeName(name: string): string {
    return name
      .normalize('NFD')
      .replace(/[\u0300-\u036f]/g, '')
      .toLowerCase()
      .trim();
  }
}