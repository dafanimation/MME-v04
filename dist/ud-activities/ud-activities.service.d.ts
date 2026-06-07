import { Repository } from 'typeorm';
import { UdActivity } from './ud-activity.model';
import { ProjectTask } from '../projects/project-task.model';
import { History } from '../history/history.model';
import { Resource } from '../resources/resource.model';
import { User } from '../users/user.model';
type UdActivityInput = {
    udCode?: string;
    title?: string;
    date?: string;
    statement?: string;
    requiredEquipment?: string[];
    assignmentMode?: string;
    resourceTypes?: string[];
    links?: string[];
    images?: string[];
    projectId?: number;
    status?: string;
};
export declare class UdActivitiesService {
    private readonly udRepo;
    private readonly taskRepo;
    private readonly historyRepo;
    private readonly userRepo;
    private readonly resourceRepo;
    constructor(udRepo: Repository<UdActivity>, taskRepo: Repository<ProjectTask>, historyRepo: Repository<History>, userRepo: Repository<User>, resourceRepo: Repository<Resource>);
    private normalizeList;
    private resolveActor;
    private logHistory;
    findAll(filters: {
        udCode?: string;
        status?: string;
        projectId?: string;
    }): Promise<UdActivity[]>;
    findOne(id: number): Promise<UdActivity>;
    create(payload: UdActivityInput, actorEmail?: string): Promise<UdActivity>;
    update(id: number, payload: UdActivityInput, actorEmail?: string): Promise<UdActivity>;
    remove(id: number, actorEmail?: string): Promise<{
        message: string;
    }>;
    linkTask(id: number, taskId: number, actorEmail?: string): Promise<ProjectTask>;
    addImage(id: number, imageUrl: string, actorEmail?: string): Promise<UdActivity>;
    unlinkTask(taskId: number, actorEmail?: string): Promise<ProjectTask>;
}
export {};
