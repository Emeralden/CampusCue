import React from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';

import AuthGuard from './components/auth/AuthGuard';
import LoginPage from './Pages/LoginPage';
import Dashboard from './Pages/Dashboard';
import FullMessMenu from './Pages/FullMessMenu';
import FullSchedule from './Pages/FullSchedule';
import SatisfactionCalendar from './Pages/SatisfactionCalendar';
import TomorrowOverview from './Pages/TomorrowOverview';
import Layout from './Layout';

const queryClient = new QueryClient();

export default function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <BrowserRouter>
        <Layout>
          <Routes>
            <Route path="/login" element={<LoginPage />} />
            
            <Route 
              path="/" 
              element={
                <AuthGuard>
                  <Dashboard />
                </AuthGuard>
              } 
            />
            <Route 
              path="/mess-menu" 
              element={
                <AuthGuard>
                  <FullMessMenu />
                </AuthGuard>
              } 
            />
            <Route 
              path="/schedule" 
              element={
                <AuthGuard>
                  <FullSchedule />
                </AuthGuard>
              } 
            />
            <Route 
              path="/satisfaction" 
              element={
                <AuthGuard>
                  <SatisfactionCalendar />
                </AuthGuard>
              } 
            />
            <Route 
              path="/tomorrow" 
              element={
                <AuthGuard>
                  <TomorrowOverview />
                </AuthGuard>
              } 
            />
          </Routes>
        </Layout>
      </BrowserRouter>
    </QueryClientProvider>
  );
}