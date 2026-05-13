import { ConsoleLogger, Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { NotFoundException } from '@nestjs/common/exceptions';

import { Model, Types } from 'mongoose';

import { YearTopic, YearTopicDocument } from './schemas/year-topic.schema';
import { Year, YearDocument } from '../year/schemas/year.schema';
import { Topic, TopicDocument } from '../topic/schemas/topic.schema';
import { Practice, PracticeDocument } from '../practice/schemas/practice.schema';

import { AddYearTopicInput } from './types/types';

@Injectable()
export class YearTopicService {
  constructor(
    @InjectModel(YearTopic.name) private yearTopicModel: Model<YearTopicDocument>,
    @InjectModel(Year.name) private yearModel: Model<YearDocument>,
    @InjectModel(Topic.name) private topicModel: Model<TopicDocument>,
    @InjectModel(Practice.name) private practiceModel: Model<PracticeDocument>
  ) { }

  // Add a new YearTopic to the database
  async create(data: AddYearTopicInput, userId: string): Promise<YearTopicDocument> {
    const year = await this.yearModel.findOne({ closed: false, userId: new Types.ObjectId(userId) }).exec();
    if (!year) {
      throw new NotFoundException('No hay un año abierto para asociar el tópico');
    }
    const topic = await this.topicModel.findOne({ _id: new Types.ObjectId(data.topicId), userId: new Types.ObjectId(userId) }).exec();
    if (!topic) {
      throw new NotFoundException(`El tópico con ID "${data.topicId}" no existe`);
    }
    const yearId = year._id;
    return this.yearTopicModel.create({ ...data, topicId: new Types.ObjectId(data.topicId), yearId: new Types.ObjectId(yearId), userId: new Types.ObjectId(userId) });
  }

  // Get all YearTopics for a user
  async getYearTopics(userId: string): Promise<YearTopicDocument[]> {
    return this.yearTopicModel.find({ userId: new Types.ObjectId(userId) }).exec();
  }

  // Get a YearTopic by its ID
  async getYearTopicById(id: string, userId: string): Promise<YearTopicDocument | null> {
    return this.yearTopicModel.findOne({ _id: new Types.ObjectId(id), userId: new Types.ObjectId(userId) }).exec();
  }

  // Get stats for a YearTopic by its ID
  async getYearTopicStats(id: string, userId: string): Promise<any> {
    const yearTopic = await this.getYearTopicById(id, userId);
    const year = await this.yearModel.findOne({ _id: new Types.ObjectId(yearTopic?.yearId), userId: new Types.ObjectId(userId) }).exec();
    if (!yearTopic) {
      throw new NotFoundException(`El tópico con ID "${id}" no existe`);
    }
    // Logic to calculate and return the stats for the YearTopic
    const practices = await this.practiceModel.find({ yearTopicId: new Types.ObjectId(id), userId: new Types.ObjectId(userId) }).exec();
    const annualGoalMinutes = yearTopic.goalMinutes;
    const dayGoalMinutes = year && year.totalDays > 0 ? annualGoalMinutes / year.totalDays : 0;
    const annualPracticedMinutes = practices.reduce((total, practice) => total + practice.durationMinutes, 0);
    const annualRemainingMinutes = annualGoalMinutes - annualPracticedMinutes;
    const daysTranscurred =
      year && !isNaN(Number(year.year))
        ? Math.floor(
          (Date.now() - new Date(`${year.year}-01-01`).getTime()) /
          (1000 * 60 * 60 * 24)
        )
        : 0;
    const daysRemaining = year ? year.totalDays - daysTranscurred : 0;
    const neededDailyMinutes = daysRemaining > 0 ? annualRemainingMinutes / daysRemaining : 0;

    return {
      annualGoalMinutes,
      dayGoalMinutes,
      annualPracticedMinutes,
      annualRemainingMinutes,
      daysTranscurred,
      daysRemaining,
      neededDailyMinutes
    };
  }
}