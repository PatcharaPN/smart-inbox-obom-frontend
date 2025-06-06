import React from "react";

const Modal = ({ children }: { children: React.ReactNode }) => {
  return (
    <div className="bg-white rounded-2xl shadow-md p-5 border-2 border-[#045893]/40 w-fit h-fit">
      {children}
    </div>
  );
};

export default Modal;
