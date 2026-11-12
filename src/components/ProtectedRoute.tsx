import React from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { Loader2 } from 'lucide-react';

interface ProtectedRouteProps {
  children: React.ReactNode;
  requireProfile?: boolean;
  requireAdmin?: boolean;
}

export default function ProtectedRoute({ children, requireProfile = true, requireAdmin = false }: ProtectedRouteProps) {
  const { user, studentProfile, isAdmin, loading } = useAuth();
  const location = useLocation();

  if (loading) {
    return (
      <div className="min-h-[100dvh] flex items-center justify-center bg-hostel-bg">
        <Loader2 className="h-8 w-8 animate-spin text-hostel-accent" />
      </div>
    );
  }

  if (!user) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  if (requireAdmin) {
    if (!isAdmin) {
      return <Navigate to="/dashboard" replace />;
    }
    return <>{children}</>;
  }

  // If user is admin but tries to access a student route (not requireAdmin)
  if (isAdmin) {
    if (location.pathname.startsWith('/admin')) {
        return <>{children}</>;
    }
    return <Navigate to="/admin/dashboard" replace />;
  }
  
  if (!studentProfile) {
    // Authenticated but no profile (not registered), let login handle it
    return <Navigate to="/login" replace />;
  }

  if (studentProfile.accountStatus === 'Inactive') {
    return <Navigate to="/login" replace />;
  }

  if (requireProfile) {
    if (!studentProfile.profileCompleted || !studentProfile.roomId) {
      return <Navigate to="/complete-profile" replace />;
    }
  }

  if (!requireProfile && studentProfile && studentProfile.profileCompleted && studentProfile.roomId && location.pathname === '/complete-profile') {
    return <Navigate to="/dashboard" replace />;
  }

  return <>{children}</>;
}
