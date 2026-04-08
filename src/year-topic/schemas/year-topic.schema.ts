import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument, Types } from 'mongoose';

export type YearTopicDocument = HydratedDocument<YearTopic>;

@Schema({ timestamps: true })
export class YearTopic {
  @Prop({ type: Types.ObjectId, ref: 'Year', required: true })
  yearId!: Types.ObjectId;

  @Prop({ type: Types.ObjectId, ref: 'Topic', required: true })
  topicId!: Types.ObjectId;

  @Prop({ required: true, default: 0 })
  goalMinutes!: number;

  @Prop({ default: false })
  closed!: boolean;
}

export const YearTopicSchema = SchemaFactory.createForClass(YearTopic);