import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';
import * as mongoose from 'mongoose';
import { User } from './entities/user.entity';
import { IsEmail, IsMobilePhone } from 'class-validator';
import * as crypto from 'crypto';

export type ProductDocument = User & Document;

@Schema()
export class _UserSchema {
  @Prop()
  username: string;

  @Prop({ type: mongoose.Schema.Types.ObjectId })
  password: string;

  @Prop({ type: String })
  nickName: string;

  @Prop({ type: String })
  gender: number;

  @Prop()
  @IsEmail()
  email: string;

  @Prop()
  avatarUrl: string;

  @Prop()
  @IsMobilePhone()
  mobile: string;

  @Prop({ default: new Date().getTime() })
  registerTime: { type: number };

  // only in server side
  useDefaultAvatarUrl: { type: boolean; default: true };
  salt: { type: string };
  locked: {
    type: boolean;
    required: true;
    default: false;
    select: false;
  };
  jwtToken: { type: string }; // jwt token字符串
  unValidateEmail: { type: boolean; default: true };
}

const UserSchema = SchemaFactory.createForClass(_UserSchema);
UserSchema.index({ username: -1, email: -1 });

UserSchema.methods = <any>{
  authenticate(password) {
    return this.encryptPassword(password) === this.password;
  },
  makeSalt() {
    return Date.now();
  },
  encryptPassword(password) {
    if (!password) return '';
    try {
      return crypto
        .createHmac('sha1', this.salt)
        .update(password)
        .digest('hex');
    } catch (err) {
      return '';
    }
  },
};

export default UserSchema;
