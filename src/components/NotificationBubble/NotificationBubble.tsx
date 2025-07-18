import { useEffect, useState } from "react";
import { Icon } from "@iconify/react";
import { motion, AnimatePresence } from "framer-motion";
import axiosInstance from "../../api/axiosInstance";

const NotificationBubble = () => {
  const [notifications, setNotifications] = useState([]);
  const [isOpen, setIsOpen] = useState(false);

  useEffect(() => {
    const token = localStorage.getItem("accessToken");
    if (!token) return;
    const fetchNotifications = async () => {
      try {
        const res = await axiosInstance.get("/api/notifications", {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("accessToken")}`,
          },
        });

        setNotifications(res.data.data);
      } catch (err) {
        console.error("❌ Error fetching notifications:", err);
      }
    };

    fetchNotifications();
  }, []);

  const totalCount = notifications.length;

  const getNotificationIcon = (type: string) => {
    switch (type) {
      case "applicant":
        return (
          <div className="flex justify-center items-center w-10 h-10 bg-green-500 rounded-full p-2">
            <Icon
              icon="mdi:account-arrow-up"
              color="#fff"
              width="24"
              height="24"
            />
          </div>
        );
      case "warning":
        return (
          <div className="flex justify-center items-center w-10 h-10 bg-red-500 rounded-full p-2">
            <Icon
              icon="fluent-emoji-high-contrast:footprints"
              width="24"
              height="24"
              color="white"
            />
          </div>
        );
      default:
        return (
          <div className="flex justify-center items-center w-10 h-10 bg-gray-400 rounded-full p-2">
            <Icon icon="line-md:bell" color="#fff" width="24" height="24" />
          </div>
        );
    }
  };

  return (
    <div className="absolute right-10 bottom-6 z-50">
      {/* 🔘 Bubble */}
      <div className="relative w-16 h-16">
        <div
          className="w-full h-full rounded-full text-white bg-gradient-to-b from-sky-400 to-blue-600 hover:text-white hover:bg-blue-800 flex items-center justify-center cursor-pointer hover:scale-105 transition-transform"
          onClick={() => setIsOpen(!isOpen)}
        >
          <Icon icon="line-md:bell-loop" width="30" height="30" />
        </div>

        {totalCount > 0 && (
          <div className="absolute -top-1 -right-0 p-3 bg-red-600 text-white text-xs font-bold rounded-full w-5 h-5 flex items-center justify-center shadow-lg">
            {totalCount}
          </div>
        )}
      </div>

      {/* 🔽 Animated Panel */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, scaleY: 0, transformOrigin: "bottom" }}
            animate={{ opacity: 1, scaleY: 1, transformOrigin: "bottom" }}
            exit={{ opacity: 0, scaleY: 0, transformOrigin: "bottom" }}
            transition={{ duration: 0.3, ease: "easeOut" }}
            className="absolute bottom-20 right-0 w-[400px] select-none h-[700px] bg-[#ECF5FB] rounded-xl shadow-2xl border border-black/20 overflow-y-auto"
          >
            {/* Header */}
            <div className="flex justify-between w-full items-center h-15 gap-2 px-2">
              <div className="flex items-center gap-2">
                <Icon icon="line-md:bell-loop" width="24" height="24" />
                <h3 className="font-semibold text-lg">การแจ้งเตือน</h3>
              </div>
              <Icon
                className="cursor-pointer text-gray-500 hover:text-gray-700 p-1 rounded hover:bg-gray-200 transition"
                onClick={() => setIsOpen(false)}
                icon="iconamoon:arrow-down-2-light"
                width="24"
                height="24"
              />
            </div>

            {/* System Notifications */}
            <div className="px-4 py-1 pt-5">
              <h4 className="text-md mb-2">แจ้งเตือนระบบ</h4>
              {notifications.filter((n: any) => n.type !== "system").length ===
              0 ? (
                <p className="text-center text-gray-500 py-4">
                  ไม่มีแจ้งเตือนระบบ
                </p>
              ) : (
                notifications
                  .filter((n: any) => n.type !== "system")
                  .map((n: any) => (
                    <div
                      key={n._id}
                      className="my-2 grid grid-cols-[50px_auto] cursor-pointer p-4 border-b mx-2 bg-white shadow-lg rounded-xl border-gray-200 hover:bg-gray-50 transition-colors"
                    >
                      <div>{getNotificationIcon(n.notitype || "default")}</div>
                      <div>
                        <p className="text-sm font-bold">{n.message}</p>
                        <span className="text-xs text-gray-500">
                          {new Date(n.timestamp).toLocaleString()}
                        </span>
                      </div>
                    </div>
                  ))
              )}
            </div>

            {/* User Notifications */}
            <div className="px-4 py-1 pt-5">
              <h4 className="text-md mb-2">แจ้งเตือนผู้ใช้</h4>
              {notifications
                .filter((n: any) => n.type === "system")
                .map((n: any) => (
                  <div
                    key={n._id}
                    className="my-2 grid grid-cols-[50px_auto] cursor-pointer p-4 border-b mx-2 bg-white shadow-lg rounded-xl border-gray-200 hover:bg-gray-50 transition-colors"
                  >
                    <div>{getNotificationIcon(n.notitype || "default")}</div>
                    <div>
                      <p className="text-sm font-bold">{n.message}</p>
                      <span className="text-xs text-gray-500">
                        {new Date(n.timestamp).toLocaleString()}
                      </span>
                    </div>
                  </div>
                ))}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default NotificationBubble;
