import { useNavigate } from "react-router-dom";
import Modal from "../../components/Modal/Modal";

const HomePage = () => {
  const navigate = useNavigate();
  // const getUserInitials = (name: string) => {
  //   if (!name || name.length < 2) return name;
  //   const prefix = name.slice(0, 1);
  //   const suffix = name.slice(-1);
  //   return prefix + suffix;
  // };

  // const initials = user?.username ? getUserInitials(user?.username) : "??";
  return (
    <div className="p-5">
      <Modal>
        <div className=" h-[90vh] w-[79vw] ">
          <section className="p-10 flex flex-col gap-2">
            <p className="text-4xl">บริการ</p>
            <p className="opacity-65">กรุณาเลือกบริการที่จะใช้งานด้านล่าง</p>
          </section>

          {/* Main Content */}
          <section className="p-10 flex gap-10">
            <div
              onClick={() => navigate("/Email")}
              className="flex flex-col items-center gap-2"
            >
              <div className="bg-gradient-to-b from-[#F08CFF] to-[#3F1745] w-35 h-35 rounded-2xl flex justify-center items-center cursor-pointer hover:scale-101 transition duration-150">
                <img
                  src="/Elements/EmailBackup_icon.png"
                  className="w-25 h-auto "
                  alt=""
                />
              </div>
              <p>สำรองอีเมลล์</p>
            </div>{" "}
            <div
              onClick={() => navigate("/File")}
              className="flex flex-col items-center gap-2"
            >
              <div className="bg-gradient-to-b from-[#285FC6] to-[#11213D] w-35 h-35 rounded-2xl flex justify-center items-center cursor-pointer hover:scale-101 transition duration-150">
                <img
                  src="/Elements/Explorer_icon.png"
                  className="w-25 h-auto "
                  alt=""
                />
              </div>
              <p>จัดการไฟล์</p>
            </div>
          </section>
        </div>
      </Modal>
    </div>
  );
};

export default HomePage;
