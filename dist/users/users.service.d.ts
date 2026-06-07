import { Repository } from 'typeorm';
import { User } from './user.model';
import { Resource } from '../resources/resource.model';
import type { CreateUserDto } from './dto/create-user.dto';
import type { FindUsersQueryDto } from './dto/find-users-query.dto';
import type { UpdateUserDto } from './dto/update-user.dto';
export declare class UsersService {
    private userRepository;
    private resourceRepository;
    constructor(userRepository: Repository<User>, resourceRepository: Repository<Resource>);
    findAll(query: FindUsersQueryDto): Promise<{
        data: User[];
        total: number;
    }>;
    findOne(id: number): Promise<User>;
    findUserResources(userId: number): Promise<Resource[]>;
    create(createUserDto: CreateUserDto): Promise<User>;
    update(id: number, updateUserDto: UpdateUserDto): Promise<User>;
    remove(id: number): Promise<User>;
    upgradeRole(userId: number, role: 'user' | 'bip' | 'admin'): Promise<User>;
}
