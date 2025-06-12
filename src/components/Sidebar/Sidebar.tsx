import { Icon } from "@iconify/react";
import { type CurrentUserProp } from "../../api/contexts/userContext";
import { useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import packageJson from "../../../package.json";

const Sidebar = () => {
  const navigate = useNavigate();
  const [user, setCurrentUser] = useState<CurrentUserProp | null>(null);
  const [loading, setLoading] = useState(true);

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
    { icon: "ri:dashboard-line", label: "แดชบอร์ด", path: "Dashboard" },
    {
      icon: "material-symbols:stacked-email-outline",
      label: "อีเมลทั้งหมด",
      path: "Email",
    },
    {
      icon: "solar:folder-bold",
      label: "ไฟล์",
      path: "File",
    },
    { icon: "uil:setting", label: "ตั้งค่า", path: "Setting" },
  ];

  return (
    <aside className="sticky grid grid-rows-3 w-[300px] bg-gradient-to-b from-[#045893] to-[#011B2D] h-screen  rounded-tr-2xl rounded-br-2xl shadow-lg shadow-black">
      <div className="top-5 absolute flex flex-col items-center justify-center gap-2 w-full">
        <div className="flex items-center justify-center gap-2">
          <img
            draggable="false"
            src="/Logo.png"
            className="w-20 h-auto cursor-pointer"
            alt="OBOM Email Service Logo"
            onClick={() => navigate("/")}
          />
          <p className="text-white w-45">OBOM All In One Service</p>
        </div>
        <div className="w-full flex justify-between gap-4 p-6 bg-[#0D7DC0]/40 rounded-lg cursor-pointer hover:scale-102 transition duration-150">
          <div className="flex justify-center items-center gap-3">
            {/* ตรวจสอบว่า currentUser พร้อมหรือยัง */}
            {loading ? (
              // ถ้ายังโหลดข้อมูลไม่เสร็จ ให้แสดงรูป placeholder
              <div className="w-15 h-15 rounded-full bg-gray-300 animate-pulse" />
            ) : (
              <img
                className="rounded-full w-15 h-15 border-4 border-green-400 object-cover"
                src={`${import.meta.env.VITE_BASE_URL}/${user?.profilePic}`}
                alt="Profile"
              />
            )}
            <div className="text-white flex flex-col gap-1 text-xl">
              <p className="text-md">{user?.username}</p>
              <p className="text-sm">ตำแหน่ง : {user?.role}</p>
            </div>
          </div>

          <div
            onClick={() => navigate("/Setting/account")}
            className="flex justify-center items-center "
          >
            <Icon icon="uil:edit" width="24" height="24" color="#ffffff" />
          </div>
        </div>
      </div>
      <div className="flex flex-col items-center justify-center gap-5 mt-90">
        <img
          src="/Sidebar_Element.webp"
          className="w-full h-fit"
          alt="Sidebar decorative element"
        />
      </div>
      <ul className="flex flex-col gap-8 text-white flex-grow justify-start items-start px-10 h-fit">
        <div className="flex flex-col gap-8 justify-start z-100 ">
          {sidebarItems.map((item, index) => (
            <div className="flex gap-4 items-center w-full" key={index}>
              <Icon icon={item.icon} width="24" height="24" />
              <li
                key={index}
                className="cursor-pointer hover:text-[#F2F2F2] transition duration-300"
                onClick={() => navigate(`/${item.path}`)}
              >
                {item.label}
              </li>
            </div>
          ))}
        </div>
      </ul>
      <div className="flex gap-20 text-white items-end justify-center py-10 ">
        <li className="cursor-pointer list-none" onClick={handleLogout}>
          ออกจากระบบ
        </li>
        <Icon icon="mdi:logout" width="24" height="24" />
      </div>{" "}
      <p className="text-white cursor-pointer list-none p-5">
        {packageJson.version}
      </p>
    </aside>
  );
};

export default Sidebar;
