import { useEffect } from "react";
import { useNavigate } from "react-router-dom";

const Index = () => {
  const navigate = useNavigate();

  useEffect(() => {
    // Redirect to the dashboard or login page
    navigate("/dashboard");
  }, [navigate]);

  // This won't be visible, but it's a fallback just in case the redirect doesn't work
  return (
    <div className="flex min-h-screen items-center justify-center">
      <div className="h-12 w-12 animate-spin rounded-full border-b-2 border-t-2 border-primary"></div>
    </div>
  );
};

export default Index;
