import * as Mongoose from 'mongoose';

export const UserSchema = new Mongoose.Schema({
    _id: String,
    name: String,
    nickName: String,
    password: String,
    avatarUrl: String,
    phone: String,
    email: String
},
{ collection: 'users', versionKey: false })