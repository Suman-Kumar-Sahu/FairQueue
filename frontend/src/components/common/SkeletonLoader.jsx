import React from 'react';

const SkeletonLoader = ({ type = 'card', count = 1 }) => {
  const skeletonTypes = {
    card: (
      <div className="bg-white rounded-3xl p-6 shadow-soft animate-pulse">
        <div className="h-4 bg-neutral-200 rounded w-3/4 mb-4"></div>
        <div className="h-4 bg-neutral-200 rounded w-1/2 mb-2"></div>
        <div className="h-4 bg-neutral-200 rounded w-5/6"></div>
      </div>
    ),
    slot: (
      <div className="bg-white rounded-2xl p-4 shadow-soft animate-pulse">
        <div className="h-6 bg-neutral-200 rounded-lg w-20 mb-2"></div>
        <div className="h-3 bg-neutral-200 rounded w-16"></div>
      </div>
    ),
    text: (
      <div className="space-y-2">
        <div className="h-4 bg-neutral-200 rounded w-full animate-pulse"></div>
        <div className="h-4 bg-neutral-200 rounded w-5/6 animate-pulse"></div>
        <div className="h-4 bg-neutral-200 rounded w-4/6 animate-pulse"></div>
      </div>
    ),
    circle: (
      <div className="w-12 h-12 bg-neutral-200 rounded-full animate-pulse"></div>
    ),
    dashboard: (
      <div className="card animate-pulse">
        <div className="flex items-center justify-center mb-6">
          <div className="w-32 h-32 bg-neutral-200 rounded-full"></div>
        </div>
        <div className="h-8 bg-neutral-200 rounded w-3/4 mx-auto mb-4"></div>
        <div className="h-4 bg-neutral-200 rounded w-1/2 mx-auto"></div>
      </div>
    ),
  };

  return (
    <>
      {Array.from({ length: count }).map((_, index) => (
        <div key={index} className="mb-4">
          {skeletonTypes[type]}
        </div>
      ))}
    </>
  );
};

export default SkeletonLoader;