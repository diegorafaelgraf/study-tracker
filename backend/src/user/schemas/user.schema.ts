import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument } from 'mongoose';

export type UserDocument = HydratedDocument<User>;

export enum UserRole {
  ADMIN = 'ADMIN',
  USER = 'USER',
}

@Schema({ timestamps: true })
export class User {
  @Prop({ required: true, unique: true })
  username: string = '';

  @Prop({ required: true })
  password: string = '';

  @Prop({ enum: UserRole, default: UserRole.USER })
  role: UserRole = UserRole.USER;
}

export const UserSchema = SchemaFactory.createForClass(User);