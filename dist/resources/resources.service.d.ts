import { Repository } from 'typeorm';
import { Resource } from './resource.model';
import { User } from '../users/user.model';
import type { CreateResourceDto } from './dto/create-resource.dto';
import type { FindResourcesQueryDto } from './dto/find-resources-query.dto';
import type { UpdateResourceDto } from './dto/update-resource.dto';
export declare class ResourceService {
    private resourceRepository;
    private userRepository;
    constructor(resourceRepository: Repository<Resource>, userRepository: Repository<User>);
    count(): Promise<number>;
    countByStatus(status: string): Promise<number>;
    getCurrentAssignments(): Promise<Resource[]>;
    assignResource(resourceCode: string, userEmail: string): Promise<Resource>;
    releaseResource(resourceCode: string): Promise<Resource>;
    findAll(query: FindResourcesQueryDto): Promise<{
        data: Resource[];
        total: number;
    }>;
    findOne(id: number): Promise<Resource>;
    findUserResources(userId: number): Promise<Resource[]>;
    create(createResourceDto: CreateResourceDto): Promise<Resource>;
    update(id: number, updateResourceDto: UpdateResourceDto): Promise<Resource>;
    remove(id: number): Promise<Resource>;
}
