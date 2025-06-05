// src/contexts/UserContext.tsx
import React, { createContext, useContext, useEffect, useState } from "react";
import axiosInstance from "../axiosInstance";

interface CurrentUserProp {
  name: string;
  surname: string;
  username: string;
  phoneNumber: string;
  role: string;
  email: string;
  profilePic: string;
}

interface UserContextType {
  currentUser: CurrentUserProp | null;
  setCurrentUser: React.Dispatch<React.SetStateAction<CurrentUserProp | null>>;
  refreshUser: () => Promise<void>;
}

const UserContext = createContext<UserContextType | undefined>(undefined);

export const UserProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const [currentUser, setCurrentUser] = useState<CurrentUserProp | null>(null);

  const refreshUser = async () => {
    try {
      const res = await axiosInstance.get("/auth/me");
      setCurrentUser(res.data.data.user);
    } catch (error: any) {
      if (error.response?.status === 401) {
        console.error("Token invalid or expired, please login again.");
        setCurrentUser(null);

        // 🔐 ถ้าใช้ refresh token แบบ header ก็สามารถใส่ logic auto-refresh ได้ตรงนี้
        // ไม่ใช้ refresh token ก็แค่ logout
      } else {
        console.error("Failed to fetch user:", error);
      }
    }
  };

  useEffect(() => {
    refreshUser();
  }, []);

  return (
    <UserContext.Provider value={{ currentUser, setCurrentUser, refreshUser }}>
      {children}
    </UserContext.Provider>
  );
};

export const useUser = () => {
  const context = useContext(UserContext);
  if (!context) throw new Error("useUser must be used within a UserProvider");
  return context;
};
