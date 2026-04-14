import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';

import { YearController } from './year.controller';
import { YearService } from './year.service';
import { Year, YearSchema } from './schemas/year.schema';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: Year.name, schema: YearSchema },
    ]),
  ],
  controllers: [YearController],
  providers: [YearService],
  exports: [YearService],
})
export class YearModule { }