import React from 'react';
import { PageWrapper } from '../components/layout/PageWrapper';
import { TopHeader } from '../components/layout/TopHeader';
import { BottomNav } from '../components/layout/BottomNav';
import { StatCard } from '../components/ui/StatCard';
import { PropertyCard } from '../components/property/PropertyCard';
import { mockProperties } from '../data/mockProperties';
import { useAppContext } from '../context/AppContext';
import { useNavigate } from 'react-router-dom';

export const Dashboard = () => {
  const { user, savedValuations } = useAppContext();
  const navigate = useNavigate();

  return (
    <PageWrapper noPadding>
      <TopHeader />
      <div className="p-4">
        <div className="bg-hero-gradient rounded-2xl p-6 text-white mb-6">
          <h2 className="text-2xl font-bold">Welcome, {user?.name || 'User'}!</h2>
          <p className="text-purple-200 text-sm mt-1 mb-4">Your personalized property dashboard</p>
          
          <button 
            onClick={() => navigate('/valuation')}
            className="px-4 py-2 bg-white text-primary rounded-full text-sm font-medium hover:bg-gray-50 transition-colors w-full"
          >
            + New Valuation
          </button>
        </div>

        <div className="grid grid-cols-2 gap-4 mb-6">
          <div className="col-span-2">
            <StatCard label="Total Saved Estimates" value={savedValuations.length.toString()} trend="up" trendValue="+1 this week" />
          </div>
          <StatCard label="Total Properties" value={mockProperties.length.toString()} />
          <StatCard label="Active Listings" value={mockProperties.filter(p => p.status === 'For Rent').length.toString()} />
        </div>

        {savedValuations.length > 0 && (
          <div className="mb-6">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-bold text-gray-900">Recent Estimates</h3>
              <button onClick={() => navigate('/history')} className="text-sm font-medium text-primary">View all</button>
            </div>
            <div className="space-y-3">
              {savedValuations.slice(0, 2).map((val, i) => (
                <div key={i} className="bg-white border border-gray-100 rounded-xl p-3 flex justify-between items-center shadow-sm">
                  <div>
                    <p className="font-bold text-gray-900 text-sm">{val.formData.address || val.formData.neighborhood}</p>
                    <p className="text-xs text-gray-500">{new Date(val.date).toLocaleDateString()}</p>
                  </div>
                  <div className="text-right">
                    <p className="font-bold font-mono text-primary">{val.price.toLocaleString()} XAF</p>
                    <p className="text-[10px] text-gray-400">Confidence: {val.confidence}%</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        <div className="flex items-center justify-between mb-4 mt-6">
          <h3 className="text-lg font-bold text-gray-900">Trending Properties</h3>
        </div>
        
        <div className="space-y-4">
          {mockProperties.filter(p => p.neighborhood === 'Molyko').slice(0, 1)
            .concat(mockProperties.filter(p => p.neighborhood === 'Mayor Street').slice(0, 1))
            .concat(mockProperties.filter(p => p.neighborhood !== 'Molyko' && p.neighborhood !== 'Mayor Street').slice(0, 1))
            .map(p => <PropertyCard key={p.id} property={p} />)}
        </div>
      </div>
      <BottomNav />
    </PageWrapper>
  );
};
