import axiosInstance from "../../api/axiosInstance";
import { useNavigateWithLoading } from "../../hooks/useNavigateWithLoading/useNavigateWithLoading";
import { useAppDispatch } from "../../redux/store";
import { Icon } from "@iconify/react";
import { logout } from "../features/auth/authSlice";
import { useUser } from "../../api/contexts/userContext";
const Sidebar = () => {
  const { currentUser } = useUser();

  const { navigateWithLoading } = useNavigateWithLoading();
  const dispatch = useAppDispatch();

  // Event handler for logging out
  const handleLogout = async () => {
    try {
      await axiosInstance.post("auth/logout");
      dispatch(logout());
      navigateWithLoading("/");
    } catch (error) {
      console.error("Login failed", error);
    }
  };

  // Example list items (can be dynamic if needed)
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
    { icon: "carbon:categories", label: "แผนก", path: "Department" },
    { icon: "uil:file-export", label: "ส่งออก", path: "Export" },
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
            onClick={() => navigateWithLoading("/")}
          />
          <p className="text-white w-45">OBOM Database Service</p>
        </div>
        <div className="w-full flex justify-between gap-4 p-6 bg-[#0D7DC0]/40 rounded-lg cursor-pointer hover:scale-102 transition duration-150">
          <div className="flex justify-center items-center gap-3">
            <img
              className="rounded-full w-15 h-15 border-4 border-green-400 object-cover"
              src={`${import.meta.env.VITE_BASE_URL}/${
                currentUser?.profilePic
              }`}
              alt=""
            />{" "}
            <div className="text-white flex flex-col gap-1 text-xl">
              <p>{currentUser?.username}</p>
              <p>ตำแหน่ง : {currentUser?.role}</p>
            </div>
          </div>

          <div
            onClick={() => navigateWithLoading("/Setting/account")}
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
        <div className="flex flex-col gap-8 justify-start z-100">
          {sidebarItems.map((item, index) => (
            <div className="flex gap-4 items-center" key={index}>
              <Icon icon={item.icon} width="24" height="24" />
              <li
                key={index}
                className="cursor-pointer hover:text-[#F2F2F2] transition duration-300"
                onClick={() => navigateWithLoading(`/${item.path}`)}
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
      <p className="text-white cursor-pointer list-none p-5">V 1.0.0b</p>
    </aside>
  );
};

export default Sidebar;
