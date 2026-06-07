import { CreateResourceDto } from './dto/create-resource.dto';
import { FindResourcesQueryDto } from './dto/find-resources-query.dto';
import { UpdateResourceDto } from './dto/update-resource.dto';
import { ResourceService } from './resource.service';
import { Resource } from './resource.model';
export declare class ResourcesController {
    private readonly resourceService;
    constructor(resourceService: ResourceService);
    findAll(query: FindResourcesQueryDto): Promise<{
        data: Resource[];
        total: number;
    }>;
    create(createResourceDto: CreateResourceDto): Promise<Resource>;
    update(id: number, updateResourceDto: UpdateResourceDto): Promise<Resource>;
    remove(id: number): Promise<Resource>;
    getStats(): Promise<{
        total_resources: number;
        available_resources: number;
        assigned_resources: number;
        total_students: number;
    }>;
    getCurrentAssignments(): Promise<any[]>;
    getUserResources(userId: number): Promise<Resource[]>;
    releaseResource(req: {
        user: {
            userId: number;
            role: string;
        };
    }, resourceCode: string): Promise<Resource>;
    assignResource(body: {
        resource_code: string;
        user_email: string;
        location?: {
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
        };
    }): Promise<Resource>;
    getMyResources(req: {
        user: {
            userId: number;
        };
    }): Promise<Resource[]>;
    selfAssignResource(req: {
        user: {
            userId: number;
            email: string;
        };
    }, body: {
        resource_code: string;
        location?: {
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
        };
    }): Promise<{
        message: string;
        resource: Resource;
    }>;
    findOne(id: number): Promise<Resource>;
}
