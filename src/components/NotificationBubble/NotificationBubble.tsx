import { Icon } from "@iconify/react";
import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";

const notification = [
  {
    id: 1,
    iconUrl: "./Elements/HR_icon_small.png",
    type: "system",
    message: "แจ้งเตือนการปรับปรุงระบบ HR",
    describtion: [
      "- เพิ่มฟีเจอร์ ยื่นลางานออนไลน",
      "- เพิ่มระบบ ติดตามสถานะใบสมัคร",
      "- ปรับปรุง UI/UX ให้ใช้งานง่ายขึ้น",
    ],
    timestamp: "2023-12-01T10:00:00Z",
  },
  {
    id: 2,
    type: "user",
    describtion: [],
    notitype: "applicant",
    message: "มีผู้สมัครงานใหม่เข้ามา !",
    timestamp: "2023-12-02T12:30:00Z",
  },
  // {
  //   id: 3,
  //   type: "user",
  //   describtion: [],
  //   notitype: "warning",
  //   message: "นายแชมป์ โดนไล่ออกแล้ว !",
  //   timestamp: "2023-12-02T12:30:00Z",
  // },
];
const NotificationBubble = () => {
  const totalCount = notification.length;
  const [isOpen, setIsOpen] = useState(false);
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
    <div className="absolute right-10 bottom-6 z-50 ">
      {/* 🔘 Bubble */}
      <div className="relative w-16 h-16">
        <div
          className="w-full h-full rounded-full text-amber-900 bg-amber-400 hover:text-white hover:bg-amber-800 flex items-center justify-center cursor-pointer hover:scale-105 transition-transform"
          onClick={() => setIsOpen(!isOpen)}
        >
          <Icon icon="line-md:bell-loop" width="30" height="30" />
        </div>

        {/* 🔴 Bubble Notification Count */}
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
            className="absolute  bottom-20 right-0 w-[400px] select-none h-[700px] bg-[#ECF5FB]  rounded-xl shadow-2xl border border-black/20 overflow-y-auto"
          >
            {/* Header Section */}
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
                aria-label="Close notification panel"
              />
            </div>
            {/* System Notification Section */}
            <div>
              <div className="px-4 py-1">
                <h4 className="text-md mb-2">แจ้งเตือนระบบ</h4>
              </div>
              <div className="flex flex-col gap-2 px-2">
                {notification
                  .filter((n) => n.type === "system")
                  .map((n) => (
                    <div
                      key={n.id}
                      className="grid grid-cols-[80px_auto] cursor-pointer gap-4 bg-white shadow-lg rounded-xl border border-gray-200 hover:bg-gray-50 transition-colors p-4 items-start"
                    >
                      <div className="flex items-center justify-center h-full">
                        <img
                          src={n.iconUrl}
                          alt="icon"
                          className="w-16 h-16 object-contain"
                        />
                      </div>
                      <div>
                        <p className="text-md font-semibold mb-1">
                          {n.message}
                        </p>
                        {n.describtion.map((item, idx) => (
                          <p key={idx} className="text-sm opacity-70">
                            {item}
                          </p>
                        ))}
                        {/* ใส่วันที่ถ้าต้องการ */}
                        {/* <span className="text-xs text-gray-500">
              {new Date(n.timestamp).toLocaleString()}
            </span> */}
                      </div>
                    </div>
                  ))}
              </div>
            </div>
            <div>
              <div className="px-4 py-1 pt-5">
                <h4 className=" text-md mb-2">แจ้งเตือนผู้ใช้</h4>
              </div>
              {notification
                .filter((n) => n.type === "user")
                .map((n) => (
                  <div
                    key={n.id}
                    className="my-2 grid grid-cols-[50px_auto] cursor-pointer p-4 border-b mx-2 bg-white shadow-lg rounded-xl border-gray-200 hover:bg-gray-50 transition-colors"
                  >
                    <div>
                      <div className="flex justify-center items-center w-10 h-10 bg-amber-500 rounded-full p-2">
                        {getNotificationIcon(n.notitype || "default")}
                      </div>
                    </div>
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
