import React from "react";
import { Icon } from "@iconify/react/dist/iconify.js";

type ModalProps = {
  children: React.ReactNode;
  onBack?: () => void;
};

const Modal = ({ children, onBack }: ModalProps) => {
  return (
    <div className="bg-white rounded-2xl shadow-md p-5 border-2 border-[#045893]/40 w-fit h-fit relative">
      {onBack && (
        <button
          onClick={onBack}
          className="cursor-pointer absolute top-10 left-10 text-gray-600 hover:text-[#045893] flex items-center gap-4"
        >
          <div className="flex items-center gap-4">
            {" "}
            <Icon icon="pajamas:go-back" width="25" height="25" />
            <span className="text-sm">ย้อนกลับ</span>
          </div>
        </button>
      )}
      <div className="mt-5">{children}</div>
    </div>
  );
};

export default Modal;
