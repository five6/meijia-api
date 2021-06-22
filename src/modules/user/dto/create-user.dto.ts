import { IsEmail, IsMobilePhone } from 'class-validator';
export class CreateUserDto {
  _id: string;
  username?: string;
  password?: string;
  nickName?: string;
  gender?: number;

  @IsEmail()
  email?: string;
  avatarUrl?: string;
  @IsMobilePhone()
  mobile?: string;
  registerTime?: number;
}
