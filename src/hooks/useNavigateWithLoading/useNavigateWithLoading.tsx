// src/hooks/useNavigateWithLoading.tsx
import { useState } from "react";
import { useNavigate } from "react-router-dom";

export const useNavigateWithLoading = () => {
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const navigateWithLoading = (path: string, delay: number = 5000) => {
    setLoading(true);
    setTimeout(() => {
      navigate(path);
      setLoading(false);
    }, delay);
  };

  return { loading, navigateWithLoading };
};
