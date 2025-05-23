import React from "react";
import Modal from "../Modal/Modal";
import { motion } from "framer-motion";
import { Icon } from "@iconify/react/dist/iconify.js";
type DeletePopupProps = {
  onClose: () => void;
  onConfirm: () => void;
  onCancel: () => void;
};

const DeletePopupComponent = ({ onClose }: DeletePopupProps) => {
  return (
    <motion.div
      className="fixed inset-0 bg-black/30"
      onClick={onClose}
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.15, ease: "easeOut" }}
    >
      <div className="w-full h-full flex justify-center items-center">
        <div onClick={(e) => e.stopPropagation()} className="w-[38vh] h-[38vh]">
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
              <span className="flex flex-col justify-center items-center">
                <p className="font-semibold text-xl">
                  `ยืนยันการลบ $Query File Name`
                </p>{" "}
                <p className="font-medium text-center text-lg w-60 text-black/70">
                  คุณกำลังจะทำการลบไฟล์ดังกล่าว แน่ใจใช่ไหม ?
                </p>
              </span>
              <div className="flex gap-10">
                <button className="px-6 py-2 font-semibold bg-[#D9D9D9] text-black rounded-md">
                  ยัง, เก็บไว้
                </button>
                <button className="px-6 py-2 font-semibold bg-[#FF3D3D] text-white rounded-md">
                  ใช่, ลบเลย !
                </button>
              </div>
            </div>
          </Modal>
        </div>
      </div>
    </motion.div>
  );
};

export default DeletePopupComponent;
