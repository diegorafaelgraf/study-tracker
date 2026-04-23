import { Injectable } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor() {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      ignoreExpiration: false,
      secretOrKey: 'super-secret-key', // TODO: mover a .env
    });
  }

  async validate(payload: any) {
    // esto termina en req.user
    return {
      userId: payload.sub,
      username: payload.username,
      role: payload.role,
    };
  }
}