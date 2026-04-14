import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';

import { PracticeController } from './practice.controller';
import { PracticeService } from './practice.service';
import { Practice, PracticeSchema } from './schemas/practice.schema';
import { YearTopic, YearTopicSchema } from '../year-topic/schemas/year-topic.schema';
import { Year, YearSchema } from '../year/schemas/year.schema';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: Practice.name, schema: PracticeSchema },
      { name: YearTopic.name, schema: YearTopicSchema },
      { name: Year.name, schema: YearSchema },
    ]),
  ],
  controllers: [PracticeController],
  providers: [PracticeService],
  exports: [PracticeService],
})
export class PracticeModule { }