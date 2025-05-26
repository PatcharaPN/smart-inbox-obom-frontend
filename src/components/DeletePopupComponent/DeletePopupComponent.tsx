import React, { useState } from "react";
import Modal from "../Modal/Modal";
import { AnimatePresence, motion } from "framer-motion";
import { Icon } from "@iconify/react/dist/iconify.js";
type DeletePopupProps = {
  fileName: string;
  onClose: () => void;
  onConfirm?: () => void;
  onCancel?: () => void;
};

const DeletePopupComponent = ({
  onClose,
  fileName,
  onCancel,
  onConfirm,
}: DeletePopupProps) => {
  const [isButtonClicked, setIsButtonClicked] = useState(false);
  const [isConfirmButtonClicked, setConfirmIsButtonClicked] = useState(false);
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
          className="w-[38vh] h-fit"
        >
          <Modal>
            <div className="w-full flex flex-col items-center justify-center gap-10 mt-5">
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
                  ยืนยันการลบ ${fileName}
                </p>{" "}
                <p className="font-medium text-center text-lg w-60 text-black/70">
                  คุณกำลังจะทำการลบไฟล์ดังกล่าว แน่ใจใช่ไหม ?
                </p>
              </span>
              <div className="flex gap-10">
                <motion.button
                  animate={{ scale: isButtonClicked ? 0.8 : 1 }}
                  transition={{ duration: 0.15 }}
                  onClick={() => {
                    setIsButtonClicked(true);
                    setTimeout(() => {
                      onCancel?.();

                      setIsButtonClicked(false);
                    }, 100);
                  }}
                  className="cursor-pointer px-6 py-2 text-black/40 font-semibold bg-[#D9D9D9] rounded-md"
                >
                  ยัง, เก็บไว้
                </motion.button>
                <motion.button
                  animate={{ scale: isConfirmButtonClicked ? 0.8 : 1 }}
                  transition={{ duration: 0.15 }}
                  onClick={() => {
                    setConfirmIsButtonClicked(true);
                    setTimeout(() => {
                      onConfirm?.();
                      setConfirmIsButtonClicked(false);
                    }, 100);
                  }}
                  className="cursor-pointer px-6 py-2 font-semibold bg-[#FF3D3D] text-white rounded-md"
                >
                  ใช่, ลบเลย !
                </motion.button>
              </div>
            </div>
          </Modal>
        </motion.div>
      </div>
    </motion.div>
  );
};

export default DeletePopupComponent;
