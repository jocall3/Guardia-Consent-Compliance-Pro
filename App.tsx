
import React, { useState } from 'react';
import { DataProvider } from './context/DataContext';
import ConsentManagementView from './components/Consent/ConsentManagementView';

const App: React.FC = () => {
  return (
    <DataProvider>
      <div className="min-h-screen bg-slate-950 text-slate-200">
        <header className="bg-slate-900/50 border-b border-slate-800/50 backdrop-blur-md sticky top-0 z-40">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex justify-between h-16 items-center">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 bg-cyan-500 rounded-lg flex items-center justify-center">
                  <svg className="w-5 h-5 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                  </svg>
                </div>
                <span className="text-xl font-bold bg-gradient-to-r from-cyan-400 to-blue-500 bg-clip-text text-transparent">
                  Guardia
                </span>
                <span className="text-xs font-medium text-slate-400 uppercase tracking-widest ml-2 px-2 py-0.5 bg-slate-800 rounded">
                  v2.0 PRO
                </span>
              </div>
              <div className="hidden md:flex items-center space-x-4">
                <button className="text-sm font-medium text-slate-400 hover:text-white transition-colors">Documentation</button>
                <button className="text-sm font-medium text-slate-400 hover:text-white transition-colors">Support</button>
                <div className="h-4 w-px bg-slate-800"></div>
                <div className="flex items-center gap-3">
                  <div className="text-right">
                    <p className="text-xs font-semibold text-white">Chief Privacy Officer</p>
                    <p className="text-[10px] text-slate-400">Admin Account</p>
                  </div>
                  <div className="w-8 h-8 rounded-full bg-slate-700 flex items-center justify-center border border-slate-600">
                    <svg className="w-4 h-4 text-slate-300" fill="currentColor" viewBox="0 0 20 20"><path fillRule="evenodd" d="M10 9a3 3 0 100-6 3 3 0 000 6zm-7 9a7 7 0 1114 0H3z" clipRule="evenodd" /></svg>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </header>

        <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <ConsentManagementView />
        </main>
      </div>
    </DataProvider>
  );
};

export default App;
