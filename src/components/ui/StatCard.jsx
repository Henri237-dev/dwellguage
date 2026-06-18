import React from 'react';
import { Card } from './Card';

export const StatCard = ({ label, value, trend, trendValue }) => {
  return (
    <Card className="p-4">
      <p className="text-gray-500 text-sm mb-1">{label}</p>
      <div className="flex items-end justify-between">
        <h3 className="text-xl font-bold text-gray-900 font-mono">{value}</h3>
        {trend && (
          <span className={`text-xs font-medium px-1.5 py-0.5 rounded-md ${trend === 'up' ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'}`}>
            {trend === 'up' ? '+' : ''}{trendValue}
          </span>
        )}
      </div>
    </Card>
  );
};
