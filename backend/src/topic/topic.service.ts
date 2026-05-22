import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';

import { Model, Types } from 'mongoose';

import { Topic, TopicDocument } from './schemas/topic.schema';
import { YearTopic, YearTopicDocument } from '../year-topic/schemas/year-topic.schema';
import { Year, YearDocument } from '../year/schemas/year.schema';

import { AddTopicInput } from './types/types';


@Injectable()
export class TopicService {
  constructor(
    @InjectModel(Topic.name) private topicModel: Model<TopicDocument>,
    @InjectModel(YearTopic.name) private yearTopicModel: Model<YearTopicDocument>,
    @InjectModel(Year.name) private yearModel: Model<YearDocument>
  ) { }

  // Add a new Topic to the database
  async create(data: AddTopicInput, userId: string): Promise<TopicDocument> {
    const nameNormalized = this.normalizeName(data.name);
    return this.topicModel.create({ ...data, nameNormalized, userId: new Types.ObjectId(userId) });
  }

  async getTopics(userId: string): Promise<TopicDocument[]> {
    return this.topicModel.find({ userId: new Types.ObjectId(userId) }).exec();
  }

  async getTopicByName(name: string, userId: string): Promise<TopicDocument | null> {
    return this.topicModel.findOne({ name, userId: new Types.ObjectId(userId) }).exec();
  }

  async getTopicById(id: string, userId: string): Promise<TopicDocument | null> {
    return this.topicModel.findOne({ _id: new Types.ObjectId(id), userId: new Types.ObjectId(userId) }).exec();
  }

  async getTopicsByYear(yearId: string, userId: string): Promise<TopicDocument[]> {
    return this.yearTopicModel.aggregate([
      {
        $match: {
          yearId: new Types.ObjectId(yearId),
          userId: new Types.ObjectId(userId),
        },
      },
      {
        $lookup: {
          from: 'topics',
          localField: 'topicId',
          foreignField: '_id',
          as: 'topic',
        },
      },
      {
        $unwind: '$topic',
      },
      {
        $project: {
          yearTopicId: '$_id',
          topic: 1,
        },
      },
      {
        $replaceRoot: {
          newRoot: {
            $mergeObjects: [
              '$topic',
              { yearTopicId: '$yearTopicId' },
            ],
          },
        },
      },
    ]);
  }

  async getTopicsCurrentYear(userId: string): Promise<TopicDocument[]> {
    const currentYear = await this.yearModel.findOne({ closed: false, userId: new Types.ObjectId(userId) }).exec();
    if (!currentYear) {
      throw new Error('No hay un año abierto para obtener las áreas');
    }

    return this.yearTopicModel.aggregate([
      {
        $match: {
          yearId: currentYear._id,
          userId: new Types.ObjectId(userId),
        },
      },
      {
        $lookup: {
          from: 'topics',
          localField: 'topicId',
          foreignField: '_id',
          as: 'topic',
        },
      },
      {
        $unwind: '$topic',
      },
      {
        $lookup: {
          from: 'practices',
          localField: '_id',
          foreignField: 'yearTopicId',
          as: 'practices',
        },
      },
      {
        $addFields: {
          practicedMinutes: {
            $sum: '$practices.durationMinutes',
          },
        },
      },
      {
        $project: {
          yearTopicId: '$_id',
          topic: 1,
          goalMinutes: 1,
          practicedMinutes: 1,
        },
      },
      {
        $replaceRoot: {
          newRoot: {
            $mergeObjects: [
              '$topic',
              {
                yearTopicId: '$yearTopicId',
                goalMinutes: '$goalMinutes',
                practicedMinutes: '$practicedMinutes',
              },
            ],
          },
        },
      },
    ]);
  }


  private normalizeName(name: string): string {
    return name
      .normalize('NFD')
      .replace(/[\u0300-\u036f]/g, '')
      .toLowerCase()
      .trim();
  }
}