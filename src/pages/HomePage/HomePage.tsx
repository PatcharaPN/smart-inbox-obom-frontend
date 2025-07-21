import { useNavigate } from "react-router-dom";
import Modal from "../../components/Modal/Modal";
import { rectSortingStrategy } from "@dnd-kit/sortable";
import { toast, ToastContainer, Bounce } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import {
  DndContext,
  closestCenter,
  PointerSensor,
  useSensor,
  useSensors,
  type DragEndEvent,
} from "@dnd-kit/core";
import { arrayMove, SortableContext, useSortable } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { useUser } from "../../api/contexts/userContext";

const defaultServices = [
  {
    name: "สำรองอีเมลล์",
    icon: "/Elements/EmailBackup_icon.png",
    path: "/Email",
    gradient: "from-[#F08CFF] to-[#3F1745]",
    ready: true,
    onlyHR: false,
  },
  {
    name: "จัดการไฟล์",
    icon: "/Elements/Explorer_icon.png",
    path: "/File",
    gradient: "from-[#285FC6] to-[#11213D]",
    ready: true,
    onlyHR: false,
  },
  {
    name: "จัดการบุคคล",
    icon: "/Elements/HumanResource_icon.png",
    path: "/HRApplication",
    gradient: "from-[#00B8A9] to-[#005B5C]",
    ready: true,
    onlyHR: true,
  },
  {
    name: "สมุดรายชื่อ",
    icon: "/Elements/CustomerBook_icon.png",
    path: "/Customer_Book",
    gradient: "from-[#00B8A9] to-[#005B5C]",
    ready: false,
    onlyHR: false,
  },
  {
    name: "แชร์ไฟล์",
    icon: "/Elements/OBOM_Sharing.png",
    path: "/Customer_Book",
    gradient: "from-[#00B8A9] to-[#005B5C]",
    ready: false,
    onlyHR: false,
  },
];

type Service = {
  name: string;
  icon: string;
  ready: boolean;
  path?: string;
  onlyHR: boolean;
};

type SortableServiceCardProps = {
  service: Service;
  handleClick: (service: Service) => void;
};

const SortableServiceCard: React.FC<SortableServiceCardProps> = ({
  service,
  handleClick,
}) => {
  const { attributes, listeners, setNodeRef, transform, transition } =
    useSortable({
      id: service.name,
    });

  const style = {
    transform: CSS.Transform.toString(transform) || undefined,
    transition,
  };

  return (
    <motion.div
      ref={setNodeRef}
      style={style}
      onClick={() => handleClick(service)}
      className="group w-32 cursor-pointer"
      initial={{ scale: 0 }}
      animate={{ scale: 1 }}
      transition={{ duration: 0.3, ease: "easeOut" }}
      tabIndex={0}
      role="button"
      onKeyDown={(e) => {
        if (e.key === "Enter" || e.key === " ") {
          handleClick(service);
        }
      }}
    >
      <div
        {...attributes}
        {...listeners}
        className="cursor-grab w-32 h-32 rounded-2xl flex justify-center items-center shadow-lg"
      >
        <img
          src={service.icon}
          alt={service.name}
          className="w-full h-full object-contain"
        />
      </div>
      <p className="text-lg text-center font-medium group-hover:text-blue-900 mt-2">
        {service.name}
        {!service.ready && (
          <span className="block text-sm text-gray-600">
            (อยู่ระหว่างการพัฒนา)
          </span>
        )}
      </p>
    </motion.div>
  );
};

const HomePage = () => {
  const navigate = useNavigate();
  const [services, setServices] = useState(defaultServices);
  const sensors = useSensors(useSensor(PointerSensor));
  const user = useUser();
  useEffect(() => {
    const savedOrder = localStorage.getItem("serviceOrder");
    if (savedOrder) {
      const order = JSON.parse(savedOrder);
      const reordered = order
        .map((name: string) => defaultServices.find((s) => s.name === name))
        .filter(Boolean);
      if (reordered.length) {
        setServices(reordered as typeof defaultServices);
      }
    }
  }, []);

  const handleClick = (service: Service) => {
    const role = user.currentUser?.role;

    if (service.onlyHR && role !== "HR" && user.currentUser?.isAdmin !== true) {
      toast.error("คุณไม่มีสิทธิ์เข้าถึงบริการนี้", {
        position: "bottom-right",
        autoClose: 3000,
        hideProgressBar: false,
        transition: Bounce,
      });
      return;
    }

    if (service.ready && service.path) {
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

  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event;
    if (!over) return;

    if (active.id !== over.id) {
      const oldIndex = services.findIndex((s) => s.name === active.id);
      const newIndex = services.findIndex((s) => s.name === over.id);
      const newOrder = arrayMove(services, oldIndex, newIndex);
      setServices(newOrder);
      localStorage.setItem(
        "serviceOrder",
        JSON.stringify(newOrder.map((s) => s.name))
      );
    }
  };

  return (
    <div className="p-10">
      <Modal>
        <div className="h-[85vh] 2xl:w-[77vw] w-fit mx-auto">
          <div className="p-10">
            <section className="text-start mb-6">
              <h1 className="text-4xl font-semibold mb-2">บริการ</h1>
              <p className="text-gray-500">
                ลากเพื่อจัดเรียงตามการใช้งานของคุณ
              </p>
            </section>

            <DndContext
              sensors={sensors}
              collisionDetection={closestCenter}
              onDragEnd={handleDragEnd}
            >
              <SortableContext
                items={services.map((s) => s.name)}
                strategy={rectSortingStrategy}
              >
                <div className="flex flex-wrap gap-10">
                  {services.map((service) => (
                    <SortableServiceCard
                      key={service.name}
                      service={service}
                      handleClick={handleClick}
                    />
                  ))}
                </div>
              </SortableContext>
            </DndContext>

            <ToastContainer />
          </div>
        </div>
      </Modal>
    </div>
  );
};

export default HomePage;
