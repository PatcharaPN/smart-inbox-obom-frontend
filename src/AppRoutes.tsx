import { Route, Routes } from "react-router-dom";
import LoginPage from "./pages/LoginPage/LoginPage";
import HomePage from "./pages/HomePage/HomePage";
import ProtectedRoute from "./components/ProtectedRoute/ProtectedRoute";
import Sidebar from "./components/Sidebar/Sidebar";
import ProtectedLayout from "./components/ProtectedLayout/ProtectedLayout";
import DepartmentPage from "./pages/DepartmentPage/DepartmentPage";
import EmailPage from "./pages/EmailPage/EmailPage";
import FilePage from "./pages/FilePage/FilePage";

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
      />{" "}
      <Route
        path="/Department"
        element={
          <div className="flex flex-row h-full">
            <ProtectedRoute>
              <ProtectedLayout>
                <DepartmentPage />
              </ProtectedLayout>
            </ProtectedRoute>
          </div>
        }
      />{" "}
      <Route
        path="/Email"
        element={
          <div className="flex flex-row h-full">
            <ProtectedRoute>
              <ProtectedLayout>
                <EmailPage />
              </ProtectedLayout>
            </ProtectedRoute>
          </div>
        }
      />{" "}
      <Route
        path="/File"
        element={
          <div className="flex flex-row h-full">
            <ProtectedRoute>
              <ProtectedLayout>
                <FilePage />
              </ProtectedLayout>
            </ProtectedRoute>
          </div>
        }
      />
    </Routes>
  );
};

export default AppRoutes;
