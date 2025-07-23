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
import { arrayMove, SortableContext } from "@dnd-kit/sortable";
import { useEffect, useMemo, useState } from "react";
import { useUser } from "../../api/contexts/userContext";
import { defaultServices } from "../../constants/service";
import type { Service } from "../../types/Services";
import SortableServiceCard from "../../components/SortableServiceCard/SortableServiceCard";

const HomePage = () => {
  const navigate = useNavigate();
  const [services, setServices] = useState<Service[]>(defaultServices);
  const sensors = useSensors(useSensor(PointerSensor));
  const user = useUser();

  const toastConfig = {
    position: "bottom-right" as const,
    autoClose: 3000,
    hideProgressBar: false,
    transition: Bounce,
  };

  const showErrorToast = (msg: string) => toast.error(msg, toastConfig);
  const showInfoToast = (msg: string) => toast.info(msg, toastConfig);

  useEffect(() => {
    const savedOrder = localStorage.getItem("serviceOrder");
    if (savedOrder) {
      try {
        const order = JSON.parse(savedOrder);
        const reordered = order
          .map((name: string) => defaultServices.find((s) => s.name === name))
          .filter(Boolean);
        if (reordered.length) setServices(reordered as Service[]);
      } catch (error) {
        console.error("Failed to parse serviceOrder:", error);
      }
    }
  }, []);

  const serviceNames = useMemo(() => services.map((s) => s.name), [services]);

  const handleClick = (service: Service) => {
    const role = user.currentUser?.role;

    if (service.onlyHR && role !== "HR" && !user.currentUser?.isAdmin) {
      showErrorToast("คุณไม่มีสิทธิ์เข้าถึงบริการนี้");
      return;
    }

    if (service.ready && service.path) {
      navigate(service.path);
    } else {
      showInfoToast(`🔧 ${service.name} อยู่ระหว่างการพัฒนา`);
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
                items={serviceNames}
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
