import React from 'react';

const Loading = () => {
  return (
    <div className="space-y-6 p-6">
      {/* Timer Section Skeleton */}
      <div className="bg-white rounded-lg p-6 shadow-soft">
        <div className="flex items-center justify-center mb-4">
          <div className="w-32 h-32 rounded-full bg-gradient-to-br from-gray-200 to-gray-300 animate-pulse"></div>
        </div>
        <div className="h-6 bg-gray-200 rounded animate-pulse mx-auto w-24 mb-2"></div>
        <div className="h-4 bg-gray-200 rounded animate-pulse mx-auto w-16"></div>
      </div>

      {/* Task List Skeleton */}
      <div className="space-y-3">
        {[...Array(5)].map((_, index) => (
          <div key={index} className="bg-white rounded-lg p-4 shadow-soft animate-pulse">
            <div className="flex items-center space-x-3">
              <div className="w-5 h-5 bg-gray-200 rounded border-2"></div>
              <div className="flex-1 space-y-2">
                <div className="h-4 bg-gray-200 rounded w-3/4"></div>
                <div className="h-3 bg-gray-200 rounded w-1/2"></div>
              </div>
              <div className="w-6 h-6 bg-gray-200 rounded"></div>
            </div>
          </div>
        ))}
      </div>

      {/* Stats Cards Skeleton */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {[...Array(3)].map((_, index) => (
          <div key={index} className="bg-white rounded-lg p-4 shadow-soft animate-pulse">
            <div className="h-4 bg-gray-200 rounded w-1/2 mb-2"></div>
            <div className="h-8 bg-gradient-to-r from-gray-200 to-gray-300 rounded w-3/4"></div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Loading;