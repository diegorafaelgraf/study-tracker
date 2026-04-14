import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument, Types } from 'mongoose';

export type YearTopicDocument = HydratedDocument<YearTopic>;

@Schema({ timestamps: true })
export class YearTopic {
  @Prop({ type: Types.ObjectId, ref: 'Year', required: true })
  yearId: Types.ObjectId = new Types.ObjectId();

  @Prop({ type: Types.ObjectId, ref: 'Topic', required: true })
  topicId: Types.ObjectId = new Types.ObjectId();

  @Prop({ required: true, default: 0 })
  goalMinutes: number = 0;
}

export const YearTopicSchema = SchemaFactory.createForClass(YearTopic);

// índice compuesto único
YearTopicSchema.index(
  { topicId: 1, yearId: 1 },
  { unique: true }
);

