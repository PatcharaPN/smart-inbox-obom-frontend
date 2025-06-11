import { motion } from "framer-motion";
import Modal from "../Modal/Modal";
import { Icon } from "@iconify/react/dist/iconify.js";

type NoIMAPComponentProps = {
  onClose: () => void;
};

const NoIMAPComponent = ({ onClose }: NoIMAPComponentProps) => {
  return (
    <motion.div
      className="fixed top-0 left-0 w-screen h-screen z-50 bg-black/30 flex justify-center items-center"
      onClick={onClose}
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.15, ease: "easeOut" }}
    >
      <motion.div
        initial={{ opacity: 0, scale: 0 }}
        animate={{ opacity: 1, scale: 1 }}
        exit={{ opacity: 0, scale: 0 }}
        transition={{ duration: 0.15, ease: "easeOut" }}
        onClick={(e) => e.stopPropagation()}
      >
        <Modal>
          <div className="w-[25vw] h-fit bg-white rounded-xl text-black z-50 max-w-3xl mx-4 flex flex-col">
            <div className="p-5 flex flex-col gap-3">
              <div className="w-full flex items-center justify-center mb-4">
                <div className="w-25 h-25 rounded-full bg-[#EF5350]/30 flex justify-center items-center">
                  <Icon
                    icon="mdi:email-outline"
                    width="55"
                    height="55"
                    color="#FF3D3D"
                  />
                </div>
              </div>
              <p className="text-lg text-gray-600 text-center">
                ไม่สามารถเชื่อมต่อ IMAP ได้
                เนื่องจากบัญชีอีเมลของคุณไม่ได้เปิดใช้งานฟีเจอร์ IMAP
                กรุณาตรวจสอบการตั้งค่าบัญชีอีเมลของคุณ หากคุณไม่สามารถเปิดใช้งาน
                IMAP ได้เอง โปรดติดต่อฝ่าย IT
                ขององค์กรเพื่อขอความช่วยเหลือในการแก้ไขปัญหานี้
              </p>
              <button
                onClick={onClose}
                className="cursor-pointer mt-4 bg-[#FF3D3D] font-semibold text-white px-4 py-4 rounded hover:bg-[#A71D1D] transition-colors"
              >
                เข้าใจแล้ว
              </button>
            </div>
          </div>
        </Modal>
      </motion.div>
    </motion.div>
  );
};

export default NoIMAPComponent;
