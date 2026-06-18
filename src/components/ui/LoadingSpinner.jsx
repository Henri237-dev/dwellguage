import React from 'react';
import { Loader2 } from 'lucide-react';

export const LoadingSpinner = ({ text = 'Processing...', className = '' }) => {
  return (
    <div className={`flex flex-col items-center justify-center space-y-3 ${className}`}>
      <Loader2 className="w-8 h-8 text-primary animate-spin" />
      <p className="text-sm text-gray-500 font-medium">{text}</p>
    </div>
  );
};
