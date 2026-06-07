import { Injectable, UnauthorizedException } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { AuthService } from './auth.service';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor(private authService: AuthService) {
    // Llegir JWT_SECRET amb valor per defecte si no existeix
    const jwtSecret =
      process.env.JWT_SECRET || 'clau_per_defecte_nomes_per_dev';

    console.log(
      '🔐 JWTStrategy inicialitzat amb secret:',
      jwtSecret.substring(0, 10) + '...',
    );

    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      ignoreExpiration: false,
      secretOrKey: jwtSecret,
    });
  }

  async validate(payload: any) {
    const user = await this.authService.validateUser(payload.sub);
    if (!user) {
      throw new UnauthorizedException('Token invàlid o usuari desactivat');
    }
    return { userId: payload.sub, email: payload.email, role: payload.role };
  }
}
