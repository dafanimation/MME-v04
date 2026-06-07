import { OnModuleInit } from '@nestjs/common';
import { Repository } from 'typeorm';
import { WhitelistEntry } from './whitelist.model';
export declare class AdminService implements OnModuleInit {
    private whitelistRepository;
    constructor(whitelistRepository: Repository<WhitelistEntry>);
    onModuleInit(): Promise<void>;
    private importFromExcel;
    getWhitelist(filters?: {
        academicYear?: string;
        module?: string;
        isActive?: boolean;
    }): Promise<WhitelistEntry[]>;
    isEmailAllowed(email: string): Promise<boolean>;
    addToWhitelist(email: string, options?: {
        academicYear?: string;
        module?: string;
        approvedBy?: string;
    }): Promise<WhitelistEntry>;
    removeFromWhitelist(email: string): Promise<{
        message: string;
    }>;
    closeAcademicYear(academicYear: string): Promise<{
        message: string;
        affected: number;
    }>;
    private readonly defaultHelpDocs;
    private getHelpDocsPath;
    private getHelpDocsHistoryPath;
    private ensureDataDir;
    getHelpDocs(): Promise<{
        usuarios: any;
        grupos: any;
        apiMetodos: any;
    }>;
    saveHelpDocs(docs: {
        usuarios?: string;
        grupos?: string;
        apiMetodos?: string;
    }, updatedBy?: string): Promise<{
        message: string;
    }>;
    getHelpDocsHistory(): Promise<unknown[]>;
    exportHelpDocsMarkdown(): Promise<{
        markdown: string;
    }>;
}
