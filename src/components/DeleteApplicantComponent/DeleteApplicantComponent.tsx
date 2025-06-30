import React from "react";
import { motion } from "framer-motion";

type DeleteUserModalProps = {
  userName: string;
  isOpen: boolean;
  onClose: () => void;
  onCancel: () => void;
  onConfirm: () => void;
};

const backdropVariants = {
  hidden: { opacity: 0 },
  visible: { opacity: 1 },
};

const modalVariants = {
  hidden: { opacity: 0, y: "-100vh" },
  visible: { opacity: 1, y: "0" },
};

const DeleteApplicantModal: React.FC<DeleteUserModalProps> = ({
  userName,
  isOpen,
  onClose,
  onCancel,
  onConfirm,
}) => {
  if (!isOpen) return null;

  return (
    <motion.div
      className="fixed inset-0 bg-black bg-opacity-30 flex justify-center items-center z-50"
      variants={backdropVariants}
      initial="hidden"
      animate="visible"
      exit="hidden"
      onClick={onClose}
    >
      <motion.div
        className="bg-white rounded-lg shadow-lg p-6 max-w-md w-full"
        variants={modalVariants}
        onClick={(e) => e.stopPropagation()}
      >
        <h3 className="text-lg font-semibold mb-4">ยืนยันการลบผู้ใช้</h3>
        <p className="mb-6">
          คุณต้องการลบผู้สมัคร <strong>{userName}</strong> ใช่หรือไม่?
        </p>
        <div className="flex justify-end gap-4">
          <button
            onClick={onCancel}
            className="px-4 py-2 rounded border border-gray-300 hover:bg-gray-100 transition"
          >
            ยกเลิก
          </button>
          <button
            onClick={onConfirm}
            className="px-4 py-2 rounded bg-red-600 text-white hover:bg-red-700 transition"
          >
            ลบ
          </button>
        </div>
      </motion.div>
    </motion.div>
  );
};

export default DeleteApplicantModal;
