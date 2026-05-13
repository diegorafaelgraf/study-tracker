import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';

import { YearTopicController } from './year-topic.controller';
import { YearTopicService } from './year-topic.service';
import { YearTopic, YearTopicSchema } from './schemas/year-topic.schema';
import { Year, YearSchema } from '../year/schemas/year.schema';
import { Topic, TopicSchema } from '../topic/schemas/topic.schema';
import { Practice, PracticeSchema } from '../practice/schemas/practice.schema';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: YearTopic.name, schema: YearTopicSchema },
      { name: Year.name, schema: YearSchema },
      { name: Topic.name, schema: TopicSchema },
      { name: Practice.name, schema: PracticeSchema },
    ]),
  ],
  controllers: [YearTopicController],
  providers: [YearTopicService],
  exports: [YearTopicService],
})
export class YearTopicModule { }