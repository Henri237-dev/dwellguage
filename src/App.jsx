import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AppProvider, useAppContext } from './context/AppContext';
import { Dashboard } from './pages/Dashboard';
import { Valuation } from './pages/Valuation';
import { Search } from './pages/Search';
import { Map } from './pages/Map';
import { MarketInsights } from './pages/MarketInsights';
import { Comparison } from './pages/Comparison';
import { Auth } from './pages/Auth';
import { Admin } from './pages/Admin';
import { History } from './pages/History';
import { Profile } from './pages/Profile';
import { Onboarding } from './components/Onboarding';

const ClientRoute = ({ children }) => {
  const { user } = useAppContext();
  if (!user) return <Navigate to="/auth" replace />;
  if (user.role === 'admin') return <Navigate to="/admin" replace />;
  return children;
};

const AdminRoute = ({ children }) => {
  const { user } = useAppContext();
  if (!user) return <Navigate to="/auth" replace />;
  if (user.role !== 'admin') return <Navigate to="/dashboard" replace />;
  return children;
};

const ProtectedRoute = ({ children }) => {
  const { user } = useAppContext();
  if (!user) return <Navigate to="/auth" replace />;
  return children;
};

import { trainModel, predictPrice } from './ml/model';
import { mockProperties } from './data/mockProperties';

const AppContent = () => {
  const { user, hasCompletedOnboarding } = useAppContext();

  React.useEffect(() => {
    // Train the real TFJS model on the 100 properties
    trainModel(mockProperties).then(() => {
      console.log('TFJS Model fully trained on real dataset');
      // Update the static mockProperties objects with the real ML predictions
      mockProperties.forEach(p => {
        const result = predictPrice(p, true);
        p.mlPrediction = result.price;
        p.confidence = result.confidence;
      });
    });
  }, []);

  if (!hasCompletedOnboarding) return <Onboarding />;

  return (
    <Routes>
      <Route path="/" element={<Navigate to={user?.role === 'admin' ? "/admin" : "/dashboard"} replace />} />
      <Route path="/auth" element={user ? <Navigate to={user.role === 'admin' ? "/admin" : "/dashboard"} replace /> : <Auth />} />
      
      {/* Client Only Routes */}
      <Route path="/dashboard" element={<ClientRoute><Dashboard /></ClientRoute>} />
      <Route path="/history" element={<ClientRoute><History /></ClientRoute>} />
      <Route path="/profile" element={<ProtectedRoute><Profile /></ProtectedRoute>} />
      <Route path="/valuation" element={<ClientRoute><Valuation /></ClientRoute>} />
      
      {/* Shared Protected Routes */}
      <Route path="/search" element={<ProtectedRoute><Search /></ProtectedRoute>} />
      <Route path="/map" element={<ProtectedRoute><Map /></ProtectedRoute>} />
      <Route path="/market-insights" element={<ProtectedRoute><MarketInsights /></ProtectedRoute>} />
      <Route path="/comparison" element={<ProtectedRoute><Comparison /></ProtectedRoute>} />
      
      {/* Admin Only Routes */}
      <Route path="/admin" element={<AdminRoute><Admin /></AdminRoute>} />
    </Routes>
  );
};

function App() {
  return (
    <AppProvider>
      <BrowserRouter>
        <AppContent />
      </BrowserRouter>
    </AppProvider>
  );
}

export default App;
