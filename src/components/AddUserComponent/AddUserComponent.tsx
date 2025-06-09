import { useState } from "react";
import Modal from "../Modal/Modal";
import { motion } from "framer-motion";
import axiosInstance from "../../api/axiosInstance";

type AddUserProp = {
  fileName: string;
  onClose: () => void;
  userInfo?: UserForm;
};

type UserForm = {
  position?: string;
  username?: string;
  firstName?: string;
  role?: string;
  lastName?: string;
  email?: string;
  categories?: string;
  password?: string;
  confirmPassword?: string;
};

const AddUserComponent = ({ onClose, userInfo = {} }: AddUserProp) => {
  const [formData, setFormData] = useState<UserForm>(userInfo);
  const [isAddButtonClicked, setAddButtonClicked] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const handleChange = (field: keyof UserForm, value: string) => {
    setFormData({ ...formData, [field]: value });
  };

  const handleSubmit = async () => {
    if (formData.password !== formData.confirmPassword) {
      alert("รหัสผ่านไม่ตรงกัน");
      return;
    }

    setAddButtonClicked(true);
    setIsLoading(true);

    try {
      const response = await axiosInstance.post("/auth/register", {
        id: Date.now().toString(),
        username: formData.username,
        email: formData.email,
        password: formData.password,
        role: formData.role,
        name: formData.firstName,
        surname: formData.lastName,
        categories: formData.categories,
        phoneNumber: "",
        isAdmin: false,
      });

      if (response.status === 201) {
        alert("เพิ่มผู้ใช้สำเร็จ");
        onClose();
      } else {
        alert(`เกิดข้อผิดพลาด: ${response.data.message}`);
      }
    } catch (error: any) {
      console.error("Registration error:", error);
      if (error.response) {
        alert(`เกิดข้อผิดพลาด: ${error.response.data.message}`);
      } else {
        alert("ไม่สามารถเชื่อมต่อกับเซิร์ฟเวอร์");
      }
    } finally {
      setAddButtonClicked(false);
      setIsLoading(false);
    }
  };

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
          <div className="w-[27vw] flex flex-col justify-center gap-6 mt-5">
            <p className="text-2xl font-semibold">เพิ่มบัญชี</p>
            <form>
              <div className="flex gap-5">
                {" "}
                <div className="flex flex-col gap-2">
                  <label className="text-sm font-medium">ตำแหน่ง</label>
                  <input
                    type="text"
                    value={formData.position || ""}
                    placeholder="กรอกตำแหน่ง"
                    onChange={(e) => handleChange("position", e.target.value)}
                    className="w-40 px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500"
                  />
                </div>{" "}
                <div className="flex flex-col gap-2">
                  <label className="text-sm font-medium">แผนก</label>
                  <input
                    type="text"
                    value={formData.categories || ""}
                    placeholder="กรอกตำแหน่ง"
                    onChange={(e) => handleChange("categories", e.target.value)}
                    className="w-40 px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500"
                  />
                </div>
              </div>
              <div className="flex flex-col gap-2 mt-4">
                <label className="text-sm font-medium">ชื่อผู้ใช้</label>
                <input
                  type="text"
                  value={formData.username || ""}
                  placeholder="กรอกชื่อผู้ใช้"
                  onChange={(e) => handleChange("username", e.target.value)}
                  className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500"
                />
              </div>
              <div className="flex gap-5">
                <div className="flex flex-col gap-2 mt-4 w-full">
                  <label className="text-sm font-medium">ชื่อ</label>
                  <input
                    type="text"
                    value={formData.firstName || ""}
                    placeholder="กรอกชื่อ"
                    onChange={(e) => handleChange("firstName", e.target.value)}
                    className="px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500"
                  />
                </div>
                <div className="flex flex-col gap-2 mt-4 w-full">
                  <label className="text-sm font-medium">นามสกุล</label>
                  <input
                    type="text"
                    value={formData.lastName || ""}
                    placeholder="กรอกนามสกุล"
                    onChange={(e) => handleChange("lastName", e.target.value)}
                    className="px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500"
                  />
                </div>
              </div>
              <div className="flex flex-col gap-2 mt-4">
                <label className="text-sm font-medium">อีเมล</label>
                <input
                  type="email"
                  value={formData.email || ""}
                  placeholder="กรอกอีเมล"
                  onChange={(e) => handleChange("email", e.target.value)}
                  className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500"
                />
              </div>
              <div className="flex flex-col gap-2 mt-4">
                <label className="text-sm font-medium">รหัสผ่าน</label>
                <input
                  type="password"
                  value={formData.password || ""}
                  placeholder="กรอกรหัสผ่าน"
                  onChange={(e) => handleChange("password", e.target.value)}
                  className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500"
                />
              </div>
              <div className="flex flex-col gap-2 mt-4">
                <label className="text-sm font-medium">ยืนยันรหัสผ่าน</label>
                <input
                  type="password"
                  value={formData.confirmPassword || ""}
                  placeholder="ยืนยันรหัสผ่าน"
                  onChange={(e) =>
                    handleChange("confirmPassword", e.target.value)
                  }
                  className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500"
                />
              </div>
            </form>
            <div className="flex gap-4 w-full justify-end">
              {" "}
              <button
                type="button"
                onClick={onClose}
                className="px-4 py-2 rounded-md border cursor-pointer border-gray-400"
              >
                ยกเลิก
              </button>
              <motion.button
                animate={{ scale: isAddButtonClicked ? 0.8 : 1 }}
                transition={{ duration: 0.15 }}
                onClick={handleSubmit}
                disabled={isLoading}
                className="w-50 px-6 py-2 cursor-pointer bg-[#0065AD] text-white rounded-md disabled:opacity-50"
              >
                {isLoading ? "กำลังเพิ่ม..." : "เพิ่มบัญชี"}
              </motion.button>
            </div>
          </div>
        </Modal>
      </motion.div>
    </motion.div>
  );
};

export default AddUserComponent;
