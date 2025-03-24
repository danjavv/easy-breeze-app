
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import Index from '@/pages/Index';
import Auth from '@/pages/Auth';
import NotFound from '@/pages/NotFound';
import SupplierDashboard from '@/pages/SupplierDashboard';
import AdminDashboard from '@/pages/AdminDashboard';
import AdminBaselineConfig from '@/pages/AdminBaselineConfig';
import AdminIngredientModels from '@/pages/AdminIngredientModels';
import AdminAllSubmissions from '@/pages/AdminAllSubmissions';
import NewSubmission from '@/pages/NewSubmission';
import SubmissionResults from '@/pages/SubmissionResults';
import { AuthProvider } from '@/contexts/AuthContext';
import { Toaster } from '@/components/ui/sonner';
import { DataProvider } from '@/contexts/DataContext';
import './App.css';

function App() {
  return (
    <Router>
      <AuthProvider>
        <DataProvider>
          <Routes>
            <Route path="/" element={<Index />} />
            <Route path="/auth" element={<Auth />} />
            <Route path="/supplier-dashboard" element={<SupplierDashboard />} />
            <Route path="/admin-dashboard" element={<AdminDashboard />} />
            <Route path="/admin-baseline-config" element={<AdminBaselineConfig />} />
            <Route path="/admin-ingredient-models" element={<AdminIngredientModels />} />
            <Route path="/admin-all-submissions" element={<AdminAllSubmissions />} />
            <Route path="/new-submission" element={<NewSubmission />} />
            <Route path="/submission-results" element={<SubmissionResults />} />
            <Route path="/404" element={<NotFound />} />
            <Route path="*" element={<Navigate to="/404" replace />} />
          </Routes>
          <Toaster />
        </DataProvider>
      </AuthProvider>
    </Router>
  );
}

export default App;
