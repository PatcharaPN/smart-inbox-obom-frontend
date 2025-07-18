import { Icon } from "@iconify/react";
import { useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import version from "../../../public/version.json";
import sidebarBG from "../../assets/BG-Sidebar.png";
import { type CurrentUserProp } from "../../api/contexts/userContext";

const Sidebar = () => {
  const navigate = useNavigate();
  const [currentUser, setCurrentUser] = useState<CurrentUserProp | null>(null);
  const [loading, setLoading] = useState(true);
  const currentPath = location.pathname;

  useEffect(() => {
    const storedUser = localStorage.getItem("user");
    if (storedUser) {
      const parsedUser = JSON.parse(storedUser);
      setCurrentUser(parsedUser);
    } else {
      setCurrentUser(null);
    }
    setLoading(false);
  }, []);

  const handleLogout = () => {
    try {
      localStorage.removeItem("accessToken");
      localStorage.removeItem("user");
      window.location.reload();
      navigate("/", { replace: true });
    } catch (error) {
      console.log("An error occurred during logout:", error);
    }
  };

  const sidebarItems = [
    { icon: "mdi:home-outline", label: "หน้าหลัก", path: "Home" },
    {
      icon: "ri:dashboard-line",
      label: "แดชบอร์ด",
      path: "Dashboard",
      isAdmin: false,
    },
    { icon: "uil:setting", label: "ตั้งค่า", path: "Setting" },
  ];

  const filteredSidebarItems = sidebarItems.filter((item) => {
    return item.isAdmin ? currentUser?.isAdmin === true : true;
  });

  if (loading) {
    return (
      <aside className="relative w-[300px] h-screen rounded-tr-2xl rounded-br-2xl shadow-lg shadow-black overflow-hidden">
        <p className="text-white">Loading...</p>
      </aside>
    );
  }

  return (
    <aside className="relative w-[300px] h-screen rounded-tr-2xl rounded-br-2xl shadow-lg shadow-black overflow-hidden">
      {/* Background Image */}
      <div
        style={{ backgroundImage: `url(${sidebarBG})` }}
        className="absolute inset-0 w-full h-full z-0 bg-cover bg-center bg-no-repeat"
      />

      {/* Content Layer */}
      <div className="relative z-20 grid grid-rows-3 h-full">
        {/* Header: Logo + User Info */}
        <div className="flex flex-col items-center justify-center gap-4 p-4">
          <div className="flex items-center gap-2">
            <img
              src="/Logo.png"
              alt="Logo"
              draggable={false}
              onClick={() => navigate("/")}
              className="w-20 cursor-pointer"
            />
            <p className="text-white font-semibold text-start">
              OBOM All In One Service
            </p>
          </div>

          {currentUser && (
            <div
              onClick={() => navigate("/Setting/account")}
              className="w-full flex justify-between items-center gap-4 p-4 bg-[#0D7DC0]/40 rounded-lg cursor-pointer hover:scale-105 transition duration-150"
            >
              <div className="flex items-center gap-3">
                <img
                  src={`${import.meta.env.VITE_BASE_URL}/${
                    currentUser.profilePic
                  }`}
                  alt="Profile"
                  className="rounded-full w-15 h-15 border-4 border-green-400 object-cover"
                />
                <div className="text-white flex flex-col gap-1">
                  <p className="text-md">
                    {currentUser.id}: {currentUser.username}
                  </p>
                  <p className="text-sm">ตำแหน่ง : {currentUser.role}</p>
                </div>
              </div>
              <Icon icon="uil:edit" width="24" height="24" color="#ffffff" />
            </div>
          )}
        </div>

        {/* Menu Items */}
        <ul className="flex flex-col gap-4 flex-grow px-8 pt-4 text-white">
          {filteredSidebarItems.map((item, index) => {
            const isActive = currentPath.includes(item.path);
            return (
              <li
                key={index}
                onClick={() => navigate(`/${item.path}`)}
                className={`flex gap-4 items-center px-4 py-2 rounded-lg cursor-pointer transition ${
                  isActive
                    ? "bg-green-500/20 text-green-300 font-semibold"
                    : "hover:bg-white/10"
                }`}
              >
                <Icon icon={item.icon} width="28" height="28" />
                <span className="text-base">{item.label}</span>
              </li>
            );
          })}
        </ul>
        <div></div>
        {/* Footer: Logout + Version */}
        <div className="flex flex-col items-center gap-4 pb-6 text-white">
          <div
            className="flex gap-2 items-center cursor-pointer"
            onClick={handleLogout}
          >
            <Icon icon="mdi:logout" width="24" height="24" />
            <span>ออกจากระบบ</span>
          </div>
          <p className="text-sm text-gray-300">v{version.version}</p>
        </div>
      </div>
    </aside>
  );
};

export default Sidebar;
