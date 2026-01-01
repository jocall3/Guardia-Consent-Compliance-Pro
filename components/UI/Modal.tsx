
import React from 'react';

export const Modal: React.FC<{ 
    isOpen: boolean; 
    onClose: () => void; 
    title: string; 
    children: React.ReactNode; 
    size?: 'sm' | 'md' | 'lg' | 'xl' | '2xl' | '3xl' | '4xl' 
}> = ({ isOpen, onClose, title, children, size = 'xl' }) => {
    if (!isOpen) return null;

    const sizeClasses = {
        sm: 'max-w-sm', md: 'max-w-md', lg: 'max-w-lg', xl: 'max-w-xl', '2xl': 'max-w-2xl', '3xl': 'max-w-3xl', '4xl': 'max-w-4xl'
    };

    return (
        <div className="fixed inset-0 bg-slate-950/80 backdrop-blur-sm flex items-center justify-center z-50 p-4" onClick={onClose}>
            <div className={`bg-slate-900 border border-slate-700/50 rounded-2xl shadow-2xl w-full ${sizeClasses[size]} mx-auto transform transition-all animate-in fade-in zoom-in duration-200`} onClick={e => e.stopPropagation()}>
                <div className="px-6 py-4 border-b border-slate-800 flex justify-between items-center">
                    <h3 className="text-xl font-bold text-white">{title}</h3>
                    <button onClick={onClose} className="text-slate-400 hover:text-white p-2 transition-colors">
                        <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" /></svg>
                    </button>
                </div>
                <div className="p-6 max-h-[85vh] overflow-y-auto">
                    {children}
                </div>
            </div>
        </div>
    );
};
