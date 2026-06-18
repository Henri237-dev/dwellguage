import React, { createContext, useContext, useState, useEffect } from 'react';
import { supabase } from '../utils/supabaseClient';

const AppContext = createContext();

export const AppProvider = ({ children }) => {
  const [user, setUser] = useState(null); 
  const [lastEstimate, setLastEstimate] = useState(null);
  const [hasCompletedOnboarding, setHasCompletedOnboarding] = useState(false);
  const [savedValuations, setSavedValuations] = useState([]);
  const [allUsers, setAllUsers] = useState([]); 
  const [hasNewListing, setHasNewListing] = useState(false);
  const [customDataset, setCustomDataset] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      // Fetch users
      const { data: usersData, error: uErr } = await supabase.from('users').select('*');
      if (usersData) setAllUsers(usersData);
      else console.error('Error fetching users:', uErr);
      
      // Fetch valuations
      const { data: valsData, error: vErr } = await supabase.from('valuations').select('*').order('created_at', { ascending: false });
      if (valsData) {
        // Map snake_case to camelCase
        const mappedVals = valsData.map(v => ({
          ...v,
          formData: v.form_data,
          date: v.created_at
        }));
        setSavedValuations(mappedVals);
      } else {
        console.error('Error fetching valuations:', vErr);
      }

      // Fetch properties for custom dataset
      const { data: propsData, error: pErr } = await supabase.from('properties').select('*');
      if (propsData && propsData.length > 0) setCustomDataset(propsData);
      else if (pErr) console.error('Error fetching properties:', pErr);
    };

    fetchData();
  }, []);

  const login = async (userData) => {
    let finalUser = allUsers.find(u => u.email === userData.email);
    
    if (finalUser) {
      if (finalUser.status === 'banned') {
        alert('This account has been banned.');
        return false;
      }
    } else {
      const { data, error } = await supabase.from('users').insert([{
        name: userData.name || 'New User',
        email: userData.email,
        role: userData.email === 'admin@dwellguage.com' ? 'admin' : 'client',
        status: 'active',
        subscription: 'Free'
      }]).select();
      
      if (error) {
        alert('Error creating user: ' + error.message);
        return false;
      }
      finalUser = data[0];
      setAllUsers(prev => [...prev, finalUser]);
    }

    setUser(finalUser);
    return true;
  };

  const logout = () => {
    setUser(null);
    setHasCompletedOnboarding(false);
  };

  const saveEstimate = async (estimate, formData) => {
    setLastEstimate(estimate);
    
    if (!user) return; // Need a user to save to DB

    const { data, error } = await supabase.from('valuations').insert([{
      user_id: user.id,
      price: estimate.price,
      confidence: estimate.confidence,
      form_data: formData
    }]).select();

    if (error) {
      console.error('Error saving estimate:', error);
      return;
    }

    const newSaved = {
      ...estimate,
      formData,
      id: data[0].id,
      date: data[0].created_at
    };
    setSavedValuations(prev => [newSaved, ...prev]);
  };
  
  const clearHistory = async () => {
    if (!user) return;
    const { error } = await supabase.from('valuations').delete().eq('user_id', user.id);
    if (!error) {
      setSavedValuations(prev => prev.filter(v => v.user_id !== user.id));
    }
  };

  const completeOnboarding = () => {
    setHasCompletedOnboarding(true);
  };

  const notifyNewListing = () => setHasNewListing(true);
  const clearNotification = () => setHasNewListing(false);

  const updateUserStatus = async (userId, newStatus) => {
    const { error } = await supabase.from('users').update({ status: newStatus }).eq('id', userId);
    if (!error) {
      setAllUsers(prev => prev.map(u => u.id === userId ? { ...u, status: newStatus } : u));
    }
  };
  
  const updateUserSubscription = async (userId, newSub) => {
    const { error } = await supabase.from('users').update({ subscription: newSub }).eq('id', userId);
    if (!error) {
      setAllUsers(prev => prev.map(u => u.id === userId ? { ...u, subscription: newSub } : u));
    }
  };

  const updateProfile = async (updates) => {
    if (!user) return;
    const { error } = await supabase.from('users').update(updates).eq('id', user.id);
    if (!error) {
      const updatedUser = { ...user, ...updates };
      setUser(updatedUser);
      setAllUsers(prev => prev.map(u => u.id === user.id ? updatedUser : u));
    }
  };

  const updateCustomDataset = async (dataset) => {
    // Only admins upload dataset, assume it's just bulk insert
    const { error } = await supabase.from('properties').insert(dataset);
    if (!error) {
      setCustomDataset(dataset);
    } else {
      console.error('Error updating dataset:', error);
      throw error;
    }
  };

  return (
    <AppContext.Provider value={{ 
      user, login, logout, 
      lastEstimate, saveEstimate, savedValuations, clearHistory,
      hasCompletedOnboarding, completeOnboarding,
      allUsers, updateUserStatus, updateUserSubscription, updateProfile,
      hasNewListing, notifyNewListing, clearNotification,
      customDataset, updateCustomDataset
    }}>
      {children}
    </AppContext.Provider>
  );
};

export const useAppContext = () => useContext(AppContext);
