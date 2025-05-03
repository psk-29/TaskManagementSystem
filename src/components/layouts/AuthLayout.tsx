
import React from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/contexts/auth-context";
import "./AuthLayout.css";

interface AuthLayoutProps {
  children: React.ReactNode;
  requireAuth?: boolean;
}

export function AuthLayout({ children, requireAuth = false }: AuthLayoutProps) {
  const { authState } = useAuth();
  const navigate = useNavigate();

  React.useEffect(() => {
    if (requireAuth && !authState.isLoading && !authState.isAuthenticated) {
      navigate("/login", { replace: true });
    } else if (!requireAuth && !authState.isLoading && authState.isAuthenticated) {
      navigate("/dashboard", { replace: true });
    }
  }, [authState.isLoading, authState.isAuthenticated, navigate, requireAuth]);

  // Show loading state
  if (authState.isLoading) {
    return (
      <div className="loading-container">
        <div className="loading-spinner"></div>
      </div>
    );
  }

  // If not loading and authentication status matches requirement, render children
  if ((!requireAuth && !authState.isAuthenticated) || (requireAuth && authState.isAuthenticated)) {
    return <>{children}</>;
  }

  // Loading placeholder while redirecting
  return (
    <div className="loading-container">
      <div className="loading-spinner"></div>
    </div>
  );
}
