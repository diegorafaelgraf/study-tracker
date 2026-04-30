import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument, Types } from 'mongoose';

export type YearDocument = HydratedDocument<Year>;

@Schema({ timestamps: true })
export class Year {
  @Prop({ type: Types.ObjectId, ref: 'User', required: true })
  userId: Types.ObjectId = new Types.ObjectId();

  @Prop({ required: true })
  year: string = '';

  @Prop({ required: true })
  totalDays: number = 0;

  @Prop({ required: true, default: false })
  closed: boolean = false;
}

export const YearSchema = SchemaFactory.createForClass(Year);

YearSchema.index({ year: 1, userId: 1 }, { unique: true });

YearSchema.index(
  { userId: 1, closed: 1 },
  {
    unique: true,
    partialFilterExpression: { closed: false },
  },
);