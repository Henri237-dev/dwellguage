import React from 'react';
import { Search, Bell, User } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useAppContext } from '../../context/AppContext';

export const TopHeader = ({ title, subtitle }) => {
  const navigate = useNavigate();
  const { hasNewListing, clearNotification, user } = useAppContext();
  
  const handleBellClick = () => {
    clearNotification();
    navigate('/search');
  };

  return (
    <header className="flex items-center justify-between p-4 bg-white sticky top-0 z-10 border-b border-gray-100">
      <div onClick={() => navigate('/dashboard')} className="cursor-pointer">
        {title ? (
          <>
            <h1 className="text-xl font-bold text-gray-900">{title}</h1>
            {subtitle && <p className="text-xs text-gray-500">{subtitle}</p>}
          </>
        ) : (
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-primary flex items-center justify-center text-white font-bold">DG</div>
            <div>
              <h1 className="text-lg font-bold leading-tight">DwellGuage</h1>
              <p className="text-[10px] text-gray-500">{user?.role === 'admin' ? 'Admin Portal' : 'My forecasted solutions'}</p>
            </div>
          </div>
        )}
      </div>
      <div className="flex items-center gap-3">
        <button className="p-2 text-gray-600 hover:bg-gray-50 rounded-full" onClick={() => navigate('/search')}><Search size={20} /></button>
        <button className="p-2 text-gray-600 hover:bg-gray-50 rounded-full relative" onClick={handleBellClick}>
          <Bell size={20} />
          {hasNewListing && <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-red-500 rounded-full"></span>}
        </button>
        <button className="p-1" onClick={() => navigate('/profile')}>
          <div className="w-8 h-8 rounded-full bg-gray-200 flex items-center justify-center overflow-hidden">
            <User size={16} className="text-gray-500" />
          </div>
        </button>
      </div>
    </header>
  );
};
