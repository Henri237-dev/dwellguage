import React from 'react';
import { PageWrapper } from '../components/layout/PageWrapper';
import { TopHeader } from '../components/layout/TopHeader';
import { BottomNav } from '../components/layout/BottomNav';
import { StatCard } from '../components/ui/StatCard';
import { AccuracyBarChart } from '../components/charts/AccuracyBarChart';

export const MarketInsights = () => {
  return (
    <PageWrapper noPadding>
      <TopHeader title="Market Insights" subtitle="Real-time analytics and ML predictions" />
      <div className="p-4 space-y-6">
        
        <div className="grid grid-cols-2 gap-4">
          <StatCard label="Median Price" value="45,000 XAF" trend="up" trendValue="2%" />
          <div className="col-span-1">
            <StatCard label="Market Temperature" value="Hot 🔥" />
          </div>
        </div>

        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-4">
          <h3 className="font-bold text-gray-900 text-sm mb-1">Prediction Accuracy Comparison</h3>
          <p className="text-xs text-gray-500 mb-4">ML Model vs Traditional Valuations by price range</p>
          <AccuracyBarChart />
        </div>

      </div>
      <BottomNav />
    </PageWrapper>
  );
};
