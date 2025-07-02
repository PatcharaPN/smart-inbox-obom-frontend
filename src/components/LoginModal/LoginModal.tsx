import { Icon } from "@iconify/react";
import { useEffect, useState } from "react";
import { loginUser, type RecentUser } from "../features/auth/authSlice";
import { useAppDispatch, useAppSelector } from "../../redux/store";
import { useNavigateWithLoading } from "../../hooks/useNavigateWithLoading/useNavigateWithLoading";
import LoadingScreen from "../LoadingScreen/LoadingScreen";
import { motion } from "framer-motion";
import UserSelector from "../UserSelector/UserSelector";

const LoginModal = () => {
  const { loading, navigateWithLoading } = useNavigateWithLoading();
  const recentUsersStr = localStorage.getItem("recentUsers") || "[]";
  const recentUsersMap: RecentUser[] = JSON.parse(recentUsersStr);
  const hasRecentUsers =
    Array.isArray(recentUsersMap) && recentUsersMap.length > 0;

  const [useRecentUsers, setUseRecentUsers] = useState(hasRecentUsers);

  const [selectedUser, setSelectedUser] = useState<RecentUser | undefined>(
    recentUsersMap.length > 0 ? recentUsersMap[0] : undefined
  );

  const [showPassword, setShowPassword] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const dispatch = useAppDispatch();

  const { isAuthenticated } = useAppSelector((state) => state.auth);

  useEffect(() => {
    if (isAuthenticated) {
      navigateWithLoading("/Home", 1500);
    }
  }, [isAuthenticated, navigateWithLoading]);

  const handleSwitchUser = () => {
    setSelectedUser(undefined);
    setEmail("");
    setPassword("");
    setUseRecentUsers(false);
  };

  const toggleShowPassword = () => {
    const passwordInput = document.getElementById(
      "password"
    ) as HTMLInputElement;

    if (passwordInput.type === "password") {
      passwordInput.type = "text";
    } else {
      passwordInput.type = "password";
    }
  };

  const handleClick = () => {
    setShowPassword(!showPassword);
    toggleShowPassword();
  };
  const handleDeleteUser = (userId: string) => {
    const updatedUsers = recentUsersMap.filter((user) => user.id !== userId);
    localStorage.setItem("recentUsers", JSON.stringify(updatedUsers));
    // ถ้าใช้ useState เก็บ recentUsersMap ให้เรียก setState ด้วย
    // สมมติคุณเก็บใน state ชื่อ recentUsersState
    // setRecentUsersState(updatedUsers);

    // ถ้ลบ user ที่เลือกอยู่ ให้ clear selectedUser
    if (selectedUser?.id === userId) {
      setSelectedUser(undefined);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const loginEmail =
      useRecentUsers && selectedUser ? selectedUser.email : email;
    await dispatch(loginUser({ email: loginEmail, password }));
  };

  if (loading) return <LoadingScreen />;

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 1.4 }}
      className="bg-white w-full max-w-[450px] h-full max-h-[450px] shadow-2xl rounded-xl p-10"
    >
      <div className="flex flex-col items-center justify-center h-full">
        <h1 className="text-2xl mb-4 self-start">ล็อคอิน</h1>
        <form className="w-full" onSubmit={handleSubmit}>
          {useRecentUsers ? (
            <>
              <div className="mb-4">
                <label
                  htmlFor="user-selector"
                  className="block text-sm font-medium text-gray-700 pb-1"
                >
                  เลือกผู้ใช้
                </label>
                <UserSelector
                  users={recentUsersMap}
                  selectedUser={selectedUser}
                  onSelect={setSelectedUser}
                  onDelete={handleDeleteUser}
                />
              </div>
              <div className="mb-4">
                <label
                  htmlFor="password"
                  className="block text-sm font-medium text-gray-700"
                >
                  รหัสผ่าน
                </label>
                <div className="flex items-center border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 pr-4">
                  <input
                    onChange={(e) => setPassword(e.target.value)}
                    value={password}
                    type={showPassword ? "text" : "password"}
                    placeholder="********"
                    id="password"
                    className="focus:outline-none mt-1 block p-3 w-full rounded-md focus:ring-blue-500 focus:border-blue-500"
                    required
                  />
                  <div className="cursor-pointer" onClick={handleClick}>
                    {showPassword ? (
                      <Icon
                        icon="fluent:eye-off-16-filled"
                        width="20"
                        height="20"
                      />
                    ) : (
                      <Icon icon="iconoir:eye-solid" width="20" height="20" />
                    )}
                  </div>
                </div>
              </div>
              <a href="">
                <p className="mb-2 text-[#0065AD]">ลืมรหัสผ่าน ?</p>
              </a>
              <button
                type="submit"
                className="w-full p-4 bg-[#0065AD] text-white rounded-md hover:bg-blue-950 hover:scale-98 transition duration-200 cursor-pointer"
              >
                ล็อคอิน
              </button>
              <button
                type="button"
                className="text-[#0065AD] mt-2 cursor-pointer"
                onClick={handleSwitchUser}
              >
                เปลี่ยนบัญชี
              </button>
            </>
          ) : (
            <>
              <div className="mb-4">
                <label
                  htmlFor="email"
                  className="block text-sm font-medium text-gray-700"
                >
                  Email
                </label>
                <input
                  onChange={(e) => setEmail(e.target.value)}
                  value={email}
                  type="email"
                  id="email"
                  placeholder="you@example.com"
                  className="placeholder:text-sm mt-1 block p-3 w-full border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500"
                  required
                />
              </div>
              <div className="mb-4">
                <label
                  htmlFor="password"
                  className="block text-sm font-medium text-gray-700"
                >
                  Password
                </label>
                <div className="flex items-center border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 pr-4">
                  <input
                    onChange={(e) => setPassword(e.target.value)}
                    value={password}
                    type={showPassword ? "text" : "password"}
                    placeholder="********"
                    id="password"
                    className="focus:outline-none mt-1 block p-3 w-full rounded-md focus:ring-blue-500 focus:border-blue-500"
                    required
                  />
                  <div className="cursor-pointer" onClick={handleClick}>
                    {showPassword ? (
                      <Icon
                        icon="fluent:eye-off-16-filled"
                        width="20"
                        height="20"
                      />
                    ) : (
                      <Icon icon="iconoir:eye-solid" width="20" height="20" />
                    )}
                  </div>
                </div>
              </div>
              <a href="">
                <p className="mb-2 text-[#0065AD] cursor-pointer">
                  ลืมรหัสผ่าน ?
                </p>
              </a>
              <button
                type="submit"
                className=" w-full p-4 bg-[#0065AD] text-white rounded-md hover:bg-blue-950 hover:scale-98 transition duration-200 cursor-pointer"
              >
                Login
              </button>
            </>
          )}
        </form>
      </div>
    </motion.div>
  );
};

export default LoginModal;
