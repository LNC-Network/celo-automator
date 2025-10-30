import React from 'react';

interface GradientCardProps {
  children: React.ReactNode;
  gradient?: 'blue' | 'purple' | 'green' | 'orange' | 'pink' | 'indigo';
  className?: string;
  padding?: 'sm' | 'md' | 'lg';
}

export const GradientCard: React.FC<GradientCardProps> = ({
  children,
  gradient = 'blue',
  className = '',
  padding = 'md'
}) => {
  const gradientClasses = {
    blue: 'from-blue-500 to-blue-600',
    purple: 'from-purple-500 to-purple-600',
    green: 'from-green-500 to-green-600',
    orange: 'from-orange-500 to-orange-600',
    pink: 'from-pink-500 to-pink-600',
    indigo: 'from-indigo-500 to-indigo-600'
  };

  const paddingClasses = {
    sm: 'p-4',
    md: 'p-6',
    lg: 'p-8'
  };

  return (
    <div className={`relative overflow-hidden rounded-xl bg-gradient-to-r ${gradientClasses[gradient]} ${className}`}>
      <div className={`relative z-10 ${paddingClasses[padding]}`}>
        {children}
      </div>
      <div className="absolute inset-0 bg-black/10" />
    </div>
  );
};

export default GradientCard;
