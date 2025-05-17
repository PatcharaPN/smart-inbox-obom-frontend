import { logoutUser } from "../../components/features/auth/authSlice";
import { useNavigateWithLoading } from "../../hooks/useNavigateWithLoading/useNavigateWithLoading";
import { useAppDispatch } from "../../redux/store";
import { Icon } from "@iconify/react";
const Sidebar = () => {
  const { navigateWithLoading } = useNavigateWithLoading();
  const dispatch = useAppDispatch();

  // Event handler for logging out
  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    dispatch(logoutUser());
    navigateWithLoading("/");
  };

  // Example list items (can be dynamic if needed)
  const sidebarItems = [
    { icon: "mdi:home-outline", label: "หน้าหลัก", path: "Home" },
    { icon: "carbon:categories", label: "แผนก", path: "Department" },
    { icon: "uil:file-export", label: "ส่งออก", path: "Export" },
    { icon: "uil:setting", label: "ตั้งค่า", path: "Setting" },
  ];

  return (
    <aside className="sticky grid grid-rows-3 w-[300px] bg-gradient-to-b from-[#045893] to-[#011B2D] h-screen  rounded-tr-2xl rounded-br-2xl shadow-lg shadow-black">
      <div className="left-5 top-5 absolute flex items-center justify-center gap-2">
        <img
          draggable="false"
          src="./Logo.png"
          className="w-20 h-auto cursor-pointer"
          alt="OBOM Email Service Logo"
          onClick={() => navigateWithLoading("/")}
        />
        <p className="text-white">OBOM Email Service</p>
      </div>
      <div className="flex flex-col items-center justify-center gap-5 mt-90">
        <img
          src="./Sidebar_Element.webp"
          className="w-full h-fit"
          alt="Sidebar decorative element"
        />
      </div>
      <ul className="flex flex-col gap-8 text-white flex-grow justify-start items-start px-10">
        <div className="flex flex-col gap-8 justify-start">
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
