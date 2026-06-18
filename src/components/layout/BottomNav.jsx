import React from 'react';
import { Home, Map, Calculator, Search, TrendingUp, Users, History, FileText } from 'lucide-react';
import { useLocation, useNavigate } from 'react-router-dom';
import { useAppContext } from '../../context/AppContext';

export const BottomNav = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { user } = useAppContext();
  
  const isAdmin = user?.role === 'admin';

  const clientTabs = [
    { path: '/dashboard', icon: Home, label: 'Home' },
    { path: '/history', icon: History, label: 'History' },
    { path: '/valuation', icon: Calculator, label: 'Estimate', isCenter: true },
    { path: '/map', icon: Map, label: 'Map' },
    { path: '/search', icon: Search, label: 'Search' },
    { path: '/market-insights', icon: TrendingUp, label: 'Market' },
  ];

  const adminTabs = [
    { path: '/admin', icon: Users, label: 'Users' },
    { path: '/admin/data', icon: FileText, label: 'Data' },
    { path: '/dashboard', icon: Home, label: 'Dash' },
    { path: '/search', icon: Search, label: 'Search' },
    { path: '/market-insights', icon: TrendingUp, label: 'Market' },
  ];

  const tabs = isAdmin ? adminTabs : clientTabs;

  return (
    <nav className="fixed bottom-0 w-full max-w-[480px] bg-white border-t border-gray-100 px-4 pb-safe pt-2 z-50 rounded-t-2xl shadow-[0_-4px_20px_rgba(0,0,0,0.05)]">
      <div className="flex items-center justify-between pb-2">
        {tabs.map((tab) => {
          const isActive = location.pathname === tab.path;
          const Icon = tab.icon;
          
          if (tab.isCenter) {
            return (
              <button 
                key={tab.path}
                onClick={() => navigate(tab.path)}
                className="relative -top-5 flex flex-col items-center"
              >
                <div className="w-14 h-14 bg-primary text-white rounded-full flex items-center justify-center shadow-lg shadow-primary/30">
                  <Icon size={24} />
                </div>
                <span className="text-[10px] mt-1 font-medium text-primary">{tab.label}</span>
              </button>
            );
          }

          return (
            <button 
              key={tab.path}
              onClick={() => navigate(tab.path)}
              className={`flex flex-col items-center gap-1 min-w-[48px] ${isActive ? 'text-primary' : 'text-gray-400 hover:text-gray-600'}`}
            >
              <Icon size={22} strokeWidth={isActive ? 2.5 : 2} />
              <span className="text-[10px] font-medium">{tab.label}</span>
            </button>
          );
        })}
      </div>
    </nav>
  );
};
