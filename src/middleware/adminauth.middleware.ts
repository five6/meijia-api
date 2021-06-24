import { NestMiddleware, UnauthorizedException } from '@nestjs/common';
export class AdminauthMiddleware implements NestMiddleware {
  use(req: any, res: any, next: () => void) {
    const userinfo = req.session.userinfo;
    if (userinfo && userinfo.username) {
      next();
    } else {
      throw new UnauthorizedException();
    }
  }
}
