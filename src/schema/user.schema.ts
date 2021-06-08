import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

export type UserDocument = User & Document;

@Schema()
export class User {
  name: string;
  nickName: string;
  password: string;
  avatarUrl: string;
  phone: string;
  email: string;
}

export const UserSchema = SchemaFactory.createForClass(User);
