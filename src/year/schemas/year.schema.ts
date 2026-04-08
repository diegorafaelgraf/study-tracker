import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument } from 'mongoose';

export type YearDocument = HydratedDocument<Year>;

@Schema({ timestamps: true })
export class Year {
  @Prop({ required: true, unique: true })
  year!: string;

  @Prop({ required: true })
  totalDays!: number;

  @Prop({ required: true, default: false })
  closed!: boolean;
}

export const YearSchema = SchemaFactory.createForClass(Year);