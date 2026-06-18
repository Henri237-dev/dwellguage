import React from 'react';

export const PageWrapper = ({ children, className = '', noPadding = false }) => {
  return (
    <div className={`min-h-screen bg-surface w-full max-w-[480px] mx-auto relative shadow-2xl sm:border-x sm:border-gray-200 overflow-x-hidden pb-20 ${className}`}>
      <main className={noPadding ? '' : 'p-4'}>
        {children}
      </main>
    </div>
  );
};
