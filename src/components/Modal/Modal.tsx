import React from "react";

const Modal = ({ children }: { children: React.ReactNode }) => {
  return (
    <div className="bg-white w-full h-full rounded-2xl shadow-md p-4">
      {children}
    </div>
  );
};

export default Modal;
