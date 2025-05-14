import { useEffect, useState } from "react";
import "./App.css";
import AppRoutes from "./AppRoutes";
import FixedBackground from "./components/FixedBG";
import LoadingScreen from "./components/LoadingScreen/LoadingScreen";

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
      <FixedBackground />
      <AppRoutes />
    </>
  );
}

export default App;
