import React from 'react';
import { Minus, Plus } from 'lucide-react';

export const NumberStepper = ({ value, onChange, min = 0, max = 10, label }) => {
  return (
    <div className="flex items-center justify-between py-2">
      <span className="text-sm text-gray-700">{label}</span>
      <div className="flex items-center gap-3">
        <button 
          type="button"
          onClick={() => onChange(Math.max(min, value - 1))}
          className="w-8 h-8 rounded-full border border-gray-200 flex items-center justify-center text-gray-500 hover:bg-gray-50"
          disabled={value <= min}
        >
          <Minus size={16} />
        </button>
        <span className="w-4 text-center font-medium">{value}</span>
        <button 
          type="button"
          onClick={() => onChange(Math.min(max, value + 1))}
          className="w-8 h-8 rounded-full border border-gray-200 flex items-center justify-center text-gray-500 hover:bg-gray-50"
          disabled={value >= max}
        >
          <Plus size={16} />
        </button>
      </div>
    </div>
  );
};
