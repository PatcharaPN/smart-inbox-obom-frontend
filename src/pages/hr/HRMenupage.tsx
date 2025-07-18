import Modal from "../../components/Modal/Modal";
import { useNavigate } from "react-router-dom";
import { rectSortingStrategy } from "@dnd-kit/sortable";
import { toast, ToastContainer, Bounce } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import {
  DndContext,
  closestCenter,
  PointerSensor,
  useSensor,
  useSensors,
} from "@dnd-kit/core";
import { arrayMove, SortableContext, useSortable } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import { useState } from "react";
import { motion } from "framer-motion";

const defaultServices = [
  {
    name: "จัดการผู้สมัคร",
    icon: "/Elements/HR_icon_applicant.png",
    path: "/HRApplication/applicant",
    gradient: "from-[#285FC6] to-[#11213D]",
    ready: true,
  },
  {
    name: "จัดการบัตรพนักงาน",
    icon: "/Elements/HR_icon_employee_card.png",
    path: "/HRApplication/HRCardGenerator",
    ready: true,
  },
  {
    name: "การลา",
    icon: "/Elements/icon-leave.png",
    path: "/Leaving",
    gradient: "from-[#F08CFF] to-[#3F1745]",
    ready: false,
  },
  {
    name: "จัดการพนักงาน",
    icon: "/Elements/HR_icon_employee.png",
    path: "/EmployeeManagement",
    gradient: "from-[#00B8A9] to-[#005B5C]",
    ready: false,
  },
];

const SortableServiceCard = ({ service, handleClick }: any) => {
  const { attributes, listeners, setNodeRef, transform } = useSortable({
    id: service.name,
  });

  const style = {
    transform: CSS.Transform.toString(transform) || undefined,
    transition: transform ? "transform 250ms ease-in-out" : undefined,
  };

  return (
    <motion.div
      ref={setNodeRef}
      style={style}
      onClick={() => handleClick(service)}
      className="group w-32 cursor-pointer transition-transform hover:scale-105"
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

const HRMenupage = () => {
  const [services, setServices] = useState(defaultServices);
  const navigate = useNavigate();
  const sensors = useSensors(useSensor(PointerSensor));

  const handleDragEnd = (event: any) => {
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

  const handleClick = (service: any) => {
    if (service.ready) {
      navigate(service.path); // 👉 ไปตาม path ที่ระบุ เช่น "/applicant"
    } else {
      toast.info("บริการนี้อยู่ระหว่างการพัฒนา");
    }
  };

  return (
    <>
      <div className="p-10">
        <Modal onBack={() => navigate(-1)}>
          <div className="h-[85vh] 2xl:w-[77vw] w-fit mx-auto">
            <div className="p-10">
              <section className="text-start mb-6">
                <h1 className="text-4xl font-semibold mb-2">บริการด้านบุคคล</h1>
                <p className="text-gray-500">เลือกบริการของคุณ</p>
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
                  <div className="flex gap-10 flex-wrap">
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
            </div>
          </div>
        </Modal>
      </div>
      <ToastContainer
        position="bottom-right"
        autoClose={3000}
        hideProgressBar={false}
        newestOnTop={false}
        closeOnClick
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
        transition={Bounce}
      />
    </>
  );
};

export default HRMenupage;
