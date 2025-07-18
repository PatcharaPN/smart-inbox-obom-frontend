import React, { createContext, useContext, useEffect, useState } from "react";
import axiosInstance from "../axiosInstance";

export interface CurrentUserProp {
  isAdmin: boolean;
  id: string;
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
  loading: boolean;
}

const UserContext = createContext<UserContextType | undefined>(undefined);

export const UserProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const [currentUser, setCurrentUser] = useState<CurrentUserProp | null>(null);
  const [loading, setLoading] = useState(true);
  const refreshUser = async () => {
    const token = localStorage.getItem("accessToken");

    if (!token) {
      console.warn("No token found, skipping refreshUser");
      setLoading(false);
      return;
    }

    try {
      const res = await axiosInstance.get("/auth/me");
      setCurrentUser(res.data.data.user);
    } catch (error: any) {
      console.error("refreshUser failed:", error);
      setCurrentUser(null);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    refreshUser();
  }, []);

  return (
    <UserContext.Provider
      value={{ currentUser, setCurrentUser, refreshUser, loading }}
    >
      {!loading ? children : <div>Loading user data...</div>}
    </UserContext.Provider>
  );
};

export const useUser = () => {
  const context = useContext(UserContext);
  if (!context) throw new Error("useUser must be used within a UserProvider");
  return context;
};
