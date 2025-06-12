import { useCallback, useEffect, useState } from "react";
import SearchBarComponent from "../../../components/SearchBar/SearchBarComponent";
import UserListComponent, {
  type User,
} from "../../../components/UserListComponent/UserListComponent";

import axiosInstance from "../../../api/axiosInstance";
import AddUserComponent from "../../../components/AddUserComponent/AddUserComponent";
import AddIMAPComponent from "../../../components/AddIMAPComponent/AddIMAPComponent";
import { Bounce, ToastContainer } from "react-toastify";
import { useSocket } from "../../../api/contexts/socketContext";
import { useToken } from "../../../api/contexts/useTokenContext";

const AccountManagementPage = () => {
  const [onlineUsers, setOnlineUsers] = useState<string[]>([]);
  const [userList, setUserList] = useState<User[]>([]);
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [isAddUserModalOpen, setIsAddUserModalOpen] = useState(false);
  const [isAddImapModalOpen, setIsAddImapModalOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const socket = useSocket();
  const user = localStorage.getItem("user");
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
      const response = await axiosInstance("/auth/users");
      const data = await response.data.data;
      setUserList(data);
    } catch (error) {
      console.error("Failed to fetch user list:", error);
    }
  }, []);
  useEffect(() => {
    fetchUserList();
  }, [fetchUserList]);

  const filteredUsers = userList.filter((user) => {
    const fullName = `${user.name ?? ""} ${user.surname ?? ""}`.toLowerCase();
    const username = (user.username ?? "").toLowerCase();
    const term = searchTerm.toLowerCase();
    const category = user.categories;

    const matchSearch =
      fullName.includes(term) ||
      username.includes(term) ||
      (user._id ?? "").toLowerCase().includes(term);

    const matchCategory =
      selectedCategory === "all" || category === selectedCategory;

    return matchSearch && matchCategory;
  });

  const uniqueCategories = [...new Set(userList.map((u) => u.categories))];
  return (
    <>
      {/* Header Section */}
      <section className="flex flex-col h-full p-10">
        <h1 className="text-3xl mb-5">จัดการบัญชีผู้ใช้</h1>{" "}
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
              {uniqueCategories.map((category) => (
                <option key={category} value={category}>
                  {category}
                </option>
              ))}
            </select>
          </div>
          <div className="flex justify-end items-center gap-5 w-full">
            <button
              onClick={() => setIsAddUserModalOpen(!isAddUserModalOpen)}
              className="px-4 py-2 cursor-pointer bg-[#0065AD] text-white rounded-full hover:bg-[#0056a8] transition-colors duration-300"
            >
              เพิ่มบัญชีผู้ใช้
            </button>
            <button
              onClick={() => setIsAddImapModalOpen(!isAddImapModalOpen)}
              className="px-4 py-2 cursor-pointer bg-[#03909A] text-white rounded-full hover:bg-[#007078] transition-colors duration-300"
            >
              เพิ่มบัญชี IMAP
            </button>
          </div>
        </div>
        <div className="border sticky w-full bg-gray-500/20 grid grid-cols-[40px_100px_3fr_3fr_1fr_1fr_1fr] md:grid-cols-[40px_100px_3fr_2fr_1fr_1fr_1fr] gap-2 items-center border-b border-gray-200">
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
          </div>
          <div className="flex items-center justify-center border-r border-gray-300 p-2">
            หมวดหมู่
          </div>
          <div className="flex items-center border-r border-gray-300 p-2">
            ตำแหน่ง
          </div>
          <div className="flex justify-center items-center p-2">จัดการ</div>
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
        <UserListComponent onlineUsers={onlineUsers} user={filteredUsers} />
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

export default AccountManagementPage;
