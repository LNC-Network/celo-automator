import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from './card';
import AnimatedCounter from './AnimatedCounter';
import StatusIndicator from './StatusIndicator';

interface MetricCardProps {
  title: string;
  value: number;
  change?: number;
  changeType?: 'positive' | 'negative' | 'neutral';
  icon?: React.ReactNode;
  status?: 'online' | 'offline' | 'warning' | 'error' | 'loading';
  description?: string;
  prefix?: string;
  suffix?: string;
  className?: string;
}

export const MetricCard: React.FC<MetricCardProps> = ({
  title,
  value,
  change,
  changeType = 'neutral',
  icon,
  status,
  description,
  prefix = '',
  suffix = '',
  className = ''
}) => {
  const changeColor = {
    positive: 'text-green-600',
    negative: 'text-red-600',
    neutral: 'text-gray-600'
  };

  const changeIcon = {
    positive: '↗',
    negative: '↘',
    neutral: '→'
  };

  return (
    <Card className={`relative overflow-hidden ${className}`}>
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <CardTitle className="text-sm font-medium text-gray-600">{title}</CardTitle>
        <div className="flex items-center space-x-2">
          {status && <StatusIndicator status={status} size="sm" />}
          {icon && <div className="text-gray-400">{icon}</div>}
        </div>
      </CardHeader>
      <CardContent>
        <div className="text-2xl font-bold text-gray-900">
          <AnimatedCounter
            value={value}
            prefix={prefix}
            suffix={suffix}
            duration={1000}
          />
        </div>
        {change !== undefined && (
          <div className={`flex items-center text-sm ${changeColor[changeType]}`}>
            <span className="mr-1">{changeIcon[changeType]}</span>
            <span>{Math.abs(change)}%</span>
            <span className="ml-1 text-gray-500">from last period</span>
          </div>
        )}
        {description && (
          <p className="text-xs text-gray-500 mt-1">{description}</p>
        )}
      </CardContent>
    </Card>
  );
};

export default MetricCard;
