import { useState, useEffect } from "react";
import Modal from "../Modal/Modal";
import { motion } from "framer-motion";
import axiosInstance from "../../api/axiosInstance"; // สมมติ axios ที่ตั้งไว้แล้ว
import { Bounce, toast } from "react-toastify";

type User = {
  _id: string;
  username: string;
  name: string;
  surname: string;
  profilePic?: string;
};

type AddIMAPProps = {
  onClose: () => void;
};

type IMAPForm = {
  userId?: string;
  email?: string;
  password?: string;
  host?: string;
  port?: string;
  folder?: string;
};

const AddIMAPComponent = ({ onClose }: AddIMAPProps) => {
  const [formData, setFormData] = useState<IMAPForm>({});
  const [users, setUsers] = useState<User[]>([]);

  const [isLoading, setIsLoading] = useState(false);
  useEffect(() => {
    // โหลดรายชื่อผู้ใช้มาแสดงใน dropdown
    async function fetchUsers() {
      try {
        const res = await axiosInstance.get("auth/users");
        setUsers(res.data.data);
      } catch (error) {
        toast.error("โหลดรายชื่อผู้ใช้ไม่สำเร็จ");
      }
    }
    fetchUsers();
  }, []);

  const handleChange = (field: keyof IMAPForm, value: string) => {
    setFormData({ ...formData, [field]: value });
  };

  const handleSubmit = async () => {
    if (!formData.userId) {
      toast.error("กรุณาเลือกผู้ใช้");
      return;
    }

    setIsLoading(true);
    try {
      await axiosInstance.post("/email-accounts", formData);

      toast.success("✅ เพิ่มบัญชี IMAP สำเร็จ", {
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
      onClose();
    } catch (error: any) {
      if (error.response && error.response.data?.error) {
        toast.error("❌ ไม่สามารถเพิ่มบัญชี IMAP ได้", {
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
        onClose();
      } else {
        toast.error("❌ ไม่สามารถเพิ่มบัญชี IMAP ได้", {
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
        onClose();
      }
    } finally {
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
            <p className="text-2xl font-semibold">เพิ่มบัญชี IMAP</p>
            <form className="flex flex-col gap-2">
              {/* เลือกผู้ใช้ */}
              <div className="flex flex-col gap-2">
                <label className="text-sm font-medium">เลือกผู้ใช้</label>
                <select
                  value={formData.userId || ""}
                  onChange={(e) => {
                    handleChange("userId", e.target.value);
                  }}
                  className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500"
                >
                  <option value="">-- กรุณาเลือกผู้ใช้ --</option>
                  {users.map((user) => (
                    <option key={user._id} value={user._id}>
                      {/* <img
                        className="w-10 h-10 rounded-full"
                        src={`${import.meta.env.VITE_BASE_URL}/${
                          user.profilePic
                        }`}
                        alt=""
                      /> */}
                      {user.name} {user.surname} ({user.username})
                    </option>
                  ))}
                </select>
              </div>

              {/* ฟิลด์อื่น ๆ */}
              <div className="flex flex-col gap-2">
                <label className="text-sm font-medium">อีเมล</label>
                <input
                  type="email"
                  value={formData.email || ""}
                  placeholder="กรอกอีเมล"
                  onChange={(e) => handleChange("email", e.target.value)}
                  className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500"
                />
              </div>

              <div className="flex flex-col gap-2">
                <label className="text-sm font-medium">
                  รหัสผ่าน / App Password
                </label>
                <input
                  type="password"
                  value={formData.password || ""}
                  placeholder="กรอกรหัสผ่านหรือ App Password"
                  onChange={(e) => handleChange("password", e.target.value)}
                  className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500"
                />
              </div>

              <div className="flex flex-col gap-2">
                <label className="text-sm font-medium">โฮสต์ (Host)</label>
                <input
                  type="text"
                  value={formData.host || ""}
                  placeholder="mail.example.com"
                  onChange={(e) => handleChange("host", e.target.value)}
                  className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500"
                />
              </div>

              <div className="flex gap-4">
                <div className="flex flex-col gap-2 w-1/2">
                  <label className="text-sm font-medium">พอร์ต (Port)</label>
                  <input
                    type="number"
                    value={formData.port || ""}
                    placeholder="993"
                    onChange={(e) => handleChange("port", e.target.value)}
                    className="px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500"
                  />
                </div>
                <div className="flex flex-col gap-2 w-1/2">
                  <label className="text-sm font-medium">แผนก</label>
                  <input
                    type="text"
                    value={formData.folder || ""}
                    placeholder="กรอกแผนก"
                    onChange={(e) => handleChange("folder", e.target.value)}
                    className="px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500"
                  />
                </div>
              </div>

              <div className="text-sm bg-blue-50 p-3 rounded-md border border-blue-200 mt-4">
                <ul className="list-disc list-inside text-blue-900">
                  <li>
                    สำหรับบัญชีที่เปิดใช้งาน Two-Factor Authentication (2FA)
                    หรือ Gmail, ใช้ <strong>App Password</strong>{" "}
                    แทนรหัสผ่านปกติ
                  </li>
                  <li>
                    สำหรับบัญชีทั่วไปหรือที่ไม่ได้เปิด 2FA, ใช้{" "}
                    <strong>รหัสผ่านปกติ</strong> ได้เลย
                  </li>
                  <li>
                    หากไม่แน่ใจ ตรวจสอบการตั้งค่าความปลอดภัยของบัญชีอีเมล
                    หรือสอบถามผู้ดูแลระบบ
                  </li>
                </ul>
              </div>

              <div className="flex justify-end gap-4 mt-6">
                <button
                  type="button"
                  onClick={onClose}
                  className="px-4 py-2 rounded-md border cursor-pointer border-gray-400"
                >
                  ยกเลิก
                </button>
                <button
                  type="button"
                  onClick={handleSubmit}
                  disabled={isLoading}
                  className="px-6 py-2 bg-[#03909A] cursor-pointer text-white rounded-md disabled:opacity-50"
                >
                  {isLoading ? "กำลังเพิ่ม..." : "เพิ่มบัญชี IMAP"}
                </button>
              </div>
            </form>
          </div>
        </Modal>
      </motion.div>
    </motion.div>
  );
};

export default AddIMAPComponent;
