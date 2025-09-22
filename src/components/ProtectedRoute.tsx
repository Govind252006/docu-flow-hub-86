import { useEffect, useState } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { useNavigate } from 'react-router-dom';

interface ProtectedRouteProps {
  children: React.ReactNode;
  requiredRole?: string;
}

const ProtectedRoute = ({ children, requiredRole }: ProtectedRouteProps) => {
  const { user, loading, getUserRole } = useAuth();
  const navigate = useNavigate();
  const [userRole, setUserRole] = useState<string | null>(null);
  const [checking, setChecking] = useState(true);

  useEffect(() => {
    const checkAuth = async () => {
      if (loading) return;
      
      if (!user) {
        navigate('/login');
        return;
      }

      if (requiredRole) {
        const role = await getUserRole();
        setUserRole(role);
        
        if (role !== requiredRole && role !== 'admin') {
          // Redirect based on user's actual role
          if (role === 'manager') {
            navigate('/manager/dashboard');
          } else {
            navigate('/');
          }
          return;
        }
      }
      
      setChecking(false);
    };

    checkAuth();
  }, [user, loading, requiredRole, navigate, getUserRole]);

  if (loading || checking) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-primary"></div>
      </div>
    );
  }

  return <>{children}</>;
};

export default ProtectedRoute;