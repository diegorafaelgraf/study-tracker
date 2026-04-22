import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument, Types } from 'mongoose';

export type TopicDocument = HydratedDocument<Topic>;

@Schema({ timestamps: true })
export class Topic {
  @Prop({ required: true, unique: true })
  name: string = '';

  @Prop({ required: true, unique: true })
  nameNormalized: string = '';

  @Prop({ type: Types.ObjectId, ref: 'User', required: true })
  userId: Types.ObjectId = new Types.ObjectId();
}

export const TopicSchema = SchemaFactory.createForClass(Topic);