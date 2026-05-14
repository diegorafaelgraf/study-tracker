import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument, Types } from 'mongoose';

export type TopicDocument = HydratedDocument<Topic>;

@Schema({ timestamps: true })
export class Topic {
  @Prop({ type: Types.ObjectId, ref: 'User', required: true })
  userId: Types.ObjectId = new Types.ObjectId();

  @Prop({ required: true })
  name: string = '';

  @Prop({ required: true })
  nameNormalized: string = '';
}

export const TopicSchema = SchemaFactory.createForClass(Topic);

TopicSchema.index({ nameNormalized: 1, userId: 1 }, { unique: true });