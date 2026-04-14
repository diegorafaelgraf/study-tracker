import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument } from 'mongoose';

export type YearDocument = HydratedDocument<Year>;

@Schema({ timestamps: true })
export class Year {
  @Prop({ required: true, unique: true })
  year: string = '';

  @Prop({ required: true })
  totalDays: number = 0;

  @Prop({ required: true, default: false })
  closed: boolean = false;
}

export const YearSchema = SchemaFactory.createForClass(Year);

YearSchema.index(
  { closed: 1 },
  {
    unique: true,
    partialFilterExpression: { closed: false },
  },
);