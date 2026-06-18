import React from 'react';
import { Check } from 'lucide-react';

export const ComparisonTable = ({ properties }) => {
  if (!properties || properties.length < 2) return null;
  
  const [p1, p2] = properties;
  
  // Basic value calculation to highlight "better value"
  const p1Value = p1.mlPrediction / p1.currentPrice;
  const p2Value = p2.mlPrediction / p2.currentPrice;
  const p1Better = p1Value > p2Value;
  
  const Row = ({ label, v1, v2, isBetter1, isBetter2 }) => (
    <div className="flex border-b border-gray-100 last:border-0 py-3">
      <div className="w-1/3 text-sm text-gray-500 font-medium">{label}</div>
      <div className={`w-1/3 px-2 text-sm ${isBetter1 ? 'font-bold text-primary bg-primary/5 rounded-md' : 'text-gray-900'}`}>{v1}</div>
      <div className={`w-1/3 px-2 text-sm ${isBetter2 ? 'font-bold text-primary bg-primary/5 rounded-md' : 'text-gray-900'}`}>{v2}</div>
    </div>
  );

  return (
    <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-4">
      <div className="flex mb-4 pb-2 border-b border-gray-100">
        <div className="w-1/3"></div>
        <div className="w-1/3 px-2 font-bold text-gray-900 text-sm truncate">{p1.name}</div>
        <div className="w-1/3 px-2 font-bold text-gray-900 text-sm truncate">{p2.name}</div>
      </div>
      
      <Row label="Current Price" v1={`${p1.currentPrice.toLocaleString()}`} v2={`${p2.currentPrice.toLocaleString()}`} isBetter1={p1.currentPrice < p2.currentPrice} isBetter2={p2.currentPrice < p1.currentPrice} />
      <Row label="Predicted Value" v1={`${p1.mlPrediction.toLocaleString()}`} v2={`${p2.mlPrediction.toLocaleString()}`} />
      <Row label="ML Confidence" v1={`${p1.confidence}%`} v2={`${p2.confidence}%`} isBetter1={p1.confidence > p2.confidence} isBetter2={p2.confidence > p1.confidence} />
      <Row label="Bedrooms" v1={p1.bedrooms} v2={p2.bedrooms} isBetter1={p1.bedrooms > p2.bedrooms} isBetter2={p2.bedrooms > p1.bedrooms} />
      <Row label="Bathrooms" v1={p1.bathrooms} v2={p2.bathrooms} isBetter1={p1.bathrooms > p2.bathrooms} isBetter2={p2.bathrooms > p1.bathrooms} />
      <Row label="Square Feet" v1={p1.sqft} v2={p2.sqft} isBetter1={p1.sqft > p2.sqft} isBetter2={p2.sqft > p1.sqft} />
      <Row label="Year Built" v1={p1.yearBuilt} v2={p2.yearBuilt} isBetter1={p1.yearBuilt > p2.yearBuilt} isBetter2={p2.yearBuilt > p1.yearBuilt} />
      <Row label="Price/sqft" v1={`${Math.round(p1.currentPrice/p1.sqft)}`} v2={`${Math.round(p2.currentPrice/p2.sqft)}`} isBetter1={p1.currentPrice/p1.sqft < p2.currentPrice/p2.sqft} isBetter2={p2.currentPrice/p2.sqft < p1.currentPrice/p1.sqft} />
      
      <div className="mt-4 pt-4 border-t border-gray-100 flex items-center justify-center gap-2">
        <Check size={16} className="text-primary" />
        <span className="text-sm font-medium text-gray-900">
          <span className="text-primary">{p1Better ? p1.name : p2.name}</span> offers better ML value
        </span>
      </div>
    </div>
  );
};
