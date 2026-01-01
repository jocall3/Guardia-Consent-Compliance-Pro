
import React from 'react';

interface CardProps {
  title?: string;
  children: React.ReactNode;
  className?: string;
  actions?: React.ReactNode;
}

export const Card: React.FC<CardProps> = ({ title, children, className = '', actions }) => {
  return (
    <div className={`bg-slate-800/50 border border-slate-700/50 rounded-xl overflow-hidden shadow-sm backdrop-blur-sm ${className}`}>
      {(title || actions) && (
        <div className="px-6 py-4 border-b border-slate-700/50 flex items-center justify-between">
          {title && <h3 className="text-lg font-semibold text-slate-100">{title}</h3>}
          {actions && <div className="flex gap-2">{actions}</div>}
        </div>
      )}
      <div className="p-6">
        {children}
      </div>
    </div>
  );
};
