import React, { useEffect, useState } from "react";
import { Navigate } from "react-router-dom";
import axios from "axios";
import LoadingScreen from "../LoadingScreen/LoadingScreen";

const ProtectedRoute = ({ children }: { children: React.ReactNode }) => {
  const [isAuthenticated, setIsAuthenticated] = useState<boolean | null>(null);

  useEffect(() => {
    axios
      .get("/auth/check", { withCredentials: true })
      .then(() => setIsAuthenticated(true))
      .catch(() => setIsAuthenticated(false));
  }, []);

  if (isAuthenticated === null) {
    return (
      <div className="w-full h-full">
        <LoadingScreen />
      </div>
    );
  }

  if (!isAuthenticated) {
    return <Navigate to="/" />;
  }

  return <>{children}</>;
};

export default ProtectedRoute;
