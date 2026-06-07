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
    findAll(query: FindResourcesQueryDto): Promise<{
        data: Resource[];
        total: number;
    }>;
    findOne(id: number): Promise<Resource>;
    findUserResources(userId: number): Promise<Resource[]>;
    create(createResourceDto: CreateResourceDto): Promise<Resource>;
    update(id: number, updateResourceDto: UpdateResourceDto): Promise<Resource>;
    remove(id: number): Promise<Resource>;
    count(): Promise<number>;
    countByStatus(status: string): Promise<number>;
    getCurrentAssignments(): Promise<any[]>;
    releaseResource(resourceCode: string, requester?: {
        userId: number;
        role?: string;
    }): Promise<Resource>;
    assignResource(resourceCode: string, userEmail: string, location?: {
        x: number;
        z: number;
        type?: string;
        tipo?: string;
        label?: string;
        mesaId?: number;
        num?: number;
        estId?: string;
        room?: string;
        placement?: string;
        anchor?: string;
        renderAnchorIndex?: number | null;
    }): Promise<Resource>;
    selfAssignResource(resourceCode: string, userId: number, userEmail: string, location?: {
        x: number;
        z: number;
        type?: string;
        tipo?: string;
        label?: string;
        mesaId?: number;
        num?: number;
        estId?: string;
        room?: string;
        placement?: string;
        anchor?: string;
        renderAnchorIndex?: number | null;
    }): Promise<{
        message: string;
        resource: Resource;
    }>;
    private enrichResources;
    private enrichResource;
}
