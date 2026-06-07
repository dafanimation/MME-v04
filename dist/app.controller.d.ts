import { AppService } from './app.service';
import type { Response } from 'express';
export declare class AppController {
    private readonly appService;
    constructor(appService: AppService);
    getHello(): string;
    getHealth(): {
        status: string;
        service: string;
        timestamp: string;
    };
    getHome(res: Response): void;
}
