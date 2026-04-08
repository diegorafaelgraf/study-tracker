import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument } from 'mongoose';

export type TopicDocument = HydratedDocument<Topic>;

@Schema({ timestamps: true })
export class Topic {
  @Prop({ required: true, unique: true })
  name!: string;
}

export const TopicSchema = SchemaFactory.createForClass(Topic);