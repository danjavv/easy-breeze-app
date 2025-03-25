
import { useNavigate } from 'react-router-dom';
import AdminHeader from '@/components/admin/AdminHeader';
import SubmissionsHeader from '@/components/admin/SubmissionsHeader';
import SubmissionsContent from '@/components/admin/SubmissionsContent';
import { useSubmissions } from '@/hooks/use-submissions';

const AdminAllSubmissions = () => {
  const navigate = useNavigate();
  
  const {
    paginatedSubmissions,
    isLoading,
    currentPage,
    totalPages,
    fromWebhook,
    setCurrentPage,
    refreshWebhook,
    refreshSupabase
  } = useSubmissions();

  const handleSignOut = () => {
    navigate('/auth');
  };

  const handleRefresh = fromWebhook ? refreshWebhook : refreshSupabase;

  console.log('Current page:', currentPage);
  console.log('Total pages:', totalPages);
  console.log('Paginated submissions:', paginatedSubmissions);

  return (
    <div className="min-h-screen bg-muted/40">
      <AdminHeader onSignOut={handleSignOut} />
      
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <SubmissionsHeader 
          fromWebhook={fromWebhook}
          isLoading={isLoading}
          onRefresh={handleRefresh}
        />
        
        <SubmissionsContent
          submissions={paginatedSubmissions}
          isLoading={isLoading}
          currentPage={currentPage}
          totalPages={totalPages}
          fromWebhook={fromWebhook}
          onPageChange={setCurrentPage}
          onRefresh={handleRefresh}
        />
      </main>
    </div>
  );
};

export default AdminAllSubmissions;
