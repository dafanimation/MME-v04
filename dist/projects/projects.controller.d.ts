import { StreamableFile } from '@nestjs/common';
import type { Response } from 'express';
import { ProjectsService } from './projects.service';
export declare class ProjectsController {
    private readonly projectsService;
    constructor(projectsService: ProjectsService);
    findProjects(status?: string, title?: string): Promise<import("./project.model").Project[]>;
    findProject(id: number): Promise<import("./project.model").Project>;
    exportProjectPdf(id: number, res: Response): Promise<StreamableFile>;
    createProject(req: {
        user: {
            email?: string;
        };
    }, body: {
        title: string;
        description?: string;
        status?: string;
        dossierLinks?: string[];
        attachments?: string[];
        participants?: string[];
        mesaNum?: string;
    }): Promise<import("./project.model").Project>;
    updateProject(req: {
        user: {
            email?: string;
        };
    }, id: number, body: {
        title?: string;
        description?: string;
        status?: string;
        dossierLinks?: string[];
        attachments?: string[];
        participants?: string[];
        mesaNum?: string;
    }): Promise<import("./project.model").Project>;
    removeProject(req: {
        user: {
            email?: string;
        };
    }, id: number): Promise<{
        message: string;
    }>;
    uploadProjectImage(req: {
        user: {
            email?: string;
        };
    }, id: number, file?: {
        filename?: string;
    }): Promise<{
        message: string;
        fileUrl?: undefined;
        project?: undefined;
    } | {
        fileUrl: string;
        project: import("./project.model").Project;
        message?: undefined;
    }>;
    findTasks(projectId: number): Promise<import("./project-task.model").ProjectTask[]>;
    createTask(req: {
        user: {
            email?: string;
        };
    }, projectId: number, body: {
        udActivityId?: number;
        activityCode?: string;
        ownerUserEmail?: string;
        mesaNum?: string;
        resourceCode?: string;
        status?: string;
        notes?: string;
    }): Promise<import("./project-task.model").ProjectTask>;
    updateTask(req: {
        user: {
            email?: string;
        };
    }, taskId: number, body: {
        udActivityId?: number;
        activityCode?: string;
        ownerUserEmail?: string;
        mesaNum?: string;
        resourceCode?: string;
        status?: string;
        notes?: string;
    }): Promise<import("./project-task.model").ProjectTask>;
    removeTask(req: {
        user: {
            email?: string;
        };
    }, taskId: number): Promise<{
        message: string;
    }>;
}
