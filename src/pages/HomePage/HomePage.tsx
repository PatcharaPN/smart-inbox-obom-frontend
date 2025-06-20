import { Icon } from "@iconify/react/dist/iconify.js";
import Modal from "../../components/Modal/Modal";
import RamIndicator from "../../components/StorageIndicator/RamIndicator";
import StorageIndicator from "../../components/StorageIndicator/StorageIndicator";
import NewsEmail from "../../components/NewsEmail/NewsEmail";
import { formattedDate } from "../../hooks/useDateConvert";
import { useUser } from "../../api/contexts/userContext";

const HomePage = () => {
  const { currentUser } = useUser();

  // const getUserInitials = (name: string) => {
  //   if (!name || name.length < 2) return name;
  //   const prefix = name.slice(0, 1);
  //   const suffix = name.slice(-1);
  //   return prefix + suffix;
  // };

  // const initials = user?.username ? getUserInitials(user?.username) : "??";
  return (
    <div className="flex flex-col h-full p-3">
      {/* <div className="flex justify-end items-center">
        <div className="w-12 h-12 bg-blue-500 rounded-full flex justify-center items-center text-white cursor-pointer hover:scale-105 transition-all duration-300 ease-in-out">
          {initials.toUpperCase()}
        </div>
      </div> */}
      <div className="2xl:w-full h-full ">
        <Modal>
          <div className="h-fit">
            <p className="text-start text-xl font-semibold">
              {currentUser ? (
                <span>สวัสดี คุณ {currentUser?.username} !</span>
              ) : (
                <span>Failed to fetch username</span>
              )}
            </p>
            <div className="flex flex-row gap-10 items-center mt-5">
              {" "}
              <StorageIndicator />
              <RamIndicator />
            </div>
          </div>
        </Modal>
      </div>
      <section className="xl:my-8 my-10 flex gap-5 ">
        <h1 className="text-3xl ">รายชื่ออีเมลล์ที่เข้ามาใหม่</h1>
        <div className="flex items-end gap-2 opacity-40">
          <Icon
            className=""
            icon="material-symbols:refresh"
            width="24"
            height="24"
          />
          <p className="lg:hidden self-end ">อัพเดทล่าสุด {formattedDate}</p>
        </div>
      </section>
      <section>
        <NewsEmail />
      </section>
    </div>
  );
};

export default HomePage;
