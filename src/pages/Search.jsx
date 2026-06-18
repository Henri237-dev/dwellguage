import React, { useState } from 'react';
import { PageWrapper } from '../components/layout/PageWrapper';
import { TopHeader } from '../components/layout/TopHeader';
import { BottomNav } from '../components/layout/BottomNav';
import { PropertyCard } from '../components/property/PropertyCard';
import { mockProperties } from '../data/mockProperties';
import { Search as SearchIcon, SlidersHorizontal, ChevronDown } from 'lucide-react';

export const Search = () => {
  const [filter, setFilter] = useState('All');
  const [sort, setSort] = useState('Newest');
  const [searchQuery, setSearchQuery] = useState('');

  const filteredProps = mockProperties
    .filter(p => {
      if (filter !== 'All' && p.status !== filter) return false;
      if (searchQuery) {
        const q = searchQuery.toLowerCase();
        return p.name.toLowerCase().includes(q) || 
               p.address.toLowerCase().includes(q) || 
               p.neighborhood.toLowerCase().includes(q);
      }
      return true;
    })
    .sort((a, b) => {
      if (sort === 'Price High to Low') return b.currentPrice - a.currentPrice;
      if (sort === 'Price Low to High') return a.currentPrice - b.currentPrice;
      return 0; // Newest
    });

  return (
    <PageWrapper noPadding>
      <TopHeader title="Search Listings" />
      <div className="p-4">
        
        <div className="relative mb-6">
          <SearchIcon size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" />
          <input 
            type="text" 
            placeholder="Search neighborhoods, types..." 
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full bg-white border border-gray-200 rounded-full py-3 pl-11 pr-4 text-sm focus:outline-none focus:ring-2 focus:ring-primary/40 shadow-sm"
          />
        </div>

        <div className="flex gap-2 mb-6 overflow-x-auto pb-2 scrollbar-hide">
          <div className="flex items-center gap-1 px-3 py-1.5 bg-white border border-gray-200 rounded-full text-xs font-medium text-gray-700 whitespace-nowrap shadow-sm">
            <SlidersHorizontal size={14} className="text-gray-400" /> Filters
          </div>
          <button onClick={() => setFilter('All')} className={`px-4 py-1.5 rounded-full text-xs font-medium whitespace-nowrap transition-colors ${filter === 'All' ? 'bg-primary text-white' : 'bg-white border border-gray-200 text-gray-700'}`}>
            All Status
          </button>
          <button onClick={() => setFilter('For Rent')} className={`px-4 py-1.5 rounded-full text-xs font-medium whitespace-nowrap transition-colors ${filter === 'For Rent' ? 'bg-primary text-white' : 'bg-white border border-gray-200 text-gray-700'}`}>
            For Rent
          </button>
          <button onClick={() => setFilter('For Sale')} className={`px-4 py-1.5 rounded-full text-xs font-medium whitespace-nowrap transition-colors ${filter === 'For Sale' ? 'bg-primary text-white' : 'bg-white border border-gray-200 text-gray-700'}`}>
            For Sale
          </button>
        </div>

        <div className="flex justify-between items-center mb-4">
          <span className="text-sm text-gray-500 font-medium">{filteredProps.length} results</span>
          <button 
            className="flex items-center gap-1 text-xs font-medium text-gray-700"
            onClick={() => setSort(sort === 'Newest' ? 'Price High to Low' : sort === 'Price High to Low' ? 'Price Low to High' : 'Newest')}
          >
            Sort by: <span className="text-primary">{sort}</span> <ChevronDown size={14} />
          </button>
        </div>

        <div className="space-y-4">
          {filteredProps.map(p => <PropertyCard key={p.id} property={p} />)}
          {filteredProps.length === 0 && (
            <p className="text-center text-sm text-gray-500 mt-8">No properties found matching your criteria.</p>
          )}
        </div>
      </div>
      <BottomNav />
    </PageWrapper>
  );
};
