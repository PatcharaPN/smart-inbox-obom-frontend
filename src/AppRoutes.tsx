import { Route, Routes } from "react-router-dom";
import LoginPage from "./pages/LoginPage/LoginPage";
import HomePage from "./pages/HomePage/HomePage";
import ProtectedRoute from "./components/ProtectedRoute/ProtectedRoute";
import Sidebar from "./components/Sidebar/Sidebar";
import ProtectedLayout from "./components/ProtectedLayout/ProtectedLayout";

const AppRoutes = () => {
  return (
    <Routes>
      <Route path="/" element={<LoginPage />} />
      <Route
        path="/Home"
        element={
          <div className="flex flex-row h-full">
            <ProtectedRoute>
              <ProtectedLayout>
                <HomePage />
              </ProtectedLayout>
            </ProtectedRoute>
          </div>
        }
      />
    </Routes>
  );
};

export default AppRoutes;
