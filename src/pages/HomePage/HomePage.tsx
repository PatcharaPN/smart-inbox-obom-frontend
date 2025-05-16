import { Icon } from "@iconify/react/dist/iconify.js";
import Modal from "../../components/Modal/Modal";
import RamIndicator from "../../components/StorageIndicator/RamIndicator";
import StorageIndicator from "../../components/StorageIndicator/StorageIndicator";
import NewsEmail from "../../components/NewsEmail/NewsEmail";

const HomePage = () => {
  const userFromStorage = localStorage.getItem("user");
  const user = userFromStorage ? JSON.parse(userFromStorage) : null;
  const date = new Date();
  const formattedDate = date.toLocaleString("th-TH", {
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
    hour: "2-digit",
    minute: "2-digit",
  });

  const getUserInitials = (name: string) => {
    if (!name || name.length < 2) return name;
    const prefix = name.slice(0, 1);
    const suffix = name.slice(-1);
    return prefix + suffix;
  };

  const initials = user?.username ? getUserInitials(user?.username) : "??";
  return (
    <div className="flex flex-col h-full p-3">
      <div className="flex justify-end items-center ">
        <div className="w-12 h-12 bg-blue-500 rounded-full flex justify-center items-center text-white cursor-pointer hover:scale-105 transition-all duration-300 ease-in-out">
          {initials.toUpperCase()}
        </div>
      </div>
      <div className="w-full h-70">
        <Modal>
          <p className="text-start text-xl font-semibold">
            {user ? (
              <span>สวัสดี {user?.username} !</span>
            ) : (
              <span>Failed to fetch username</span>
            )}
          </p>
          <div className="flex flex-row gap-10 items-center mt-5">
            {" "}
            <StorageIndicator />
            <RamIndicator />
          </div>
        </Modal>
      </div>
      <section className="my-10 flex gap-5 ">
        <h1 className="text-3xl ">รายชื่ออีเมลล์ที่เข้ามาใหม่</h1>
        <div className="flex items-end gap-2 opacity-40">
          <Icon icon="material-symbols:refresh" width="24" height="24" />
          <p className="self-end ">อัพเดทล่าสุด {formattedDate}</p>
        </div>
      </section>
      <section>
        <NewsEmail />
      </section>
    </div>
  );
};

export default HomePage;
