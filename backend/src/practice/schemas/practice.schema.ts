import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument, Types } from 'mongoose';

export type PracticeDocument = HydratedDocument<Practice>;

@Schema({ timestamps: true })
export class Practice {
  @Prop({ type: Types.ObjectId, ref: 'YearTopic', required: true })
  yearTopicId: Types.ObjectId = new Types.ObjectId();

  @Prop({ required: true, default: () => new Date() })
  date: Date = new Date();

  @Prop({ required: true, default: 0 })
  durationMinutes: number = 0;
}

export const PracticeSchema = SchemaFactory.createForClass(Practice);