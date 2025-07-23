import { useSortable } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import { motion } from "framer-motion";
import type { Service } from "../../types/Services";

interface Props {
  service: Service;
  handleClick: (service: Service) => void;
}

const SortableServiceCard = ({ service, handleClick }: Props) => {
  const { attributes, listeners, setNodeRef, transform, transition } =
    useSortable({ id: service.name });

  const style = {
    transform: CSS.Transform.toString(transform),
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
        if (["Enter", " "].includes(e.key)) handleClick(service);
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

export default SortableServiceCard;
