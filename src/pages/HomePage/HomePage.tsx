import { useNavigate } from "react-router-dom";
import Modal from "../../components/Modal/Modal";
import { toast, ToastContainer, Bounce } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const HomePage = () => {
  const navigate = useNavigate();

  const services = [
    {
      name: "สำรองอีเมลล์",
      icon: "/Elements/EmailBackup_icon.png",
      path: "/Email",
      gradient: "from-[#F08CFF] to-[#3F1745]",
      ready: true,
    },
    {
      name: "จัดการไฟล์",
      icon: "/Elements/Explorer_icon.png",
      path: "/File",
      gradient: "from-[#285FC6] to-[#11213D]",
      ready: true,
    },
    {
      name: "จัดการบุคคล",
      icon: "/Elements/HumanResource_icon.png",
      path: "/File",
      gradient: "from-[#00B8A9] to-[#005B5C]",
      ready: false, // ยังไม่เสร็จ
    },
  ];

  const handleClick = (service: (typeof services)[0]) => {
    if (service.ready) {
      navigate(service.path);
    } else {
      toast.info(`🔧 ${service.name} อยู่ระหว่างการพัฒนา`, {
        position: "bottom-right",
        autoClose: 3000,
        hideProgressBar: false,
        transition: Bounce,
      });
    }
  };

  return (
    <div className="p-5">
      <Modal>
        <div className="h-[90vh] 2xl:w-[79vw] w-fit mx-auto">
          <section className="p-10 text-start">
            <h1 className="text-5xl font-bold mb-2">บริการ</h1>
            <p className="text-gray-500">กรุณาเลือกบริการที่จะใช้งานด้านล่าง</p>
          </section>

          <section className="p-10 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-10 place-items-center">
            {services.map((service, index) => (
              <div
                key={index}
                onClick={() => handleClick(service)}
                className="group flex flex-col items-center gap-4 cursor-pointer transition-transform transform hover:scale-105"
                role="button"
                aria-label={service.name}
              >
                <div
                  className={`bg-gradient-to-b ${service.gradient} w-32 h-32 rounded-2xl flex justify-center items-center shadow-lg`}
                >
                  <img
                    src={service.icon}
                    alt={service.name}
                    className="w-16 h-16 object-contain"
                  />
                </div>
                <p className="text-lg font-medium group-hover:text-blue-600 transition-colors">
                  {service.name}
                  {!service.ready && (
                    <span className="ml-2 text-sm text-orange-500">
                      (ยังไม่เสร็จ)
                    </span>
                  )}
                </p>
              </div>
            ))}
          </section>
        </div>
      </Modal>

      {/* ✅ Toast container */}
      <ToastContainer />
    </div>
  );
};

export default HomePage;
