import React, { useState } from 'react';
import { PageWrapper } from '../components/layout/PageWrapper';
import { TopHeader } from '../components/layout/TopHeader';
import { BottomNav } from '../components/layout/BottomNav';
import { useAppContext } from '../context/AppContext';

export const Admin = () => {
  const { allUsers, updateUserStatus, updateUserSubscription, notifyNewListing, updateCustomDataset } = useAppContext();
  const [activeTab, setActiveTab] = useState('users');
  const [file, setFile] = useState(null);

  const handleBan = (id, currentStatus) => {
    updateUserStatus(id, currentStatus === 'banned' ? 'active' : 'banned');
  };

  const handleApproveProperty = () => {
    notifyNewListing();
    alert('Property approved and clients notified!');
  };

  const handleDataUpload = (e) => {
    e.preventDefault();
    if (!file) return alert('Please select a CSV file first.');
    
    const reader = new FileReader();
    reader.onload = (event) => {
      const text = event.target.result;
      try {
        const lines = text.trim().split('\n');
        if (lines.length < 2) throw new Error('File is empty or missing data');
        const headers = lines[0].split(',').map(h => h.trim().toLowerCase());
        const data = lines.slice(1).map(line => {
          const values = line.split(',').map(v => v.trim());
          const obj = {};
          headers.forEach((header, i) => {
            // attempt to cast numbers
            const num = Number(values[i]);
            obj[header] = isNaN(num) ? values[i] : num;
          });
          return obj;
        });
        
        updateCustomDataset(data);
        alert(`Dataset uploaded successfully! ${data.length} records processed. The prediction engine has been recalibrated.`);
      } catch (err) {
        alert('Failed to parse dataset: ' + err.message);
      }
    };
    reader.readAsText(file);
  };

  return (
    <PageWrapper noPadding className="max-w-4xl">
      <TopHeader title="Admin Portal" subtitle="System Management" />
      <div className="p-4 mb-20">
        
        <div className="flex bg-gray-100 p-1 rounded-xl mb-6">
          <button onClick={() => setActiveTab('users')} className={`flex-1 py-2 text-sm font-medium rounded-lg transition-all ${activeTab === 'users' ? 'bg-white shadow-sm text-gray-900' : 'text-gray-500'}`}>Users</button>
          <button onClick={() => setActiveTab('data')} className={`flex-1 py-2 text-sm font-medium rounded-lg transition-all ${activeTab === 'data' ? 'bg-white shadow-sm text-gray-900' : 'text-gray-500'}`}>Data/ML</button>
          <button onClick={() => setActiveTab('approvals')} className={`flex-1 py-2 text-sm font-medium rounded-lg transition-all ${activeTab === 'approvals' ? 'bg-white shadow-sm text-gray-900' : 'text-gray-500'}`}>Approvals</button>
        </div>

        {activeTab === 'users' && (
          <div className="space-y-4">
            <h3 className="font-bold text-gray-900">User Management</h3>
            <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden overflow-x-auto">
              <table className="w-full text-sm text-left">
                <thead className="bg-gray-50 text-gray-500 font-medium">
                  <tr>
                    <th className="px-4 py-3">Client</th>
                    <th className="px-4 py-3">Role</th>
                    <th className="px-4 py-3">Status</th>
                    <th className="px-4 py-3">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100">
                  {allUsers.map(u => (
                    <tr key={u.id}>
                      <td className="px-4 py-3">
                        <div className="font-medium text-gray-900">{u.name}</div>
                        <div className="text-xs text-gray-500">{u.email}</div>
                      </td>
                      <td className="px-4 py-3 capitalize">{u.role}</td>
                      <td className="px-4 py-3">
                        <span className={`px-2 py-1 rounded text-xs font-bold ${u.status === 'banned' ? 'bg-red-100 text-red-600' : 'bg-green-100 text-green-600'}`}>
                          {u.status}
                        </span>
                      </td>
                      <td className="px-4 py-3 space-x-2 whitespace-nowrap">
                        {u.role !== 'admin' && (
                          <>
                            <button onClick={() => handleBan(u.id, u.status)} className="text-xs text-red-600 font-medium hover:underline">
                              {u.status === 'banned' ? 'Unban' : 'Ban'}
                            </button>
                            <button onClick={() => updateUserSubscription(u.id, u.subscription === 'Free' ? 'Pro' : 'Free')} className="text-xs text-primary font-medium hover:underline ml-2">
                              Toggle Sub
                            </button>
                          </>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {activeTab === 'data' && (
          <div className="space-y-6">
            <h3 className="font-bold text-gray-900">ML Data Management</h3>
            <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
              <h4 className="font-medium text-sm mb-2">Upload Recent Sales Dataset</h4>
              <p className="text-xs text-gray-500 mb-4">Upload CSV of recent Buea sales to retrain the TensorFlow.js model weights.</p>
              <form onSubmit={handleDataUpload} className="flex gap-2">
                <input type="file" accept=".csv" onChange={(e) => setFile(e.target.files[0])} className="block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-purple-50 file:text-primary hover:file:bg-purple-100" />
                <button type="submit" className="bg-primary text-white px-4 py-2 rounded-full text-sm font-bold whitespace-nowrap">Upload</button>
              </form>
            </div>
          </div>
        )}

        {activeTab === 'approvals' && (
          <div className="space-y-4">
            <h3 className="font-bold text-gray-900">Pending Properties</h3>
            <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-4 flex justify-between items-center">
              <div>
                <h4 className="font-bold text-sm">3 Bed Apartment - Molyko</h4>
                <p className="text-xs text-gray-500">Flagged for unusual pricing (150,000 XAF/mo)</p>
              </div>
              <div className="flex gap-2">
                <button onClick={handleApproveProperty} className="bg-green-500 text-white px-3 py-1.5 rounded text-xs font-bold">Approve</button>
                <button className="bg-red-500 text-white px-3 py-1.5 rounded text-xs font-bold">Reject</button>
              </div>
            </div>
          </div>
        )}

      </div>
      <BottomNav />
    </PageWrapper>
  );
};
