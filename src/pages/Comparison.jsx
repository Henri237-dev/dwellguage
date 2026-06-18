import React from 'react';
import { PageWrapper } from '../components/layout/PageWrapper';
import { TopHeader } from '../components/layout/TopHeader';
import { BottomNav } from '../components/layout/BottomNav';
import { ComparisonTable } from '../components/property/ComparisonTable';
import { mockProperties } from '../data/mockProperties';

export const Comparison = () => {
  // Select two properties to compare
  const propertiesToCompare = [mockProperties[1], mockProperties[2]];

  return (
    <PageWrapper noPadding>
      <TopHeader title="Property Comparison" subtitle="Compare similar properties in the area" />
      <div className="p-4">
        <ComparisonTable properties={propertiesToCompare} />
      </div>
      <BottomNav />
    </PageWrapper>
  );
};
