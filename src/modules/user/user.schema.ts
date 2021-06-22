import * as crypto from 'crypto';
import * as mongoose from "mongoose";


const d = new Date();
const _UserSchema = new mongoose.Schema({
  __v: { type: Number, select: false },
  nickName: { type: String, default: '未设置昵称' },
  gender: { type: String, default: '男', enum: ['男', '女'] },
  username: {
    type: String,
    required: true,
    unique: true,
    minlength: 6,
    maxlength: 20,
  },
  password: { type: String, required: true, minlength: 6 },
  email: { type: String, required: true, unique: true },
  mobile: { type: Number, unique: true },
  avatarUrl: { type: String },
  useDefaultAvatarUrl: { type: Boolean, default: true },
  registerTime: { type: Number, default: d.getTime() },
  unValidateEmail: { type: Boolean, default: true },
  jwtToken: { type: String }, // jwt token字符串
  unValidateEmailToken: { type: String },
  salt: { type: String },
  user_type: {
    type: String,
    default: 'people',
    enum: ['people', 'group'],
  },
  locked: {
    type: Boolean,
    required: true,
    default: false,
    select: false,
  },
});

_UserSchema.index({ username: -1, email: -1, mobile: 1 });

_UserSchema.methods = {
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
export const UserSchema = _UserSchema;