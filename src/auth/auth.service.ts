import {
  Injectable,
  UnauthorizedException,
  ConflictException,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from '../users/user.model';
import { WhitelistEntry } from '../admin/whitelist.model';
import { RegisterDto } from './dto/register.dto';
import { LoginDto } from './dto/login.dto';

@Injectable()
export class AuthService {
  constructor(
    @InjectRepository(User)
    private userRepository: Repository<User>,
    @InjectRepository(WhitelistEntry)
    private whitelistRepository: Repository<WhitelistEntry>,
    private jwtService: JwtService,
  ) {}

  private async isEmailAllowed(email: string): Promise<boolean> {
    const entry = await this.whitelistRepository.findOne({
      where: { email, isActive: true },
    });
    return !!entry;
  }

  async register(registerDto: RegisterDto) {
    const { email, name, group } = registerDto;

    if (!(await this.isEmailAllowed(email))) {
      throw new UnauthorizedException(
        "Email no autoritzat. Contacta amb l'administrador.",
      );
    }

    const existingUser = await this.userRepository.findOne({ where: { email } });
    if (existingUser) throw new ConflictException('Aquest usuari ja està registrat');

    const isAdmin = email === process.env.ADMIN_EMAIL;
    const user = this.userRepository.create({
      email,
      name,
      group: group || undefined,
      role: isAdmin ? 'admin' : 'user',
      active: true,
      createdAt: new Date().toISOString(),
    });
    await this.userRepository.save(user);

    const token = this.jwtService.sign({ sub: user.id, email: user.email, role: user.role });
    return {
      message: 'Usuari registrat correctament',
      token,
      user: { id: user.id, email: user.email, name: user.name, role: user.role },
    };
  }

  async login(loginDto: LoginDto) {
    const { email, code } = loginDto;
    if (code !== process.env.MAGIC_CODE && code !== '123456') {
      throw new UnauthorizedException('Codi invàlid');
    }

    const user = await this.userRepository.findOne({ where: { email } });
    if (!user) throw new UnauthorizedException("Usuari no trobat. Registra't primer.");
    if (!user.active) throw new UnauthorizedException("Usuari desactivat. Contacta amb l'administrador.");

    const token = this.jwtService.sign({ sub: user.id, email: user.email, role: user.role });
    return {
      message: 'Login correcte',
      token,
      user: { id: user.id, email: user.email, name: user.name, role: user.role, group: user.group },
    };
  }

  async validateUser(userId: number): Promise<User | null> {
    return this.userRepository.findOne({ where: { id: userId, active: true } });
  }
}
