import { useState } from "react";
import Modal from "../Modal/Modal";
import { motion } from "framer-motion";
import { Icon } from "@iconify/react";

type FormData = {
  firstName: string;
  nickname?: string;
  lastName: string;
  employeeId: string;
  department: string;
  note?: string;
  employeeType: string;
  photo: File[];
  cardType: "horizontal" | "vertical";
};

type DeleteEmployeeCardPopupProps = {
  employee: FormData;
  onClose: () => void;
  onConfirm?: () => void;
  onCancel?: () => void;
};

const DeleteEmployeeCardPopup = ({
  onClose,
  onConfirm,
  employee,
}: DeleteEmployeeCardPopupProps) => {
  const [isButtonClicked] = useState(false);
  const [isConfirmButtonClicked, setConfirmIsButtonClicked] = useState(false);

  const fullName = `${employee.firstName} ${employee.lastName}`;
  const empId = employee.employeeId;

  return (
    <motion.div
      className="fixed inset-0 bg-black/30 z-50"
      onClick={onClose}
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.15, ease: "easeOut" }}
    >
      {/* ✅ Centered container */}
      <div className="w-full h-full flex justify-center items-center">
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0, scale: 0.95 }}
          transition={{ duration: 0.2, ease: "easeOut" }}
          onClick={(e) => e.stopPropagation()}
          className=" rounded-xl w-[90vw] max-w-md p-8"
        >
          <Modal>
            <div className="flex flex-col items-center justify-center gap-8">
              <div className="w-24 h-24 rounded-full bg-[#EF5350]/20 flex justify-center items-center">
                <Icon
                  icon="line-md:alert-loop"
                  width="60"
                  height="60"
                  color="#FF3D3D"
                />
              </div>

              <div className="text-center">
                <p className="font-semibold text-xl">
                  ยืนยันการลบข้อมูลพนักงาน
                </p>
                <p className="font-medium text-black/70 text-base mt-2">
                  คุณกำลังจะลบข้อมูลของ {fullName} (รหัส: {empId}) แน่ใจหรือไม่?
                </p>
              </div>

              <div className="flex gap-6">
                <motion.button
                  animate={{ scale: isButtonClicked ? 0.95 : 1 }}
                  transition={{ duration: 0.15 }}
                  onClick={onClose}
                  className="cursor-pointer px-5 py-2 bg-gray-300 text-black/70 font-medium rounded-md hover:bg-gray-400 transition"
                >
                  ยกเลิก
                </motion.button>

                <motion.button
                  animate={{ scale: isConfirmButtonClicked ? 0.95 : 1 }}
                  transition={{ duration: 0.15 }}
                  onClick={() => {
                    setConfirmIsButtonClicked(true);
                    setTimeout(() => {
                      onConfirm?.();
                      setConfirmIsButtonClicked(false);
                    }, 100);
                  }}
                  className="cursor-pointer px-5 py-2 bg-red-500 text-white font-medium rounded-md hover:bg-red-600 transition"
                >
                  ลบเลย!
                </motion.button>
              </div>
            </div>
          </Modal>
        </motion.div>
      </div>
    </motion.div>
  );
};

export default DeleteEmployeeCardPopup;
