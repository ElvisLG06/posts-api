// src/auth/jwt.strategy.ts
import { Injectable } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { Strategy, ExtractJwt } from 'passport-jwt';
import { jwtConstants } from './constants';

// src/auth/jwt.strategy.ts

interface JwtPayload {
    profileId: string;
    iat?: number;    // opcional, viene de JWT
    exp?: number;    // opcional, viene de JWT
  }
  

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
    constructor() {
        super({
            jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
            ignoreExpiration: false,
            secretOrKey: jwtConstants.secret,
        });
    }

    // Passport llamará a este método si la verificación de firma es exitosa.
    async validate(payload: JwtPayload) {
        // Devuelve un objeto que luego estará disponible en req.user
        return { profileId: payload.profileId };
    }
}
