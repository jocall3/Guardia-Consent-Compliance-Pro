
export interface ConsentRecord {
    id: string;
    userId: string;
    consentType: 'Marketing' | 'Data Sharing' | 'Analytics' | 'Essential';
    status: 'Granted' | 'Revoked';
    timestamp: string;
    details: string;
    source: string;
    legalBasis: string;
    expirationDate?: string;
}

export interface ConsentPolicy {
    id: string;
    name: string;
    description: string;
    dataCategories: string[];
    legalBasis: string;
    retentionPeriod: string;
    version: number;
    isActive: boolean;
    createdAt: string;
    updatedAt: string;
    regions: string[];
    purpose: string;
    thirdPartySharing: boolean;
    thirdPartyList: string[];
    isAutomatedDecisionMaking: boolean;
    automatedDecisionDetails?: string;
    reviewCycleInDays: number;
    lastReviewedAt?: string;
    nextReviewAt?: string;
}

export interface DataSubjectRequest {
    id: string;
    userId: string;
    requestType: 'Access' | 'Erasure' | 'Rectification' | 'Portability' | 'Objection' | 'Restriction';
    status: 'Pending' | 'In Progress' | 'Completed' | 'Rejected' | 'On Hold';
    details: string;
    submissionDate: string;
    completionDate?: string;
    requestedDataCategories: string[];
    assignedTo?: string;
    notes: RequestNote[];
    attachments?: string[];
    priority: 'Low' | 'Medium' | 'High' | 'Urgent';
    dueDate: string;
}

export interface RequestNote {
    id: string;
    authorId: string;
    timestamp: string;
    content: string;
}

export interface AuditLogEntry {
    id: string;
    timestamp: string;
    userId: string;
    action: string;
    entityType: 'ConsentRecord' | 'ConsentPolicy' | 'DataSubjectRequest' | 'System';
    entityId: string;
    details: string;
    ipAddress?: string;
    affectedFields?: string[];
    oldValue?: any;
    newValue?: any;
}

export interface ConsentTrendData {
    date: string;
    granted: number;
    revoked: number;
    newConsents: number;
    optOuts: number;
}

export interface DataCategoryDefinition {
    id: string;
    name: string;
    description: string;
    sensitive: boolean;
    examples: string[];
}

export interface ThirdPartyIntegration {
    id: string;
    name: string;
    description: string;
    dataCategoriesShared: string[];
    regions: string[];
    contractSigned: boolean;
    dpaSigned: boolean;
    status: 'Active' | 'Inactive' | 'Pending Review';
    lastReviewedAt: string;
}
