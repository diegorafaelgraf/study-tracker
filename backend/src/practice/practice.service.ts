import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { NotFoundException } from '@nestjs/common/exceptions';

import { Model } from 'mongoose';

import { YearTopic, YearTopicDocument } from '../year-topic/schemas/year-topic.schema';
import { Year, YearDocument } from '../year/schemas/year.schema';
import { Practice, PracticeDocument } from './schemas/practice.schema';

import { AddPracticeInput } from './types/types';



@Injectable()
export class PracticeService {
  constructor(
    @InjectModel(YearTopic.name) private yearTopicModel: Model<YearTopicDocument>,
    @InjectModel(Year.name) private yearModel: Model<YearDocument>,
    @InjectModel(Practice.name) private practiceModel: Model<PracticeDocument>
  ) { }

  // Add a new YearTopic to the database
  async create(data: AddPracticeInput): Promise<PracticeDocument> {

    const yearTopic = await this.yearTopicModel.findById(data.yearTopicId).exec();
    if (!yearTopic) {
      throw new NotFoundException(`El YearTopic con ID "${data.yearTopicId}" no existe`);
    }

    const year = await this.yearModel.findOne({ closed: false, _id: yearTopic.yearId }).exec();
    if (!year) {
      throw new NotFoundException('No hay un año abierto para cargar una práctica');
    }

    return this.practiceModel.create(data);
  }

  async getPracticesByYearTopic(yearTopicId: string): Promise<PracticeDocument[]> {
    return this.practiceModel.find({ yearTopicId }).exec();
  }
}