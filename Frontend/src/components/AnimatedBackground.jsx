import React from 'react';

const AnimatedBackground = ({ children, className = '' }) => {
  return (
    <div className={`animated-bg min-h-screen ${className}`}>
      {/* Floating Blobs */}
      <div className="blob blob-1" />
      <div className="blob blob-2" />
      <div className="blob blob-3" />
      
      {/* Content Layer */}
      <div className="relative z-10 min-h-screen">
        {children}
      </div>
    </div>
  );
};

export default AnimatedBackground;
