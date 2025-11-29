import React from 'react';

export const LoadingSpinner: React.FC<{ text?: string }> = ({ text = "Loading..." }) => (
  <div className="flex flex-col items-center justify-center p-12 space-y-4 animate-in fade-in duration-500">
    <div className="relative">
      <div className="w-12 h-12 rounded-full border-4 border-slate-200"></div>
      <div className="w-12 h-12 rounded-full border-4 border-indigo-600 border-t-transparent animate-spin absolute top-0 left-0"></div>
    </div>
    <p className="text-slate-500 font-medium animate-pulse">{text}</p>
  </div>
);

export const SkeletonCard = () => (
    <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100 space-y-3 animate-pulse">
        <div className="h-4 bg-slate-200 rounded w-1/4"></div>
        <div className="h-6 bg-slate-200 rounded w-3/4"></div>
        <div className="h-20 bg-slate-200 rounded w-full"></div>
    </div>
);
