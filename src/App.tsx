import { useEffect, useState } from "react";
import "./App.css";
import AppRoutes from "./AppRoutes";
import FixedBackground from "./components/FixedBG";
import LoadingScreen from "./components/LoadingScreen/LoadingScreen";
import { UserProvider } from "./api/contexts/userContext";

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
      <UserProvider>
        <FixedBackground />
        <AppRoutes />
      </UserProvider>
    </>
  );
}

export default App;
