import { useState } from "react";
import Modal from "../Modal/Modal";
import { motion } from "framer-motion";
import { Icon } from "@iconify/react/dist/iconify.js";

type PermissionDeniedProps = {
  fileName: string;
  onClose: () => void;
  onConfirm?: () => void;
  onCancel?: () => void;
};

const PermissionDeniedComponent = ({
  onClose,
  fileName,
  onConfirm,
}: PermissionDeniedProps) => {
  const [isAgreeButtonClicked, setAgreeButtonClicked] = useState(false);

  console.log(fileName);

  return (
    <motion.div
      className="fixed inset-0 bg-black/30"
      onClick={onClose}
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.15, ease: "easeOut" }}
    >
      {" "}
      <div className="w-full h-full flex justify-center items-center">
        <motion.div
          initial={{ opacity: 0, scale: 0 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0, scale: 0 }}
          transition={{ duration: 0.15, ease: "easeOut" }}
          onClick={(e) => e.stopPropagation()}
        >
          <Modal>
            <div className="w-[18vw] flex flex-col items-center justify-center gap-10 mt-5">
              <div className="w-25 h-25 rounded-full bg-[#EF5350]/30 flex justify-center items-center">
                <Icon
                  icon="line-md:alert-loop"
                  width="55"
                  height="55"
                  color="#FF3D3D"
                />
              </div>
              <span className="flex flex-col gap-2 justify-center items-center">
                <p className="font-semibold text-xl text-center">
                  ไม่สามารถลบ {fileName}
                </p>{" "}
                <p className="font-medium text-center text-lg w-60 text-black/70">
                  เนื่องจาก ไม่มีสิทธิ์ในการลบไฟล์ดังกล่าว
                </p>
              </span>
              <div className="flex gap-10 w-full">
                <motion.button
                  animate={{ scale: isAgreeButtonClicked ? 0.8 : 1 }}
                  transition={{ duration: 0.15 }}
                  onClick={() => {
                    setAgreeButtonClicked(true);
                    setTimeout(() => {
                      onConfirm?.();
                      setAgreeButtonClicked(false);
                    }, 100);
                  }}
                  className="w-full cursor-pointer px-6 py-2 font-semibold bg-[#FF3D3D] text-white rounded-md"
                >
                  เข้าใจแล้ว
                </motion.button>
              </div>
            </div>
          </Modal>
        </motion.div>
      </div>
    </motion.div>
  );
};

export default PermissionDeniedComponent;
