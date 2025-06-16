import { useEffect, useState } from "react";
import { Icon } from "@iconify/react";
import { Outlet, useNavigate } from "react-router-dom";
import Modal from "../../components/Modal/Modal";
import axiosInstance from "../../api/axiosInstance";

const SettingPage = () => {
  const navigate = useNavigate();
  const [isAdmin, setIsAdmin] = useState(false);

  useEffect(() => {
    const fetchUserRole = async () => {
      try {
        const response = await axiosInstance.get("/auth/me", {});
        console.log(response.data.data.user.isAdmin);

        setIsAdmin(response.data.data.user.isAdmin);
      } catch (error) {
        console.error("Failed to fetch user role:", error);
      }
    };
    fetchUserRole();
  }, []);

  const sidebarItems = [
    {
      icon: "mdi:account-outline",
      label: "ตั้งค่าบัญชี",
      path: "Setting/account",
    },
    // {
    //   icon: "material-symbols:stacked-email-outline",
    //   label: "การแจ้งเตือน",
    //   path: "Setting/notification",
    // },
    // {
    //   icon: "ri:dashboard-line",
    //   label: "ตั้งค่าแอพ",
    //   path: "Setting/app",
    // },
    // {
    //   icon: "mdi:lock-outline",
    //   label: "ความปลอดภัย",
    //   path: "Setting/security",
    // },
    {
      icon: "mdi:account-multiple-outline",
      label: "จัดการผู้ใช้",
      path: "Setting/users",
      adminOnly: true,
    },
    {
      icon: "mdi:palette-outline",
      label: "ธีม & รูปแบบ",
      path: "Setting/appearance",
    },
    {
      icon: "mdi:history",
      label: "บันทึกกิจกรรม",
      path: "Setting/logs",
      adminOnly: true,
    },

    // {
    //   icon: "mdi:link-variant",
    //   label: "การเชื่อมต่อ",
    //   path: "Setting/integrations",
    // },
    {
      icon: "mdi:information-outline",
      label: "ข้อมูลระบบ",
      path: "Setting/system-info",
    },
  ];

  const navigateWithLoading = (path: string) => {
    navigate(`/${path}`);
  };

  return (
    <div className="p-10">
      <Modal>
        <div className="w-[77vw] h-[85vh]">
          <div className="grid grid-cols-[300px_auto] h-full">
            <div className="border-r h-[85vh] border-black/20">
              <div className="flex flex-col gap-8 justify-start p-10">
                {sidebarItems
                  .filter((item) => !item.adminOnly || isAdmin === true)
                  .map((item, index) => (
                    <div
                      className="flex gap-4 items-center cursor-pointer hover:text-[#F2F2F2] transition duration-300"
                      key={index}
                      onClick={() => navigateWithLoading(item.path)}
                    >
                      <Icon icon={item.icon} width="24" height="24" />
                      <span>{item.label}</span>
                    </div>
                  ))}
              </div>
            </div>
            <div>
              <Outlet />
            </div>
          </div>
        </div>
      </Modal>
    </div>
  );
};

export default SettingPage;
