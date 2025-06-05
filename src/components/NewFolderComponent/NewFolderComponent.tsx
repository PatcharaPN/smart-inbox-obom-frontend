import React, { useState } from "react";
import Modal from "../Modal/Modal";
import { motion } from "framer-motion";
import { Bounce, toast } from "react-toastify";

type NewsComponentProps = {
  onClose: () => void;
  currentPath?: string;
  onSuccess?: () => void;
};

const NewFolderComponent = ({
  onClose,
  currentPath = "Uploads",
  onSuccess,
}: NewsComponentProps) => {
  const [folderName, setFolderName] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleCreateFolder = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!folderName.trim()) {
      setError("ชื่อโฟลเดอร์ห้ามเว้นว่าง");
      return;
    }

    setLoading(true);
    setError("");

    try {
      const response = await fetch(
        `${
          import.meta.env.VITE_BASE_URL
        }/create-folder?path=${encodeURIComponent(
          currentPath
        )}&foldername=${encodeURIComponent(folderName)}`,
        {
          method: "POST",
        }
      );

      const result = await response.json();
      console.log("📁 สร้างโฟลเดอร์:", result);

      if (response.ok) {
        toast.success("📁 สร้างโฟลเดอร์สำเร็จ!", {
          position: "bottom-right",
          autoClose: 5000,
          hideProgressBar: false,
          closeOnClick: false,
          pauseOnHover: true,
          draggable: true,
          progress: undefined,
          theme: "light",
          transition: Bounce,
        });

        onSuccess?.(); // ✅ โหลดข้อมูลใหม่ก่อน
        onClose(); // ✅ แล้วค่อยปิด modal
      } else {
        setError(result.error || "เกิดข้อผิดพลาด");
        toast.error("❌ สร้างโฟลเดอร์ไม่สำเร็จ", {
          position: "bottom-right",
          autoClose: 5000,
          hideProgressBar: false,
          closeOnClick: false,
          pauseOnHover: true,
          draggable: true,
          progress: undefined,
          theme: "light",
          transition: Bounce,
        });
      }
    } catch (err) {
      setError("ไม่สามารถเชื่อมต่อกับเซิร์ฟเวอร์");
      toast.error("🚫 ไม่สามารถเชื่อมต่อกับเซิร์ฟเวอร์", {
        position: "bottom-right",
        autoClose: 5000,
        hideProgressBar: false,
        closeOnClick: false,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
        theme: "light",
        transition: Bounce,
      });
    } finally {
      setLoading(false);
    }
  };

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
        <motion.div
          initial={{ opacity: 0, scale: 0 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0, scale: 0 }}
          transition={{ duration: 0.15, ease: "easeOut" }}
          onClick={(e) => e.stopPropagation()}
          className="w-[38vh] h-fit"
        >
          <Modal>
            <form
              onSubmit={handleCreateFolder}
              className="p-5 flex flex-col gap-3 w-full"
            >
              <div className="flex justify-between">
                <p className="text-xl">สร้างโฟลเดอร์ใหม่</p>
              </div>
              <label>ชื่อโฟลเดอร์*</label>
              <input
                type="text"
                value={folderName}
                onChange={(e) => setFolderName(e.target.value)}
                className="w-full h-10 border border-black/20 rounded-md px-3 mt-2 mb-2"
                placeholder="ชื่อโฟลเดอร์"
              />
              {error && <p className="text-red-500 text-sm">{error}</p>}
              <div className="flex  gap-3 mt-5">
                <button
                  onClick={onClose}
                  className="w-full flex bg-[#D9D9D9] h-15 text-black/40 p-3 rounded-md hover:bg-black/40 hover:text-white transition duration-200 cursor-pointer"
                  disabled={loading}
                >
                  {loading ? "กำลังสร้าง..." : "ยกเลิก"}
                </button>{" "}
                <button
                  type="submit"
                  className="w-full bg-[#0065AD] h-15 text-white p-3 rounded-md hover:bg-[#005A8C] transition duration-200 cursor-pointer"
                  disabled={loading}
                >
                  {loading ? "กำลังสร้าง..." : "สร้างโฟลเดอร์"}
                </button>
              </div>
            </form>
          </Modal>
        </motion.div>
      </div>{" "}
    </motion.div>
  );
};

export default NewFolderComponent;
