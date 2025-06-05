import React, { useEffect, useRef, useState } from "react";
import axiosInstance from "../../../api/axiosInstance";
import { Bounce, toast, ToastContainer } from "react-toastify";
import { Icon } from "@iconify/react/dist/iconify.js";

interface CurrentUserProp {
  name: string;
  surname: string;
  username: string;
  phoneNumber: string;
  role: string;
  email: string;
  profilePic: string;
}

const AccountPage = () => {
  const [currentUser, setCurrentUser] = useState<CurrentUserProp | null>(null);
  const [editUser, setEditUser] = useState<CurrentUserProp | null>(null);
  const fetchUser = async () => {
    try {
      // Initial request to get user info
      const response = await axiosInstance.get("/auth/me", {
        withCredentials: true,
      });

      setCurrentUser(response.data.data.user);
      setEditUser(response.data.data.user);
    } catch (error: any) {
      if (error.response?.status === 401) {
        // Token expired or unauthorized, try refreshing token
        try {
          await axiosInstance.post(
            "/auth/refresh",
            {},
            { withCredentials: true }
          );
          // Retry fetching user info after refreshing token
          const retryResponse = await axiosInstance.get("/auth/me", {
            withCredentials: true,
          });
          setCurrentUser(retryResponse.data.data.user);
        } catch (refreshError) {
          console.error("Refresh token failed, please login again");
          // Optionally redirect to login page here
        }
      } else {
        console.error("Failed to fetch user:", error);
      }
    }
  };
  useEffect(() => {
    fetchUser();
  }, []);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setEditUser((prev) => (prev ? { ...prev, [name]: value } : prev));
  };

  const handleSave = async () => {
    // ตรวจสอบฟิลด์ที่สำคัญ เช่น name, surname, email (หรือฟิลด์อื่นๆ ที่ไม่ควรว่าง)
    if (
      !editUser?.name?.trim() ||
      !editUser?.surname?.trim() ||
      !editUser?.email?.trim()
    ) {
      toast.error("❌ กรุณากรอกข้อมูลให้ครบถ้วน", {
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
      return; // หยุดการทำงานก่อนส่งข้อมูล
    }

    try {
      await axiosInstance.put("/auth/me/edit", editUser, {
        withCredentials: true,
      });

      // รีเฟรชข้อมูลหลังแก้ไข
      const response = await axiosInstance.get("/auth/me", {
        withCredentials: true,
      });
      setCurrentUser(response.data.data.user);
      setEditUser(response.data.data.user);

      toast.success("✅ แก้ไขข้อมูลสำเร็จ", {
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
      fetchUser();
    } catch (error) {
      toast.error("❌ ไม่สามารถแก้ไขข้อมูลได้", {
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
  };
  const fileInputRef = useRef<HTMLInputElement | null>(null);

  const handleUploadClick = () => {
    fileInputRef.current?.click();
  };

  const handleProfilePicChange = async (
    e: React.ChangeEvent<HTMLInputElement>
  ) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const formData = new FormData();
    formData.append("profilePic", file);

    try {
      const refreshed = await axiosInstance.get("/auth/me", {
        withCredentials: true,
      });

      setCurrentUser(refreshed.data.data.user);
      setEditUser(refreshed.data.data.user);

      toast.success("✅ รูปโปรไฟล์ถูกอัปโหลดเรียบร้อยแล้ว");
    } catch (error) {
      console.error("Upload failed", error);
      toast.error("❌ อัปโหลดรูปไม่สำเร็จ");
    }
  };

  console.log(currentUser?.profilePic);
  return (
    <div className="flex flex-col w-full px-40 py-10 gap-10 ">
      {/* Header */}
      <div className="grid grid-cols-2 items-center h-[20vh]">
        <div className="flex flex-col justify-end h-full">
          <p className="text-2xl font-semibold ">ข้อมูลส่วนตัว</p>
        </div>
        <div className="flex justify-center items-center">
          <div className="flex justify-center flex-col gap-2 items-center">
            <div
              onClick={handleUploadClick}
              className="relative w-40 h-40 rounded-full overflow-hidden group cursor-pointer"
            >
              {/* Profile Image */}
              <img
                className="w-full h-full object-cover"
                src={`${import.meta.env.VITE_BASE_URL}/${
                  currentUser?.profilePic
                }`}
                alt="profile"
              />

              {/* Overlay Icon - shows on hover */}
              <div className="absolute inset-0 bg-black/40 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                <Icon
                  icon="material-symbols:upload-rounded"
                  width="45"
                  height="45"
                  color="#ffffff"
                />
              </div>
            </div>
            <p className="opacity-55">คลิ๊กที่รูปเพื่อเปลี่ยน</p>

            {/* Hidden input for upload */}
            <input
              type="file"
              ref={fileInputRef}
              onChange={handleProfilePicChange}
              accept="image/*"
              className="hidden"
            />
          </div>
        </div>
      </div>
      {/* Personal Info Form */}
      <form className="flex flex-col gap-8">
        {/* ชื่อ-นามสกุล */}
        <div className="grid grid-cols-2 gap-10">
          <div className="flex flex-col gap-2">
            <label htmlFor="firstName" className="text-sm font-medium">
              ยูส
            </label>
            <input
              id="firstName"
              placeholder={currentUser?.name}
              name="name"
              type="text"
              value={editUser?.name}
              onChange={handleChange}
              className="w-full max-w-md rounded-xl border-2 border-black/70 p-2"
            />
          </div>
          <div></div>
          <div className="flex flex-col gap-2">
            <label htmlFor="firstName" className="text-sm font-medium">
              ชื่อ
            </label>
            <input
              id="firstName"
              placeholder={currentUser?.name}
              name="name"
              type="text"
              value={editUser?.name}
              onChange={handleChange}
              className="w-full max-w-md rounded-xl border-2 border-black/70 p-2"
            />
          </div>
          <div className="flex flex-col gap-2">
            <label htmlFor="lastName" className="text-sm font-medium">
              นามสกุล
            </label>
            <input
              value={editUser?.surname}
              onChange={handleChange}
              id="surname"
              placeholder={currentUser?.surname}
              name="lastName"
              type="text"
              className="w-full max-w-md rounded-xl border-2 border-black/70 p-2"
            />
          </div>
        </div>

        {/* เบอร์โทร-ตำแหน่ง */}
        <div className="grid grid-cols-2 gap-10">
          <div className="flex flex-col gap-2">
            <label htmlFor="phone" className="text-sm font-medium">
              เบอร์โทร
            </label>
            <input
              value={editUser?.phoneNumber}
              onChange={handleChange}
              id="phoneNumber"
              placeholder={currentUser?.phoneNumber}
              name="phoneNumber"
              type="text"
              className="w-full max-w-md rounded-xl border-2 border-black/70 p-2"
            />
          </div>
          <div className="flex flex-col gap-2">
            <label htmlFor="position" className="text-sm font-medium">
              ตำแหน่ง
            </label>
            <input
              value={editUser?.role}
              onChange={handleChange}
              id="role"
              placeholder={`ตำแหน่ง : ${currentUser?.role}`}
              name="role"
              type="text"
              className="w-full max-w-md rounded-xl border-2 border-black/70 p-2"
            />
          </div>
        </div>

        {/* Security Section */}
        {/* <div className="flex flex-col gap-6 mt-4">
          <p className="text-2xl font-semibold">ความปลอดภัย</p>

          <div className="flex flex-col gap-2">
            <label htmlFor="email" className="text-sm font-medium">
              อีเมล
            </label>
            <input
              id="email"
              value={editUser?.email}
              onChange={handleChange}
              name="email"
              placeholder={currentUser?.email}
              type="email"
              className="w-full max-w-md rounded-xl border-2 border-black/70 p-2"
            />
          </div>

          <div className="flex flex-col gap-2">
            <label htmlFor="password" className="text-sm font-medium">
              รหัสผ่าน
            </label>
            <input
              id="password"
              name="password"
              type="password"
              className="w-full max-w-md rounded-xl border-2 border-black/70 p-2"
            />
          </div>
        </div> */}

        {/* Logout Button */}
        <div className="flex justify-end mt-10">
          <button
            type="button"
            onClick={handleSave}
            className="cursor-pointer bg-[#0065AD] text-white px-6 py-3 rounded-xl hover:bg-[#00406D] transition"
          >
            บันทึกการเปลี่ยนแปลง
          </button>
        </div>
      </form>
      <ToastContainer
        position="bottom-right"
        autoClose={5000}
        hideProgressBar={false}
        newestOnTop
        closeOnClick
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
        theme="colored"
        transition={Bounce}
      />
    </div>
  );
};

export default AccountPage;
