import { AdminService } from './admin.service';
export declare class AdminController {
    private readonly adminService;
    constructor(adminService: AdminService);
    getWhitelist(academicYear?: string, module?: string): Promise<import("./whitelist.model").WhitelistEntry[]>;
    addToWhitelist(req: {
        user: {
            email: string;
        };
    }, body: {
        email: string;
        academicYear?: string;
        module?: string;
    }): Promise<import("./whitelist.model").WhitelistEntry>;
    removeFromWhitelist(email: string): Promise<{
        message: string;
    }>;
    closeYear(academicYear: string): Promise<{
        message: string;
        affected: number;
    }>;
    getHelpDocs(): Promise<{
        usuarios: any;
        grupos: any;
        apiMetodos: any;
    }>;
    saveHelpDocs(req: {
        user?: {
            email?: string;
        };
    }, docs: {
        usuarios?: string;
        grupos?: string;
        apiMetodos?: string;
    }): Promise<{
        message: string;
    }>;
    getHelpDocsHistory(): Promise<unknown[]>;
    exportHelpDocsMarkdown(): Promise<{
        markdown: string;
    }>;
}
