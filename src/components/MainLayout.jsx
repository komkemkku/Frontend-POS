import React from 'react';
import PosNav from './PosNav';

function MainLayout({ children }) {
  return (
    <>
      <PosNav />
      <div style={{ minHeight: 'calc(100vh - 60px)' }}>
        {children}
      </div>
    </>
  );
}

export default MainLayout;
