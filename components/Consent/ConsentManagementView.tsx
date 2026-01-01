
import React, { useContext, useState, useMemo, useCallback, useEffect } from 'react';
import { PieChart, Pie, Cell, ResponsiveContainer, Legend, Tooltip } from 'recharts';
import { DataContext } from '../../context/DataContext';
import { performPrivacyAssessment } from '../../services/geminiService';
import { Card } from '../UI/Card';
import { Modal } from '../UI/Modal';
import { ConsentRecord, DataSubjectRequest } from '../../types';

// Tab Constants
const TABS = {
    DASHBOARD: 'Dashboard',
    RECORDS: 'Consent Records',
    POLICIES: 'Consent Policies',
    DSRS: 'DSR Requests',
    AUDIT: 'Audit Log',
    REPORTS: 'Reports',
} as const;

type TabKey = typeof TABS[keyof typeof TABS];

const ConsentManagementView: React.FC = () => {
    const context = useContext(DataContext);
    if (!context) return <div>Loading...</div>;

    const { consentRecords, consentPolicies, dsrRequests } = context;
    const [activeTab, setActiveTab] = useState<TabKey>(TABS.DASHBOARD);
    
    // AI Assessment State
    const [isAssessorOpen, setAssessorOpen] = useState(false);
    const [aiPrompt, setAiPrompt] = useState("");
    const [aiAssessment, setAiAssessment] = useState('');
    const [isLoadingAI, setIsLoadingAI] = useState(false);

    // Chart Data Calculation
    const chartData = useMemo(() => {
        const types = ['Marketing', 'Data Sharing', 'Analytics', 'Essential'];
        return types.map(t => ({
            name: t,
            value: consentRecords.filter(r => r.consentType === t && r.status === 'Granted').length
        })).filter(item => item.value > 0);
    }, [consentRecords]);

    const COLORS = ['#06b6d4', '#8b5cf6', '#10b981', '#f59e0b'];

    const handleAssess = async () => {
        if (!aiPrompt.trim()) return;
        setIsLoadingAI(true);
        setAiAssessment('');
        try {
            const prompt = `Conduct a high-level privacy impact assessment for this activity: "${aiPrompt}". Focus on GDPR/CCPA implications.`;
            const result = await performPrivacyAssessment(prompt);
            setAiAssessment(result);
        } catch (err: any) {
            setAiAssessment("Error performing AI assessment: " + err.message);
        } finally {
            setIsLoadingAI(false);
        }
    };

    return (
        <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-700">
            {/* Page Header */}
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                <div>
                    <h1 className="text-3xl font-bold text-white">Compliance Workspace</h1>
                    <p className="text-slate-400 text-sm mt-1">Manage global user consent and regulatory responses.</p>
                </div>
                <div className="flex gap-3">
                    <button 
                        onClick={() => setAssessorOpen(true)}
                        className="inline-flex items-center px-4 py-2.5 bg-cyan-600 hover:bg-cyan-500 text-white rounded-xl text-sm font-semibold transition-all shadow-lg shadow-cyan-900/20 active:scale-95"
                    >
                        <svg className="w-4 h-4 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" /></svg>
                        AI Privacy Assessment
                    </button>
                </div>
            </div>

            {/* Navigation Tabs */}
            <div className="bg-slate-900/30 p-1 rounded-2xl inline-flex flex-wrap border border-slate-800/50">
                {Object.values(TABS).map((tab) => (
                    <button
                        key={tab}
                        onClick={() => setActiveTab(tab)}
                        className={`px-5 py-2.5 rounded-xl text-sm font-semibold transition-all ${
                            activeTab === tab 
                            ? 'bg-slate-800 text-white shadow-sm ring-1 ring-slate-700/50' 
                            : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/40'
                        }`}
                    >
                        {tab}
                    </button>
                ))}
            </div>

            {/* Dashboard Content */}
            {activeTab === TABS.DASHBOARD && (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {/* Summary Stats */}
                    <Card title="Active Consents By Type" className="lg:col-span-2">
                        <div className="h-[300px] w-full">
                            {chartData.length > 0 ? (
                                <ResponsiveContainer width="100%" height="100%">
                                    <PieChart>
                                        <Pie 
                                            data={chartData} 
                                            dataKey="value" 
                                            nameKey="name" 
                                            cx="50%" 
                                            cy="50%" 
                                            innerRadius={60}
                                            outerRadius={100} 
                                            paddingAngle={5}
                                            label={({ name, percent }) => `${name} (${(percent * 100).toFixed(0)}%)`}
                                        >
                                            {chartData.map((_, i) => <Cell key={`cell-${i}`} fill={COLORS[i % COLORS.length]} />)}
                                        </Pie>
                                        <Tooltip 
                                            contentStyle={{ backgroundColor: '#1e293b', border: '1px solid #334155', borderRadius: '12px' }}
                                            itemStyle={{ color: '#f1f5f9' }}
                                        />
                                        <Legend verticalAlign="bottom" height={36}/>
                                    </PieChart>
                                </ResponsiveContainer>
                            ) : (
                                <div className="h-full flex items-center justify-center text-slate-500">No active consent records found.</div>
                            )}
                        </div>
                    </Card>

                    <Card title="DSR Backlog">
                        <div className="space-y-4">
                            <div className="flex justify-between items-center bg-slate-800/40 p-3 rounded-xl">
                                <span className="text-slate-400 text-sm">Total Requests</span>
                                <span className="text-xl font-bold text-white">{dsrRequests.length}</span>
                            </div>
                            <div className="flex justify-between items-center bg-slate-800/40 p-3 rounded-xl">
                                <span className="text-slate-400 text-sm">Urgent/High</span>
                                <span className="text-xl font-bold text-red-400">
                                    {dsrRequests.filter(d => d.priority === 'Urgent' || d.priority === 'High').length}
                                </span>
                            </div>
                            <div className="pt-4 border-t border-slate-700/50">
                                <h4 className="text-xs font-bold text-slate-500 uppercase tracking-widest mb-3">Pending Tasks</h4>
                                {dsrRequests.slice(0, 3).map(dsr => (
                                    <div key={dsr.id} className="flex items-center gap-3 mb-3">
                                        <div className={`w-2 h-2 rounded-full ${dsr.priority === 'High' ? 'bg-orange-500' : 'bg-cyan-500'}`}></div>
                                        <div className="flex-1 min-w-0">
                                            <p className="text-sm font-medium text-slate-200 truncate">{dsr.requestType} - {dsr.userId}</p>
                                            <p className="text-[10px] text-slate-500">Due: {new Date(dsr.dueDate).toLocaleDateString()}</p>
                                        </div>
                                    </div>
                                ))}
                            </div>
                            <button onClick={() => setActiveTab(TABS.DSRS)} className="w-full py-2 text-sm font-semibold text-cyan-400 hover:text-cyan-300 transition-colors">
                                View Full Backlog →
                            </button>
                        </div>
                    </Card>

                    <Card title="Recent Activity" className="lg:col-span-full">
                        <div className="overflow-x-auto">
                            <table className="w-full text-left">
                                <thead className="text-xs font-bold text-slate-500 uppercase tracking-widest border-b border-slate-800">
                                    <tr>
                                        <th className="px-4 py-3">Subject</th>
                                        <th className="px-4 py-3">Type</th>
                                        <th className="px-4 py-3">Status</th>
                                        <th className="px-4 py-3">Legal Basis</th>
                                        <th className="px-4 py-3">Timestamp</th>
                                    </tr>
                                </thead>
                                <tbody className="text-sm text-slate-300 divide-y divide-slate-800">
                                    {consentRecords.slice(0, 5).map(record => (
                                        <tr key={record.id} className="hover:bg-slate-800/20 transition-colors">
                                            <td className="px-4 py-4 font-medium text-white">{record.userId}</td>
                                            <td className="px-4 py-4">{record.consentType}</td>
                                            <td className="px-4 py-4">
                                                <span className={`px-2 py-1 rounded-lg text-[10px] font-bold uppercase ${record.status === 'Granted' ? 'bg-green-500/10 text-green-400' : 'bg-red-500/10 text-red-400'}`}>
                                                    {record.status}
                                                </span>
                                            </td>
                                            <td className="px-4 py-4 text-slate-500">{record.legalBasis}</td>
                                            <td className="px-4 py-4 text-slate-500 font-mono text-xs">{new Date(record.timestamp).toLocaleTimeString()}</td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    </Card>
                </div>
            )}

            {/* Other Tab Views Placeholder */}
            {activeTab !== TABS.DASHBOARD && (
                <div className="flex flex-col items-center justify-center py-20 text-slate-500">
                    <svg className="w-16 h-16 mb-4 opacity-20" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" /></svg>
                    <p className="text-lg font-medium">{activeTab} section is currently being updated.</p>
                    <button onClick={() => setActiveTab(TABS.DASHBOARD)} className="mt-4 text-cyan-400 hover:underline">Return to Dashboard</button>
                </div>
            )}

            {/* AI Modal */}
            <Modal isOpen={isAssessorOpen} onClose={() => setAssessorOpen(false)} title="AI Privacy Impact Assessment">
                <div className="space-y-6">
                    <p className="text-slate-400 text-sm">
                        Describe a data collection practice or specific system feature below. Our Gemini-powered assistant will identify potential GDPR/CCPA risks and suggest mitigations.
                    </p>
                    <textarea 
                        value={aiPrompt}
                        onChange={(e) => setAiPrompt(e.target.value)}
                        placeholder="e.g. We want to collect user geolocation every 5 minutes for fraud detection and store it for 6 months."
                        className="w-full h-32 bg-slate-950 border border-slate-800 rounded-xl p-4 text-slate-200 focus:ring-2 focus:ring-cyan-500 focus:border-transparent outline-none transition-all placeholder-slate-600"
                    />
                    <button 
                        onClick={handleAssess}
                        disabled={isLoadingAI || !aiPrompt.trim()}
                        className="w-full py-3 bg-cyan-600 hover:bg-cyan-500 text-white rounded-xl font-bold transition-all disabled:opacity-50 flex items-center justify-center gap-2"
                    >
                        {isLoadingAI ? (
                            <>
                                <svg className="animate-spin h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24"><circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle><path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path></svg>
                                Analyzing Data Practice...
                            </>
                        ) : 'Run Impact Assessment'}
                    </button>

                    {aiAssessment && (
                        <div className="mt-8 p-6 bg-slate-950/50 border border-slate-800 rounded-2xl animate-in slide-in-from-top-2 duration-300">
                            <div className="flex items-center gap-2 mb-4 text-cyan-400">
                                <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
                                <span className="font-bold text-sm uppercase tracking-widest">Assessment Report</span>
                            </div>
                            <div className="text-slate-300 text-sm leading-relaxed whitespace-pre-wrap prose prose-invert prose-cyan">
                                {aiAssessment}
                            </div>
                        </div>
                    )}
                </div>
            </Modal>
        </div>
    );
};

export default ConsentManagementView;
