import React, { useState } from 'react';
import { PageWrapper } from '../components/layout/PageWrapper';
import { TopHeader } from '../components/layout/TopHeader';
import { BottomNav } from '../components/layout/BottomNav';
import { useAppContext } from '../context/AppContext';

export const Profile = () => {
  const { user, updateProfile, logout } = useAppContext();
  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState({
    name: user?.name || '',
    email: user?.email || '',
    subscription: user?.subscription || 'Free'
  });

  const handleSave = (e) => {
    e.preventDefault();
    updateProfile(formData);
    setIsEditing(false);
    alert('Profile updated successfully!');
  };

  return (
    <PageWrapper noPadding>
      <TopHeader title="My Profile" />
      <div className="p-4 space-y-6">
        
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 flex flex-col items-center">
          <div className="w-20 h-20 bg-primary/10 text-primary rounded-full flex items-center justify-center text-2xl font-bold mb-4">
            {user?.name?.charAt(0) || 'U'}
          </div>
          <h2 className="text-xl font-bold text-gray-900">{user?.name}</h2>
          <p className="text-gray-500 text-sm">{user?.email}</p>
          <div className="mt-3 px-3 py-1 bg-purple-50 text-primary rounded-full text-xs font-bold border border-purple-100">
            {user?.subscription} Tier
          </div>
        </div>

        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-4">
          <div className="flex justify-between items-center mb-4">
            <h3 className="font-bold text-gray-900">Personal Information</h3>
            <button 
              onClick={() => setIsEditing(!isEditing)} 
              className="text-primary text-sm font-medium"
            >
              {isEditing ? 'Cancel' : 'Edit'}
            </button>
          </div>
          
          {isEditing ? (
            <form onSubmit={handleSave} className="space-y-4">
              <div>
                <label className="block text-xs font-medium text-gray-700 mb-1">Full Name</label>
                <input type="text" value={formData.name} onChange={e => setFormData({...formData, name: e.target.value})} className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-primary/40 focus:outline-none" />
              </div>
              <div>
                <label className="block text-xs font-medium text-gray-700 mb-1">Email</label>
                <input type="email" value={formData.email} onChange={e => setFormData({...formData, email: e.target.value})} className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-primary/40 focus:outline-none" />
              </div>
              <div>
                <label className="block text-xs font-medium text-gray-700 mb-1">Subscription Tier</label>
                <select value={formData.subscription} onChange={e => setFormData({...formData, subscription: e.target.value})} className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-primary/40 focus:outline-none bg-white">
                  <option value="Free">Free</option>
                  <option value="Pro">Pro (10,000 XAF/mo)</option>
                </select>
              </div>
              <button type="submit" className="w-full bg-primary text-white font-bold py-3 rounded-xl mt-4">Save Changes</button>
            </form>
          ) : (
            <div className="space-y-4">
              <div>
                <p className="text-xs text-gray-500">Full Name</p>
                <p className="font-medium text-gray-900">{user?.name}</p>
              </div>
              <div>
                <p className="text-xs text-gray-500">Email Address</p>
                <p className="font-medium text-gray-900">{user?.email}</p>
              </div>
              <div>
                <p className="text-xs text-gray-500">Role</p>
                <p className="font-medium text-gray-900 capitalize">{user?.role}</p>
              </div>
            </div>
          )}
        </div>

        <button 
          onClick={logout}
          className="w-full border border-red-200 text-red-500 font-bold py-3 rounded-xl hover:bg-red-50 transition-colors"
        >
          Sign Out
        </button>

      </div>
      <BottomNav />
    </PageWrapper>
  );
};
