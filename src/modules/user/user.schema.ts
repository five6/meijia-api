import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, ObjectId } from 'mongoose';

export type UserDocument = User & Document;

@Schema()
export class User {
  _id: ObjectId;
  name: string;
  nickName: string;
  password: string;
  avatarUrl: string;
  phone: string;
  email: string;
}

export const UserSchema = SchemaFactory.createForClass(User);
