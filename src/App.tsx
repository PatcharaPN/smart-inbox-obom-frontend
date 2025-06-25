import { useEffect, useState } from "react";
import "./App.css";
import AppRoutes from "./AppRoutes";
import FixedBackground from "./components/FixedBG";
import LoadingScreen from "./components/LoadingScreen/LoadingScreen";
import { UserProvider } from "./api/contexts/userContext";
import { TokenProvider } from "./api/contexts/useTokenContext";
import UpdateNotifier from "./components/UpdateNotifier/UpdateNotifier";

function App() {
  const [isLoading, setIsLoading] = useState(true);

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
      </TokenProvider>
    </>
  );
}

export default App;
