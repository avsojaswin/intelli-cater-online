import React from 'react';

interface CardProps {
  children: React.ReactNode;
  className?: string;
  noPadding?: boolean;
}

export const Card: React.FC<CardProps> = ({ children, className = '', noPadding = false }) => {
  return (
    <div className={`bg-white rounded-xl border border-slate-200 shadow-card hover:shadow-card-hover transition-shadow duration-300 ${noPadding ? '' : 'p-6'} ${className}`}>
      {children}
    </div>
  );
};