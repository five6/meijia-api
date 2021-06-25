import { Injectable } from '@nestjs/common';
import { UserService } from '../../service/user/user.service';
import { JwtService } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';
import { jwtConstants } from '../../module/common/auth/constants';

@Injectable()
export class AuthenticationService {
  constructor(
    private readonly userService: UserService,
    private readonly jwtService: JwtService,
  ) { }

  public async getUserFromAuthenticationToken(token: string): Promise<any> {
    const payload: any = this.jwtService.verify(token, {
      secret: jwtConstants.secret
    });
    if (payload.userId) {
      return this.userService.getById(payload.userId);
    }
  }

}