import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import { AuthProvider } from '@/contexts/AuthContext';
import Index from '@/pages/Index';
import Auth from '@/pages/Auth';
import SupplierDashboard from '@/pages/SupplierDashboard';
import NewSubmission from '@/pages/NewSubmission';
import SubmissionResults from '@/pages/SubmissionResults';
import AdminDashboard from '@/pages/AdminDashboard';
import AdminBaselineConfig from '@/pages/AdminBaselineConfig';
import NotFound from '@/pages/NotFound';
import { Toaster } from 'sonner';

function App() {
  return (
    <Router>
      <AuthProvider>
        <Routes>
          <Route path="/" element={<Index />} />
          <Route path="/auth" element={<Auth />} />
          <Route path="/supplier-dashboard" element={<SupplierDashboard />} />
          <Route path="/new-submission" element={<NewSubmission />} />
          <Route path="/submission-results" element={<SubmissionResults />} />
          <Route path="/admin-dashboard" element={<AdminDashboard />} />
          <Route path="/admin-baseline-config" element={<AdminBaselineConfig />} />
          <Route path="*" element={<NotFound />} />
        </Routes>
        <Toaster />
      </AuthProvider>
    </Router>
  );
}

export default App;
