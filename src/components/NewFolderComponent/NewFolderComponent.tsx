import React from "react";
import Modal from "../Modal/Modal";
import { motion } from "framer-motion";

type NewsComponentProps = {
  onClose: () => void;
};

const NewFolderComponent = ({ onClose }: NewsComponentProps) => {
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
            <div>Test</div>
          </Modal>
        </div>
      </div>
    </motion.div>
  );
};

export default NewFolderComponent;
