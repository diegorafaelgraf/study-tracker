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

    // Calculate local date string (YYYY-MM-DD) to filter practices for "today"
    // Adjust for server's timezone offset
    const now = new Date();
    const offset = -now.getTimezoneOffset() * 60 * 1000;
    const localDate = new Date(now.getTime() + offset);
    const localDateString = localDate.toISOString().split('T')[0];

    return this.yearTopicModel.aggregate([

      // Match YearTopics for the current year and user
      {
        $match: {
          yearId: currentYear._id,
          userId: new Types.ObjectId(userId),
        },
      },

      // Lookup for the topic details
      {
        $lookup: {
          from: 'topics',
          localField: 'topicId',
          foreignField: '_id',
          as: 'topic',
        },
      },

      // Unwind the topic array to get a single topic object
      {
        $unwind: '$topic',
      },

      // Lookup for all practices
      {
        $lookup: {
          from: 'practices',
          localField: '_id',
          foreignField: 'yearTopicId',
          as: 'practices',
        },
      },

      // Lookup for today's practices
      {
        $lookup: {
          from: 'practices',
          let: { localId: '$_id', localDateString: localDateString },
          pipeline: [
            {
              $addFields: {
                practiceDay: {
                  $dateToString: {
                    format: '%Y-%m-%d',
                    date: '$date',
                  }
                }
              }
            },
            {
              $match: {
                $expr: {
                  $and: [
                    { $eq: ['$yearTopicId', '$$localId'] },
                    { $eq: ['$practiceDay', '$$localDateString'] }
                  ]
                }
              }
            }
          ],
          as: 'todayPractices'
        }
      },

      // totalTodayPractices
      {
        $addFields: {
          totalTodayPractices: { $sum: "$todayPractices.durationMinutes" }
        }
      },

      // practicedMinutes
      {
        $addFields: {
          practicedMinutes: {
            $sum: '$practices.durationMinutes',
          },
        },
      },

      // remainingMinutes
      {
        $addFields: {
          remainingMinutes: {
            $subtract: ['$goalMinutes', '$practicedMinutes'],
          },
        },
      },

      // daysRemaining
      {
        $addFields: {
          daysRemaining: {
            $subtract: [
              currentYear.totalDays,
              {
                $dateDiff: {
                  startDate: new Date(`${currentYear.year}-01-01`),
                  endDate: "$$NOW",
                  unit: "day"
                }
              }
            ]
          }
        },
      },

      // minutesPerDay
      {
        $addFields: {
          minutesPerDay: {
            $cond: [
              { $gt: ['$daysRemaining', 0] },
              {
                $divide: [
                  '$remainingMinutes',
                  '$daysRemaining',
                ],
              },
              0,
            ],
          },
        },
      },

      // progressPercentage
      {
        $addFields: {
          progressPercentage: {
            $cond: [
              { $gt: ['$goalMinutes', 0] },
              {
                $multiply: [
                  {
                    $divide: [
                      '$practicedMinutes',
                      '$goalMinutes',
                    ],
                  },
                  100,
                ],
              },
              0,
            ],
          },
        },
      },

      // Project the final fields to return
      {
        $project: {
          yearTopicId: '$_id',
          topic: 1,
          goalMinutes: 1,
          practicedMinutes: 1,
          remainingMinutes: 1,
          minutesPerDay: 1,
          daysRemaining: 1,
          progressPercentage: 1,
          totalTodayPractices: 1
        },
      },

      // Replace the root document with a merged object containing topic details and YearTopic stats
      {
        $replaceRoot: {
          newRoot: {
            $mergeObjects: [
              '$topic',
              {
                yearTopicId: '$yearTopicId',
                goalMinutes: '$goalMinutes',
                practicedMinutes: '$practicedMinutes',
                remainingMinutes: '$remainingMinutes',
                minutesPerDay: '$minutesPerDay',
                daysRemaining: '$daysRemaining',
                progressPercentage: '$progressPercentage',
                totalTodayPractices: '$totalTodayPractices'
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