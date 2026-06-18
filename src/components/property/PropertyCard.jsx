import React, { useState } from 'react';
import { Badge } from '../ui/Badge';
import { Bed, Bath, Info, X } from 'lucide-react';

export const PropertyCard = ({ property, onClick }) => {
  const [expanded, setExpanded] = useState(false);

  return (
    <div 
      onClick={() => {
        setExpanded(!expanded);
        if (onClick) onClick(property);
      }}
      className={`bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden mb-4 cursor-pointer hover:shadow-md transition-all p-4 relative ${expanded ? 'ring-2 ring-blue-500' : ''}`}
    >
      <div className="absolute top-4 right-4">
        <Badge variant={property.status === 'For Rent' ? 'primary' : 'success'}>
          {property.status}
        </Badge>
      </div>
      <div>
        <h3 className="font-bold text-gray-900 pr-20">{property.address}</h3>
        <p className="text-xs text-gray-500 mb-4 font-medium"><span className="text-primary">{property.exactType}</span> • {property.neighborhood}, South West</p>
        
        <div className="flex items-center gap-4 text-gray-600 text-xs mb-4">
          <div className="flex items-center gap-1"><Bed size={14}/> {property.bedrooms}bed</div>
          <div className="flex items-center gap-1"><Bath size={14}/> {property.bathrooms}bath</div>
        </div>

        <div className="space-y-1">
          <div className="flex justify-between items-center text-sm">
            <span className="text-gray-500">Current Price:</span>
            <span className="font-mono font-bold text-gray-900">{property.currentPrice.toLocaleString()} XAF</span>
          </div>
          <div className="flex justify-between items-center text-sm">
            <span className="text-accent font-medium">ML Prediction:</span>
            <span className="font-mono font-bold text-accent">{property.mlPrediction.toLocaleString()} XAF</span>
          </div>
        </div>

        <div className="mt-4 pt-3 border-t border-gray-50 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="text-xs text-gray-500">Confidence:</span>
            <div className="w-16 h-1.5 bg-gray-100 rounded-full overflow-hidden">
              <div className="h-full bg-green-500 rounded-full" style={{ width: `${property.confidence}%` }}></div>
            </div>
            <span className="text-xs font-medium text-gray-700">{property.confidence}%</span>
          </div>
          <Badge variant="success">+{((property.mlPrediction - property.currentPrice) / property.currentPrice * 100).toFixed(1)}%</Badge>
        </div>

        {expanded && (
          <div className="mt-4 pt-4 border-t border-gray-100 animate-in fade-in slide-in-from-top-2">
            <h4 className="font-bold text-sm text-gray-900 mb-2 flex items-center gap-1"><Info size={14}/> Property Details</h4>
            <div className="grid grid-cols-2 gap-y-2 gap-x-4 text-xs">
              <div className="text-gray-500">Water Supply: <span className="text-gray-900 font-medium">{property.waterSupply || 'Unknown'}</span></div>
              <div className="text-gray-500">Stable Electricity: <span className="text-gray-900 font-medium">{property.electricityStable || 'Unknown'}</span></div>
              <div className="text-gray-500">Internet Ready: <span className="text-gray-900 font-medium">{property.internetReady || 'Unknown'}</span></div>
              <div className="text-gray-500">Perimeter Fence: <span className="text-gray-900 font-medium">{property.hasFence ? 'Yes' : 'No'}</span></div>
              <div className="text-gray-500">Parking Space: <span className="text-gray-900 font-medium">{property.hasParking ? 'Yes' : 'No'}</span></div>
              <div className="text-gray-500">Security Guard: <span className="text-gray-900 font-medium">{property.hasGuard ? 'Yes' : 'No'}</span></div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
