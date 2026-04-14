import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { MongooseModule } from '@nestjs/mongoose';

import { AppController } from './app.controller';
import { AppService } from './app.service';

import { YearModule } from './year/year.module';
import { TopicModule } from './topic/topic.module';
import { YearTopicModule } from './year-topic/year-topic.module';
import { PracticeModule } from './practice/practice.module';
@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
    }),

    MongooseModule.forRootAsync({
      inject: [ConfigService],
      useFactory: (config: ConfigService) => ({
        uri: config.get<string>('MONGO_URI'),
      }),
    }),

    YearModule,
    TopicModule,
    YearTopicModule,
    PracticeModule
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule { }