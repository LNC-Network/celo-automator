import React from 'react';

interface StatusIndicatorProps {
  status: 'online' | 'offline' | 'warning' | 'error' | 'loading';
  size?: 'sm' | 'md' | 'lg';
  showPulse?: boolean;
  className?: string;
}

export const StatusIndicator: React.FC<StatusIndicatorProps> = ({
  status,
  size = 'md',
  showPulse = true,
  className = ''
}) => {
  const sizeClasses = {
    sm: 'w-2 h-2',
    md: 'w-3 h-3',
    lg: 'w-4 h-4'
  };

  const statusClasses = {
    online: 'bg-green-500',
    offline: 'bg-gray-400',
    warning: 'bg-yellow-500',
    error: 'bg-red-500',
    loading: 'bg-blue-500'
  };

  const pulseClasses = showPulse && status === 'online' ? 'animate-pulse' : '';

  return (
    <div
      className={`${sizeClasses[size]} ${statusClasses[status]} ${pulseClasses} rounded-full ${className}`}
    />
  );
};

export default StatusIndicator;
