'use client';

import { AuthProvider } from '@/context/AuthContext';
import Header from '@/components/Header';

export function Providers({ children }) {
  return (
    <AuthProvider>
      <Header />
      {children}
    </AuthProvider>
  );
}