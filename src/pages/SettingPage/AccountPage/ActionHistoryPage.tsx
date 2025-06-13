import { useCallback, useEffect, useMemo, useState } from "react";
import SearchBarComponent from "../../../components/SearchBar/SearchBarComponent";
import { type User } from "../../../components/UserListComponent/UserListComponent";

import axiosInstance from "../../../api/axiosInstance";
import AddUserComponent from "../../../components/AddUserComponent/AddUserComponent";
import AddIMAPComponent from "../../../components/AddIMAPComponent/AddIMAPComponent";
import { Bounce, ToastContainer } from "react-toastify";
import { useSocket } from "../../../api/contexts/socketContext";
import UserHistoryComponent from "../../../components/UserHistoryComponent/UserHistoryComponent";

type LoginHistoryItem = {
  _id: string;
  action: string;
  loginAt: string;
  createdAt: string;
  user: {
    _id: string;
    id: number;
    name: string;
    email: string;
    username: string;
    role: string;
    categories: string;
    profilePic?: string;
  };
};

const ActivityHistory = () => {
  const [_, setOnlineUsers] = useState<string[]>([]);
  const [userList, setUserList] = useState<LoginHistoryItem[]>([]);

  const [selectedCategory, setSelectedCategory] = useState("all");
  const [isAddUserModalOpen, setIsAddUserModalOpen] = useState(false);
  const [isAddImapModalOpen, setIsAddImapModalOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const socket = useSocket();
  const user = localStorage.getItem("user");
  const [userStatusMap, setUserStatusMap] = useState<Record<string, string>>(
    {}
  );
  const parsedUser = user ? JSON.parse(user) : null;
  useEffect(() => {
    const handleUserListUpdated = (users: string[]) => {
      setOnlineUsers(users);
      fetchUserList();
    };

    socket.on("user-online", handleUserListUpdated);

    return () => {
      socket.off("user-online", handleUserListUpdated);
    };
  }, [socket]);
  useEffect(() => {
    if (parsedUser?._id && socket) {
      socket.emit("user-online", parsedUser._id);
    }
  }, [socket, user]);
  const fetchUserList = useCallback(async () => {
    try {
      const response = await axiosInstance("/logs");
      const data = await response.data.history;
      setUserList(data);
    } catch (error) {
      console.error("Failed to fetch user list:", error);
    }
  }, []);
  useEffect(() => {
    fetchUserList();
  }, [fetchUserList]);

  const filteredUsers = useMemo(() => {
    return userList.filter((entry) => {
      const fullName = (entry.user.name ?? "").toLowerCase();
      const username = (entry.user.username ?? "").toLowerCase();
      const term = searchTerm.toLowerCase();
      const category = entry.user.categories;

      const matchSearch =
        fullName.includes(term) ||
        username.includes(term) ||
        (entry.user._id ?? "").toLowerCase().includes(term);

      const matchCategory =
        selectedCategory === "all" || category === selectedCategory;

      return matchSearch && matchCategory;
    });
  }, [userList, searchTerm, selectedCategory]);
  const transformedUsers: User[] = useMemo(() => {
    return filteredUsers.map((item) => ({
      id: item.user.id,
      _id: item.user._id,
      name: item.user.name,
      username: item.user.username,
      surname: "",
      categories: item.user.categories,
      role: item.user.role,
      profilePic: item.user.profilePic,
      action: item.action,
      loginAt: item.loginAt,
    }));
  }, [filteredUsers]);
  useEffect(() => {
    const handleStatusUpdate = (statusMap: Record<string, string>) => {
      setUserStatusMap(statusMap);
    };

    socket.on("user-status-update", handleStatusUpdate);

    return () => {
      socket.off("user-status-update", handleStatusUpdate);
    };
  }, [socket]);

  return (
    <>
      {/* Header Section */}
      <section className="flex flex-col h-full p-10">
        <div className="flex items-center">
          <h1 className="text-3xl mb-5">บันทึกกิจกรรม</h1>
        </div>

        <div className="flex items-center justify-between gap-5 mb-5">
          <div className="w-full flex items-center gap-5">
            <SearchBarComponent
              searchTerm={searchTerm}
              setSearchTerm={setSearchTerm}
            />
            <select
              value={selectedCategory}
              onChange={(e) => setSelectedCategory(e.target.value)}
              className="w-fit px-4 my-5 bg-white rounded-full pl-2 pr-4 py-2 focus:ring-[#0065AD] focus:border-[#0065AD] focus:outline-none shadow border border-[#0065AD]"
            >
              <option value="all">ทั้งหมด</option>
              {/* {uniqueCategories.map((category) => (
                <option key={category} value={category}>
                  {category}
                </option>
              ))} */}
            </select>
          </div>
        </div>
        <div className="border  sticky w-full bg-gray-500/20 grid grid-cols-[40px_100px_3fr_3fr_1fr_1fr_2fr] md:grid-cols-[40px_100px_3fr_1fr_1fr_1fr_2fr] gap-2 items-center border-b border-gray-200">
          <div className="flex justify-center  items-center border-r border-gray-300 p-2">
            <input type="checkbox" />
          </div>
          <div className="flex justify-center items-center border-r border-gray-300 p-2">
            ไอดี
          </div>
          <div className="flex items-center border-r border-gray-300 p-2">
            ชื่อ
          </div>
          <div className="flex items-center border-r border-gray-300 p-2">
            ชื่อผู้ใช้
          </div>{" "}
          <div className="flex items-center justify-center border-r border-gray-300 p-2">
            หมวดหมู่
          </div>
          <div className="flex items-center border-r border-gray-300 p-2">
            ตำแหน่ง
          </div>
          <div className="flex justify-center items-center p-2">การกระทำ</div>
        </div>
        {isAddUserModalOpen && (
          <AddUserComponent
            fileName={""}
            onClose={() => setIsAddUserModalOpen(!isAddUserModalOpen)}
          />
        )}
        {isAddImapModalOpen && (
          <AddIMAPComponent
            onClose={() => setIsAddImapModalOpen(!isAddImapModalOpen)}
          />
        )}
        <div className=" flex-1 overflow-y-auto mt-4">
          <UserHistoryComponent
            userHistoryMap={userStatusMap}
            user={transformedUsers}
          />
        </div>
      </section>{" "}
      <ToastContainer
        position="bottom-right"
        autoClose={5000}
        hideProgressBar={false}
        newestOnTop
        closeOnClick
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
        theme="colored"
        transition={Bounce}
      />
    </>
  );
};

export default ActivityHistory;
