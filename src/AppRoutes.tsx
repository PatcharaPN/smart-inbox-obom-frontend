import { Route, Routes } from "react-router-dom";
import LoginPage from "./pages/LoginPage/LoginPage";
import HomePage from "./pages/HomePage/HomePage";
import ProtectedRoute from "./components/ProtectedRoute/ProtectedRoute";
import ProtectedLayout from "./components/ProtectedLayout/ProtectedLayout";
import DepartmentPage from "./pages/DepartmentPage/DepartmentPage";
import EmailPage from "./pages/EmailPage/EmailPage";
import FilePage from "./pages/FilePage/FilePage";
import DashboardPage from "./pages/DashboardPage/DashboardPage";
import SettingPage from "./pages/SettingPage/SettingPage";
import AccountPage from "./pages/SettingPage/AccountPage/AccountPage";
import AccountManagementPage from "./pages/SettingPage/AccountPage/AccountManagementPage";
import WebAppInfo from "./pages/WebAppInfo/WebAppInfo";
import ThemePage from "./pages/ThemePage/ThemePage";

import useUserActivity from "./api/contexts/useUserActivity";
import ActionHistoryPage from "./pages/SettingPage/AccountPage/ActionHistoryPage";
import HRMenupage from "./pages/hr/HRMenupage";

const AppRoutes = () => {
  useUserActivity();
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
      />
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
      />{" "}
      <Route
        path="/Dashboard"
        element={
          <div className="flex flex-row h-full">
            <ProtectedRoute>
              <ProtectedLayout>
                <DashboardPage />
              </ProtectedLayout>
            </ProtectedRoute>
          </div>
        }
      />{" "}
      <Route
        path="/HRApplication"
        element={
          <div className="flex flex-row h-full">
            <ProtectedRoute>
              <ProtectedLayout>
                <HRMenupage />
              </ProtectedLayout>
            </ProtectedRoute>
          </div>
        }
      />{" "}
      <Route
        path="/Setting"
        element={
          <ProtectedRoute>
            <ProtectedLayout>
              {" "}
              {/* ใส่ layout ที่มี sidebar หลัก */}
              <SettingPage /> {/* จะมี sidebar ย่อยในนี้ */}
            </ProtectedLayout>
          </ProtectedRoute>
        }
      >
        <Route path="account" element={<AccountPage />} />{" "}
        <Route path="users" element={<AccountManagementPage />} />
        <Route path="system-info" element={<WebAppInfo />} />
        <Route path="appearance" element={<ThemePage />} />
        <Route path="logs" element={<ActionHistoryPage />} />
      </Route>
    </Routes>
  );
};

export default AppRoutes;
