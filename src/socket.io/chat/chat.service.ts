import { Injectable } from '@nestjs/common';
import { UserService } from '../../service/user/user.service';
import { Socket } from 'socket.io';
import { parse } from 'cookie';
import { WsException } from '@nestjs/websockets';
import { AuthenticationService } from './authentication.service';
 
@Injectable()
export class ChatService {
  constructor( private readonly userService: UserService, private readonly authenticationService: AuthenticationService) {
  }
 
  async getUserFromSocket(socket: Socket) {
      const cookie = socket.handshake.headers.cookie;
      const { Authentication: authenticationToken } = parse(cookie);
      const user = await this.authenticationService.getUserFromAuthenticationToken(authenticationToken);
      if (!user) {
        throw new WsException('Invalid credentials.');
      }
      return user;
  }
}