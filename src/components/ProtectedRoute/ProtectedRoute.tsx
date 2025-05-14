import { Navigate } from "react-router-dom";

const ProtectedRoute = ({ children }: { children: React.ReactNode }) => {
  const isLoggedIn = localStorage.getItem("token");
  const isCredential = localStorage.getItem("user");

  if (!isLoggedIn && !isCredential) {
    return <Navigate to="/" />;
  }

  return children;
};

export default ProtectedRoute;
