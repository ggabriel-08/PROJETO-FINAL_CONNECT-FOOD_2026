import React from 'react';

interface BadgeProps {
  variant: 'active' | 'removed' | 'inactive' | 'info' | 'warning';
  children: React.ReactNode;
  className?: string;
}

export const Badge: React.FC<BadgeProps> = ({ variant, children, className = '' }) => {
  const styles = {
    active: 'bg-emerald-100 text-emerald-800 border-emerald-200',
    removed: 'bg-red-100 text-red-700 border-red-200',
    inactive: 'bg-gray-100 text-gray-600 border-gray-200',
    info: 'bg-amber-100 text-amber-800 border-amber-200',
    warning: 'bg-orange-100 text-orange-800 border-orange-200',
  };

  return (
    <span
      className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium border ${styles[variant]} ${className}`}
    >
      {children}
    </span>
  );
};
