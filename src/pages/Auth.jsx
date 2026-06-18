import React, { useState } from 'react';
import { Home, Eye, EyeOff } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useAppContext } from '../context/AppContext';

export const Auth = () => {
  const [isSignIn, setIsSignIn] = useState(true);
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  
  const navigate = useNavigate();
  const { login } = useAppContext();

  const handleAuth = async (e) => {
    e.preventDefault();
    const success = await login({ name: name || (isSignIn ? '' : 'User'), email });
    if (success) {
      if (email.includes('admin@')) {
        navigate('/admin');
      } else {
        navigate('/dashboard');
      }
    }
  };

  const inputClass = "w-full border border-gray-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-primary/40 bg-gray-50/50";

  return (
    <div className="min-h-screen bg-surface w-full max-w-[480px] mx-auto relative shadow-2xl sm:border-x sm:border-gray-200 flex flex-col items-center justify-center p-6">
      <div className="w-full bg-white rounded-[2rem] shadow-xl shadow-primary/5 border border-gray-100 p-8 flex flex-col items-center text-center">
        
        <div className="w-16 h-16 bg-primary/10 rounded-2xl flex items-center justify-center text-primary mb-4">
          <Home size={32} />
        </div>
        
        <h1 className="text-2xl font-bold text-gray-900">DwellGuage</h1>
        <p className="text-xs text-gray-500 mb-8 mt-1">Professional Home Valuation System</p>

        <div className="w-full flex bg-gray-100 p-1 rounded-xl mb-8">
          <button 
            type="button"
            className={`flex-1 py-2 text-sm font-medium rounded-lg transition-colors ${isSignIn ? 'bg-white shadow-sm text-gray-900' : 'text-gray-500'}`}
            onClick={() => setIsSignIn(true)}
          >
            Sign In
          </button>
          <button 
            type="button"
            className={`flex-1 py-2 text-sm font-medium rounded-lg transition-colors ${!isSignIn ? 'bg-white shadow-sm text-gray-900' : 'text-gray-500'}`}
            onClick={() => setIsSignIn(false)}
          >
            Sign Up
          </button>
        </div>

        <form onSubmit={handleAuth} className="w-full space-y-4">
          {!isSignIn && (
            <>
              <input type="text" placeholder="Full Name" value={name} onChange={e => setName(e.target.value)} className={inputClass} required />
              <input type="tel" placeholder="Phone Number" className={inputClass} required />
            </>
          )}
          
          <input type="email" placeholder="Email Address" value={email} onChange={e => setEmail(e.target.value)} className={inputClass} required />
          
          <div className="relative w-full">
            <input type={showPassword ? "text" : "password"} placeholder="Password" value={password} onChange={e => setPassword(e.target.value)} className={`${inputClass} pr-10`} required />
            <button type="button" onClick={() => setShowPassword(!showPassword)} className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600">
              {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
            </button>
          </div>
          
          {!isSignIn && (
            <div className="relative w-full">
              <input type={showPassword ? "text" : "password"} placeholder="Confirm Password" className={`${inputClass} pr-10`} required />
            </div>
          )}

          {isSignIn && (
            <div className="flex justify-end w-full">
              <a href="#" className="text-xs text-primary font-medium hover:underline">Forgot password?</a>
            </div>
          )}

          <button type="submit" className="w-full bg-hero-gradient text-white font-bold py-3.5 rounded-full shadow-lg shadow-primary/25 hover:shadow-xl transition-all mt-4">
            {isSignIn ? 'Sign In' : 'Create Account'}
          </button>
        </form>

        <p className="text-xs text-gray-500 mt-6">
          {isSignIn ? "Don't have an account? " : "Already have an account? "}
          <button type="button" onClick={() => setIsSignIn(!isSignIn)} className="text-primary font-bold hover:underline">
            {isSignIn ? 'Sign up' : 'Sign in'}
          </button>
        </p>
      </div>
    </div>
  );
};
