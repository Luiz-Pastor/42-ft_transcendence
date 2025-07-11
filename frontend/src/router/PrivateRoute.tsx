import { Navigate } from "react-router";
import { useAuth } from "@/hooks/useAuth";
import { routeProps } from "@/types/authContext";
import Spinner from "@/layout/Spinner/Spinner";
import { ActivityTracker } from "@/router/ActivityTracker";

const PrivateRoute: React.FC<routeProps> = ({ children }) => {
  const { isAuthenticated, loading } = useAuth();

  if (loading) {
    return (
      <div className="fixed inset-0 flex items-center justify-center bg-background-primary z-50">
        <Spinner />
      </div>
    );
  }

  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  return (
    <>
      <ActivityTracker />
      {children}
    </>
  );
};

export default PrivateRoute;
