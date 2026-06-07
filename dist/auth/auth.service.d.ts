import { JwtService } from '@nestjs/jwt';
import { Repository } from 'typeorm';
import { User } from '../users/user.model';
import { WhitelistEntry } from '../admin/whitelist.model';
import { RegisterDto } from './dto/register.dto';
import { LoginDto } from './dto/login.dto';
export declare class AuthService {
    private userRepository;
    private whitelistRepository;
    private jwtService;
    constructor(userRepository: Repository<User>, whitelistRepository: Repository<WhitelistEntry>, jwtService: JwtService);
    private isEmailAllowed;
    register(registerDto: RegisterDto): Promise<{
        message: string;
        token: string;
        user: {
            id: number;
            email: string;
            name: string;
            role: string;
        };
    }>;
    login(loginDto: LoginDto): Promise<{
        message: string;
        token: string;
        user: {
            id: number;
            email: string;
            name: string;
            role: string;
            group: string;
        };
    }>;
    validateUser(userId: number): Promise<User | null>;
}
