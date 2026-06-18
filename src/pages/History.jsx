import React from 'react';
import { PageWrapper } from '../components/layout/PageWrapper';
import { TopHeader } from '../components/layout/TopHeader';
import { BottomNav } from '../components/layout/BottomNav';
import { useAppContext } from '../context/AppContext';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

export const History = () => {
  const { savedValuations, clearHistory } = useAppContext();

  const chartData = [...savedValuations].reverse().map((val, i) => ({
    date: new Date(val.date).toLocaleDateString(undefined, { month: 'short', day: 'numeric' }),
    price: val.price
  }));

  return (
    <PageWrapper noPadding>
      <TopHeader title="Valuation History" subtitle="Track your estimates over time" />
      <div className="p-4 space-y-6">
        
        {savedValuations.length > 1 && (
          <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-4">
            <h3 className="font-bold text-gray-900 text-sm mb-4">Value Trend</h3>
            <div className="h-48 w-full">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={chartData} margin={{ top: 5, right: 5, left: -10, bottom: 0 }}>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f0f0f0" />
                  <XAxis dataKey="date" tick={{ fontSize: 10, fill: '#9ca3af' }} axisLine={false} tickLine={false} />
                  <YAxis tick={{ fontSize: 10, fill: '#9ca3af' }} axisLine={false} tickLine={false} tickFormatter={(v) => `${v/1000}k`} />
                  <Tooltip 
                    contentStyle={{ borderRadius: '8px', border: 'none', boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)' }}
                  />
                  <Line type="monotone" dataKey="price" stroke="#7c3aed" strokeWidth={3} dot={{ r: 4, fill: '#7c3aed' }} activeDot={{ r: 6 }} />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </div>
        )}

        <div>
          <div className="flex justify-between items-center mb-4">
            <h3 className="font-bold text-gray-900">Saved Estimates</h3>
            {savedValuations.length > 0 && (
              <button onClick={clearHistory} className="text-xs text-red-500 font-medium bg-red-50 px-2 py-1 rounded">Clear</button>
            )}
          </div>
          
          {savedValuations.length === 0 ? (
            <p className="text-center text-sm text-gray-500 mt-8">You haven't saved any valuations yet.</p>
          ) : (
            <div className="space-y-3">
              {savedValuations.map((val, i) => (
                <div key={i} className="bg-white rounded-2xl shadow-sm border border-gray-100 p-4">
                  <div className="flex justify-between border-b border-gray-50 pb-2 mb-2">
                    <div>
                      <h4 className="font-bold text-gray-900">{val.formData.address || 'Unknown Address'}</h4>
                      <p className="text-xs text-gray-500">{val.formData.neighborhood} • {val.formData.propertyType}</p>
                    </div>
                    <span className="text-xs text-gray-400">{new Date(val.date).toLocaleDateString()}</span>
                  </div>
                  <div className="flex justify-between items-end">
                    <div className="text-xs text-gray-500 space-y-0.5">
                      <p>{val.formData.bedrooms} beds • {val.formData.bathrooms} baths</p>
                      <p>Confidence: <span className="text-green-600 font-bold">{val.confidence}%</span></p>
                    </div>
                    <div className="text-right">
                      <span className="text-lg font-bold font-mono text-primary">{val.price.toLocaleString()} XAF</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
      <BottomNav />
    </PageWrapper>
  );
};
