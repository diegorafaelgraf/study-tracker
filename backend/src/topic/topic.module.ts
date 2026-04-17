import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';

import { TopicController } from './topic.controller';
import { TopicService } from './topic.service';
import { Topic, TopicSchema } from './schemas/topic.schema';
import { YearTopic, YearTopicSchema } from '../year-topic/schemas/year-topic.schema';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: Topic.name, schema: TopicSchema },
      { name: YearTopic.name, schema: YearTopicSchema },
    ]),
  ],
  controllers: [TopicController],
  providers: [TopicService],
  exports: [TopicService]
})
export class TopicModule { }