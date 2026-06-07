import { Repository } from 'typeorm';
import { Project } from './project.model';
import { ProjectTask } from './project-task.model';
import { History as HistoryEntity } from '../history/history.model';
import { Resource } from '../resources/resource.model';
import { User } from '../users/user.model';
type ProjectInput = {
    title?: string;
    description?: string;
    status?: string;
    dossierLinks?: string[];
    attachments?: string[];
    participants?: string[];
    mesaNum?: string;
};
type ProjectTaskInput = {
    udActivityId?: number;
    activityCode?: string;
    ownerUserEmail?: string;
    mesaNum?: string;
    resourceCode?: string;
    status?: string;
    notes?: string;
};
export declare class ProjectsService {
    private readonly projectRepo;
    private readonly taskRepo;
    private readonly historyRepo;
    private readonly userRepo;
    private readonly resourceRepo;
    constructor(projectRepo: Repository<Project>, taskRepo: Repository<ProjectTask>, historyRepo: Repository<HistoryEntity>, userRepo: Repository<User>, resourceRepo: Repository<Resource>);
    private resolveActor;
    private resolveResource;
    private logHistoryEvent;
    findProjects(filters: {
        status?: string;
        title?: string;
    }): Promise<Project[]>;
    findProject(id: number): Promise<Project>;
    exportProjectPdf(projectId: number): Promise<Buffer>;
    createProject(payload: ProjectInput, actorEmail?: string): Promise<Project>;
    updateProject(id: number, payload: ProjectInput, actorEmail?: string): Promise<Project>;
    removeProject(id: number, actorEmail?: string): Promise<{
        message: string;
    }>;
    addProjectAttachment(id: number, fileUrl: string, actorEmail?: string): Promise<Project>;
    findTasks(projectId: number): Promise<ProjectTask[]>;
    createTask(projectId: number, payload: ProjectTaskInput, actorEmail?: string): Promise<ProjectTask>;
    updateTask(taskId: number, payload: ProjectTaskInput, actorEmail?: string): Promise<ProjectTask>;
    removeTask(taskId: number, actorEmail?: string): Promise<{
        message: string;
    }>;
}
export {};
