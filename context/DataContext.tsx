
import React, { createContext, useState, useEffect, ReactNode } from 'react';
import { 
  ConsentRecord, 
  ConsentPolicy, 
  DataSubjectRequest, 
  AuditLogEntry,
  DataCategoryDefinition,
  ThirdPartyIntegration
} from '../types';

interface DataContextType {
  consentRecords: ConsentRecord[];
  updateConsentRecordInContext: (record: ConsentRecord) => void;
  consentPolicies: ConsentPolicy[];
  setConsentPolicies: React.Dispatch<React.SetStateAction<ConsentPolicy[]>>;
  dsrRequests: DataSubjectRequest[];
  setDsrRequests: React.Dispatch<React.SetStateAction<DataSubjectRequest[]>>;
  auditLogs: AuditLogEntry[];
  setAuditLogs: React.Dispatch<React.SetStateAction<AuditLogEntry[]>>;
  dataCategories: DataCategoryDefinition[];
  setDataCategories: React.Dispatch<React.SetStateAction<DataCategoryDefinition[]>>;
  thirdParties: ThirdPartyIntegration[];
  setThirdParties: React.Dispatch<React.SetStateAction<ThirdPartyIntegration[]>>;
}

export const DataContext = createContext<DataContextType | undefined>(undefined);

export const DataProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [consentRecords, setConsentRecords] = useState<ConsentRecord[]>([]);
  const [consentPolicies, setConsentPolicies] = useState<ConsentPolicy[]>([]);
  const [dsrRequests, setDsrRequests] = useState<DataSubjectRequest[]>([]);
  const [auditLogs, setAuditLogs] = useState<AuditLogEntry[]>([]);
  const [dataCategories, setDataCategories] = useState<DataCategoryDefinition[]>([]);
  const [thirdParties, setThirdParties] = useState<ThirdPartyIntegration[]>([]);

  // Initial Seed Data
  useEffect(() => {
    // Mocking initial data load
    setConsentRecords([
      { id: '1', userId: 'usr_882', consentType: 'Marketing', status: 'Granted', timestamp: new Date().toISOString(), details: 'Signed up via homepage', source: 'Web', legalBasis: 'Consent' },
      { id: '2', userId: 'usr_102', consentType: 'Data Sharing', status: 'Revoked', timestamp: new Date().toISOString(), details: 'Opted out via profile settings', source: 'Mobile', legalBasis: 'Consent' },
      { id: '3', userId: 'usr_443', consentType: 'Analytics', status: 'Granted', timestamp: new Date().toISOString(), details: 'Cookie banner acceptance', source: 'Web', legalBasis: 'Consent' },
      { id: '4', userId: 'usr_221', consentType: 'Essential', status: 'Granted', timestamp: new Date().toISOString(), details: 'Core service requirement', source: 'System', legalBasis: 'Legitimate Interest' },
    ]);

    setConsentPolicies([
      {
        id: 'pol-1', name: 'Global Marketing Policy', description: 'Rules for external marketing data.', dataCategories: ['Email', 'Behavioral'],
        legalBasis: 'Consent', retentionPeriod: '3 Years', version: 1, isActive: true, createdAt: '2023-01-01', updatedAt: '2023-10-15',
        regions: ['EU', 'US'], purpose: 'Lead generation', thirdPartySharing: true, thirdPartyList: ['SendGrid'], isAutomatedDecisionMaking: false, reviewCycleInDays: 365
      }
    ]);

    setDsrRequests([
      {
        id: 'dsr-1', userId: 'usr_882', requestType: 'Access', status: 'Pending', details: 'Wants all personal records.',
        submissionDate: new Date().toISOString(), requestedDataCategories: ['PII', 'Logs'], priority: 'High',
        dueDate: new Date(Date.now() + 30*24*60*60*1000).toISOString(), notes: []
      }
    ]);
  }, []);

  const updateConsentRecordInContext = (updated: ConsentRecord) => {
    setConsentRecords(prev => prev.map(r => r.id === updated.id ? updated : r));
  };

  return (
    <DataContext.Provider value={{
      consentRecords, updateConsentRecordInContext,
      consentPolicies, setConsentPolicies,
      dsrRequests, setDsrRequests,
      auditLogs, setAuditLogs,
      dataCategories, setDataCategories,
      thirdParties, setThirdParties
    }}>
      {children}
    </DataContext.Provider>
  );
};
