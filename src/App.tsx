import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { Toaster } from '@/components/ui/toaster';
import { ThemeProvider } from '@/components/theme-provider';
import { AuthProvider } from '@/contexts/AuthContext';
import { DataProvider } from '@/contexts/DataContext';
import Dashboard from '@/pages/Index';
import AdminDashboard from '@/pages/AdminDashboard';
import SubmissionResults from '@/pages/SubmissionResults';
import AdminIngredientModels from '@/pages/AdminIngredientModels';
import AdminSupplierAssignments from '@/pages/AdminSupplierAssignments';
import Auth from '@/pages/Auth';
import SupplierDashboard from '@/pages/SupplierDashboard';
import AuthGuard from '@/components/AuthGuard';
import NewSubmission from '@/pages/NewSubmission';
import AdminAllSubmissions from '@/pages/AdminAllSubmissions';

function App() {
  return (
    <Router>
      <ThemeProvider defaultTheme="dark" storageKey="vite-ui-theme">
        <AuthProvider>
          <DataProvider>
            <Routes>
              <Route path="/" element={<Dashboard />} />
              <Route path="/auth" element={<Auth />} />
              <Route path="/admin" element={<Navigate to="/admin-dashboard" replace />} />
              <Route path="/admin-dashboard" element={
                <AuthGuard requiredRole="admin">
                  <AdminDashboard />
                </AuthGuard>
              } />
              <Route path="/supplier-dashboard" element={
                <AuthGuard requiredRole="supplier">
                  <SupplierDashboard />
                </AuthGuard>
              } />
              <Route path="/submission-results/:submissionId" element={
                <AuthGuard>
                  <SubmissionResults />
                </AuthGuard>
              } />
              <Route path="/admin-ingredient-models" element={
                <AuthGuard requiredRole="admin">
                  <AdminIngredientModels />
                </AuthGuard>
              } />
              <Route path="/admin-supplier-assignments" element={
                <AuthGuard requiredRole="admin">
                  <AdminSupplierAssignments />
                </AuthGuard>
              } />
              <Route path="/new-submission" element={
                <AuthGuard>
                  <NewSubmission />
                </AuthGuard>
              } />
              <Route path="/admin-all-submissions" element={
                <AuthGuard requiredRole="admin">
                  <AdminAllSubmissions />
                </AuthGuard>
              } />
            </Routes>
            <Toaster />
          </DataProvider>
        </AuthProvider>
      </ThemeProvider>
    </Router>
  );
}

export default App;
