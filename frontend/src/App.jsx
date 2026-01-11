import React from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';

import AuthGuard from './Components/AuthGuard.jsx';
import LoginPage from './Pages/LoginPage.jsx';
import RegisterPage from './Pages/RegisterPage.jsx';
import Dashboard from './Pages/Dashboard.jsx';
import FullMessMenu from './Pages/FullMessMenu.jsx';
import FullSchedule from './Pages/FullSchedule.jsx';
import SatisfactionCalendar from './Pages/SatisfactionCalendar.jsx';
import TomorrowOverview from './Pages/TomorrowOverview.jsx';
import SettingsPage from './Pages/SettingsPage.jsx';
import OnboardingCourses from './Pages/OnboardingCourses.jsx';
import Layout from './Layout.jsx';

const queryClient = new QueryClient();

export default function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <BrowserRouter>
        <Layout>
          <Routes>
            <Route path="/login" element={<LoginPage />} />
            <Route path="/register" element={<RegisterPage />} />
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
            <Route 
              path="/settings" 
              element={
                <AuthGuard>
                  <SettingsPage />
                </AuthGuard>
              }
            />
            <Route 
              path="/onboarding/courses" 
              element={
                <AuthGuard>
                  <OnboardingCourses />
                </AuthGuard>
              } 
            />
          </Routes>
        </Layout>
      </BrowserRouter>
    </QueryClientProvider>
  );
}