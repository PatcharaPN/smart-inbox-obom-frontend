import { useEffect, useState } from "react";
import "./App.css";
import AppRoutes from "./AppRoutes";
import FixedBackground from "./components/FixedBG";
import LoadingScreen from "./components/LoadingScreen/LoadingScreen";
import { UserProvider } from "./api/contexts/userContext";
import { TokenProvider } from "./api/contexts/useTokenContext";
import UpdateNotifier from "./components/UpdateNotifier/UpdateNotifier";
import axios from "axios";
import { ToastContainer } from "react-toastify";

function App() {
  const [isLoading, setIsLoading] = useState(true);

  setInterval(async () => {
    try {
      const res = await axios.get(
        "https://one.obomgauge.com/api/connectionCheck",
        {
          headers: { "Cache-Control": "no-store" }, // ป้องกัน cache เช่นเดียวกับ fetch
        }
      );
      console.log("✅ Backend Online", res.status);
    } catch (err) {
      console.warn("❌ Backend down, reload in 3s");
      setTimeout(() => window.location.reload(), 3000);
    }
  }, 10000);

  useEffect(() => {
    const loadingTimer = setTimeout(() => {
      setIsLoading(false);
    }, 1500);

    return () => {
      clearTimeout(loadingTimer);
    };
  }, []);

  if (isLoading) {
    return <LoadingScreen />;
  }

  return (
    <>
      <TokenProvider>
        <UserProvider>
          <FixedBackground />
          <UpdateNotifier />

          <AppRoutes />
        </UserProvider>
        <ToastContainer />
      </TokenProvider>
    </>
  );
}

export default App;
