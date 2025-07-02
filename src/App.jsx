import React from 'react';
import AppRoutes from './routes/AppRoutes';
import { AuthProvider } from './contexts/Authcontext';

function App() {
  return (
    <AuthProvider>
      <AppRoutes />
    </AuthProvider>
  );
}

export default App;